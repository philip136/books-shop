from magazine.models import (Product,
                             CartItem,
                             Cart,
                             Order,
                             TypeProduct,
                             Location,
                             Shop,
                             Profile,
                             RoomOrder)
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.contrib.gis.geos import (GEOSGeometry,fromstr)
from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.generics import (ListAPIView,
                                     RetrieveAPIView,
                                     DestroyAPIView,
                                     UpdateAPIView,
                                     ListCreateAPIView,
                                     RetrieveUpdateDestroyAPIView,
                                     CreateAPIView)
from rest_framework.response import Response
from rest_framework.permissions import (AllowAny,
                                        IsAuthenticated)
from magazine.api.serializer import (ProductSerializer,
                                     CartItemSerializer,
                                     CartSerializer,
                                     TypeProductSerializer,
                                     ProfileSerializer,
                                     OrderSerializer,
                                     LocationSerializer,
                                     OrderRoomSerializer)
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from decimal import Decimal
from django.utils.decorators import method_decorator
from typing import Union
from .decorators import (serializer_validate,
                        operations_with_cart)
import datetime


class TypeProductsApi(RetrieveAPIView):
    """
    Api for any type products
    """
    lookup_field = 'type'
    serializer_class = TypeProductSerializer
    permission_classes = (AllowAny,)

    def get(self, request: HttpRequest, *args, **kwargs) -> Response:
        products: list = [product for product in self.get_queryset().iterator()]
        return Response(self.serializer_class(products, many=True).data)

    def get_queryset(self):
        type_name: str = self.kwargs.get('type')
        products: list = Product.objects.filter(type__type__icontains=type_name)
        return products


class ProductsApi(ListAPIView):
    """ 
    Api for any products
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    @method_decorator(cache_page(86400))
    def list(self, request: HttpRequest) -> Response:
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class ProductDetailApi(RetrieveAPIView):
    """
    Api for any products detail
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)


_ADD_TO_CART = "add_to_cart"
_REMOVE_FROM_CART = "remove_from_cart"
_CHANGE_FROM_CART = "change_from_cart"


class CartApi(RetrieveAPIView):
    """
    Api for show a cart 
    """
    serializer_class = CartSerializer
    permission_classes = (IsAuthenticated,)
    lookup_field = 'username'

    def get_queryset(self):
        user: User = self.request.user
        profile: Profile = Profile.objects.get(user=user)
        cart: Union[Cart, None] = Cart.objects.filter(owner=profile).first()
        if cart is None:
            cart: Cart = Cart.objects.create(owner=profile)
            cart.save()
        return cart

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_queryset())
        return Response(serializer.data, status=status.HTTP_200_OK)



class CartItemApi(RetrieveAPIView):
    """ 
    Api for create item and after create cart
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsAuthenticated,)
    
    @method_decorator([serializer_validate(serializer_class, None),
                    operations_with_cart(_ADD_TO_CART)])
    def post(self, request, *args, **kwargs):
        return Response({"message": "Объект корзины успешно создан"},
                        status=status.HTTP_201_CREATED)


class UpdateCartItemApi(UpdateAPIView):
    """ 
    Api for update cart item , for example common count
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsAuthenticated,)

    @method_decorator([serializer_validate(serializer_class, None),
                    operations_with_cart(_CHANGE_FROM_CART)])
    def update(self, request, *args, **kwargs):
        return Response({"message": "Товар успешно изменен"},
                        status=status.HTTP_201_CREATED)


class DeleteItemApi(DestroyAPIView):
    """ 
    Api for delete item from cart
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsAuthenticated,)

    @method_decorator([operations_with_cart(_REMOVE_FROM_CART)])
    def destroy(self, request, *args, **kwargs):
        return Response({"message": "Товар удален из корзины"},
                        status=status.HTTP_204_NO_CONTENT)


class LocationList(ListCreateAPIView):
    """
    Api for get all markers on map
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    @method_decorator([serializer_validate(serializer_class, None)])
    def list(self, request):
        return super(LocationList, self).list(request)


class LocationDetail(RetrieveUpdateDestroyAPIView):
    """
     Api for detail marker on map
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = (IsAuthenticated,)

    @method_decorator([serializer_validate(serializer_class, None)])
    def update(self, request, *args, **kwargs):
        """
        Setup position for users on React map
        """
        user: User = request.user
        coords_data = kwargs['serializer_data']
        profile: Profile = Profile.objects.get(user=user)
        location: Location = Location.objects.filter(profile=profile).first()
        if location is None:
            location = Location.objects.create(
                title=f'Текущая позиция {user.username}',
                profile=profile,
                point=fromstr(
                    "POINT%s %s" % (coords_data['latitude'], coords_data['longitude']),
                     srid=4326
                )
            )
            location.save()
        else:
            location.latitude = coords_data['latitude']
            location.longitude = coords_data['longitude']
            location.save()
        return Response({"message": "Текущее местоположение изменено"},
                        status=status.HTTP_200_OK)

        


class ProfileApi(RetrieveAPIView):
    """
    Profile API
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)


class OrderRoomApi(RetrieveAPIView, DestroyAPIView):
    """
    Api for finish payment
    """
    queryset = RoomOrder.objects.all()
    serializer_class = OrderRoomSerializer
    permission_classes = (IsAuthenticated,)

    def destroy(self, request, *args, **kwargs):
        pk = kwargs['pk']
        room = RoomOrder.objects.get(pk=pk)
        client, personal = room.participants.first(), room.participants.last()
        order = Order.objects.get(user__username=client.user.username)
        order.check_status = "Оплачен"
        order.payment = True
        order.items.products.all().delete()
        order.delete()
        room.delete()
        return Response({'message': 'Клиент оплатил товар'},
                        status=status.HTTP_204_NO_CONTENT)


class OrderRoomConnectApi(RetrieveAPIView):
    """
    Api for get room order for courier
    """
    queryset = RoomOrder.objects.all()
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        username: str = request.data.get('username')
        order_room: RoomOrder = RoomOrder.objects.filter(
            participants__user__username__icontains=username
        ).first()
        if order_room is not None:
            return Response({'message': order_room.id}, status=status.HTTP_200_OK)
        return Response({'message': 'Текущих комнат нет'})


class OrderSuccessApi(CreateAPIView):
    """
    Api for create order and create OrderRoom
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def operations_with_room(shop: Shop, type_delivery: str, order_data: dict, customer: Profile):
        room: RoomOrder = RoomOrder()
        order: Order = Order.objects.create(**order_data)
        room.save()
        order.save()

        another_location: Union[Location, None] = None
        courier_or_personal: Union[Profile, None] = None

        customer_location: Location = Location.objects.update_or_create(
                                        title=f'{customer}',
                                        profile=order_data.get('user'),
                                        defaults={'updated_at': datetime.datetime.now()}
                                    )[0]
        
        if type_delivery == "Самовывоз":
            another_location: Location = shop.position
            courier_or_personal: Profile = shop.personal.first()

        elif type_delivery == "Доставка курьером":
            courier: Profile = order.search_free_driver()
            if courier is not None:
                courier_or_personal: Profile = courier
                another_location: Location = Location.objects.update_or_create(
                    title=f'{courier.user.username}',
                    profile=courier
                )[0]
            else:
                return Response({'message': "Простите свободных курьеров сейчас нет, "
                                "обратитесь позже"}, status=status.HTTP_200_OK)
        room.participants.add(customer, courier_or_personal)
        room.locations.add(customer_location, another_location)

    @method_decorator([serializer_validate(serializer_class, None)])
    def post(self, request, *args, **kwargs):
        customer: Profile = Profile.objects.get(user=request.user)
        shop: Shop = Shop.objects.first()
        order_data: dict = kwargs['serializer_data']
        cart: Cart = Cart.objects.get(owner=customer)
        order_data.update({
            'user': customer,
            'items': cart
        })
        
        if shop.is_working():
            delivery_type: str = order_data.get('purchase_type')
            self.operations_with_room(shop, delivery_type, order_data, customer)
            return Response({"message":"Комната успешно создана"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Простите но наш магазин уже закрыт, "
                        "обратитесь позже мы работаем с 9:00 - 22:00 каждый день"}, 
                        status=status.HTTP_200_OK)








        
        

        

        

        




    

    
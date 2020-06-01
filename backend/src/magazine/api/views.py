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
from django.contrib.gis.geos import (GEOSGeometry)
import datetime
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


class TypeProductsApi(RetrieveAPIView):
    """
    Api for any type products
    """
    lookup_field = 'type'
    serializer_class = TypeProductSerializer
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        products = [product for product in self.get_queryset()]
        return Response(self.serializer_class(products,
                                              many=True,
                                              context={'request': request}).data)

    def get_queryset(self):
        type_name = self.kwargs.get('type')
        type_obj = TypeProduct.objects.raw(
            "SELECT id FROM magazine_typeproduct WHERE type LIKE LOWER(%s)", [type_name]
        )
        products = Product.objects.raw(
            "SELECT id FROM magazine_product WHERE id=%s", [type_obj.id]
        )
        return products


class ProductsApi(ListAPIView):
    """ 
    Api for any products
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)


class ProductDetailApi(RetrieveAPIView):
    """
    Api for any products detail
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)


class CartItemApi(RetrieveAPIView):
    """ 
    Api for create item and after create cart
    """

    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        product = request.data.get('product_name', None)
        if product is None:
            return Response({
                'message': "Продукт корзины не найден"
            }, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            product = Product.objects.get(name=product)
            count = request.data.get('count', None)
            product_total = product.get_price() * int(count)
            try:
                cart = Cart.objects.get(owner=request.user)
                item = cart.products.get(product=product)
                if item in cart.products.all():
                    return Response({'message': 'Данный продукт уже есть у вас в корзине'},
                                    status=status.HTTP_200_OK
                                    )
                else:
                    raise ObjectDoesNotExist

            except ObjectDoesNotExist:
                item = CartItem.objects.create(
                    product=product,
                    count=count,
                    product_total=Decimal(product_total)
                )
                item.save()

            count_after = product.get_count - int(count)
            product.set_count = count_after

            try:
                cart = Cart.objects.get(owner=request.user)
            except Cart.DoesNotExist:
                cart = Cart()
                cart.owner = request.user
                cart.save()
            cart.add_to_cart(item, request.user)
            new_cart_total = 0.00
            for item in cart.products.all():
                new_cart_total += float(item.product_total) 
            cart.cart_total = new_cart_total
            cart.save()
            product.save()
            return Response({'message': 'Объект корзины успешно создан'},
                            status=status.HTTP_201_CREATED)
        return Response({'message': serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class CartApi(ListAPIView):
    """
    Api for show a cart 
    """
    serializer_class = CartSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        try:
            cart = Cart.objects.filter(owner=self.request.user)
        except Cart.DoesNotExist:
            cart = Cart()
            cart.owner = self.request.user
            cart.save()
        return cart


class DeleteItemApi(DestroyAPIView):
    """ 
    Api for delete item from cart
    """
    queryset = CartItem.objects.all()
    permission_classes = (IsAuthenticated,)

    def destroy(self, request, *args, **kwargs):
        pk = kwargs['pk']
        cart_item = CartItem.objects.get(pk=pk)
        product = cart_item.product
        try:
            cart = Cart.objects.get(owner=request.user)
        except Cart.DoesNotExist:
            cart = Cart()
            cart.owner = request.user
            cart.save()
        cart.remove_from_cart(product, cart_item.id)
        return Response({'message': f'Продукт {product} удален из корзины'},
                        status=status.HTTP_204_NO_CONTENT
                        )


class LocationList(ListCreateAPIView):
    """
        Api for get all markers on map
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def list(self, request):
        self.serializer_class = LocationSerializer
        return super(LocationList, self).list(request)


class LocationDetail(RetrieveUpdateDestroyAPIView):
    """
        Api for detail marker on map
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_object()
        serializer = LocationSerializer(queryset, many=False)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """ Setup pos for users calling in React map"""
        user = request.data.get('user')
        point = request.data.get('point').split(' ')
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            location = Location.objects.create(
                point=GEOSGeometry("POINT(%s %s)" % (point[0], point[1]))
            )
            profile = Profile.objects.get(user=user)
            profile.location = location
            return Response({
                'current_position': profile.location
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'Not valid serializer'
        }, status=status.HTTP_400_BAD_REQUEST)


class UpdateCartItemApi(UpdateAPIView):
    """ 
    Api for update cart item , for example common count
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        count = request.data.get('count', None)
        if count is None:
            return Response({'message': "Продукт корзины не найден"},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            pk = self.kwargs['pk']
            cart_item = CartItem.objects.get(pk=pk)
            try:
                cart = Cart.objects.get(owner=request.user)
            except Cart.DoesNotExist:
                cart = Cart()
                cart.owner = request.user
                cart.save()
            cart.change_from_cart(count, cart_item)
            cart.save()
            return Response({'message': 'Продукт корзины успешно изменен'},
                            status=status.HTTP_200_OK)
        return Response({'message': 'Введенные данные невалидны'})


class ProfileApi(RetrieveAPIView):
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
        order.items.products.all().delete()
        order.delete()
        room.delete()
        return Response({'message': 'Клиент оплатил товар'},
                        status=status.HTTP_204_NO_CONTENT
                        )


class OrderRoomConnectApi(RetrieveAPIView):
    """
    Api for get room order for courier
    """
    queryset = RoomOrder.objects.all()
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        order_room = RoomOrder.objects.filter(
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

    def post(self, request, *args, **kwargs):
        customer = User.objects.get(username=request.data.get('user'))
        items = Cart.objects.filter(owner=customer).first()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data = {
                'user': customer,
                'items': items,
                'total_price': items.cart_total,
                'first_name': request.data.get('first_name'),
                'last_name': request.data.get('last_name'),
                'phone': request.data.get('phone'),
                'date': datetime.datetime.now(),
                'purchase_type': request.data.get('purchase_type'),
            }
            shop = Shop.objects.first()
            if shop._working():
                if request.data.get('purchase_type') == "Самовывоз":
                    order = Order.objects.create(**data)
                    order.save()
                    roomOrder = RoomOrder()
                    roomOrder.save()
                    profile = Profile.objects.get(user=customer)
                    personal = shop.personal.filter(busy=False).first()
                    location_customer = Location.objects.create(
                        title=f'{profile}',
                        profile=profile
                    )
                    location_customer.save()
                    roomOrder.participants.add(profile)
                    roomOrder.participants.add(personal)
                    roomOrder.locations.add(location_customer)
                    roomOrder.locations.add(shop.position)
                    serializer_room = OrderRoomSerializer(instance=roomOrder)
                    return Response({
                        'message': serializer_room.data,
                    }, status=status.HTTP_201_CREATED)
                else:
                    order = Order.objects.create(**data)
                    profile_customer = Profile.objects.get(user=customer)
                    profile_driver = order.search_free_driver()
                    if profile_driver is not None:
                        profile_driver.get_busy = True
                        room_order = RoomOrder()
                        room_order.save()
                        customer_location = Location.objects.create(
                            title=f'{profile_customer}',
                            profile=profile_customer)
                        driver_location = Location.objects.create(
                            title=f'{profile_driver}',
                            profile=profile_driver
                        )
                        customer_location.save()
                        driver_location.save()
                        room_order.participants.add(profile_customer)
                        room_order.participants.add(profile_driver)
                        room_order.locations.add(customer_location)
                        room_order.locations.add(driver_location)
                        serializer_room = OrderRoomSerializer(instance=room_order)
                        order.save()
                        return Response({
                            'message': serializer_room.data,
                        }, status=status.HTTP_201_CREATED)
                    return Response({
                        'message': "Простите свободных курьеров сейчас нет, "
                        "обратитесь позже"
                    }, status=status.HTTP_200_OK)

            return Response({
                'message': "Простите но наш магазин уже закрыт, "
                "обратитесь позже мы работаем с 9:00 - 22:00 каждый день"
            }, status=status.HTTP_200_OK)
        return Response({'message': serializer.data}, status=status.HTTP_400_BAD_REQUEST)








        
        

        

        

        




    

    
from django.shortcuts import render
from .models import (Product,
                     CartItem,
                     Cart,
                     Order,
                     TypeProduct,
                     Location)
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import (ListAPIView,
                                     RetrieveAPIView,
                                     DestroyAPIView,
                                     UpdateAPIView,
                                     ListCreateAPIView,
                                     RetrieveUpdateDestroyAPIView)
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import (IsAdminUser,
                                        AllowAny,
                                        IsAuthenticated)
from django.shortcuts import get_object_or_404
from .serializer import (ProductSerializer,
                         CartItemSerializer,
                         CartSerializer,
                         TypeProductSerializer,
                         OrderSerializer,
                         LocationSerializer)
from django.urls import reverse
from django.http import QueryDict
from django.core.exceptions import ObjectDoesNotExist
from decimal import Decimal


class TypeProductsApi(RetrieveAPIView):
    """
    Api for any type products
    """
    lookup_field = 'type'
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        products = [product for product in self.get_queryset()]
        return Response({'Products': ProductSerializer(products, many=True).data})

    def get_queryset(self):
        type_name = self.kwargs.get('type')
        type_obj = TypeProduct.objects.get(type__icontains=type_name)
        products = Product.objects.filter(type=type_obj.id)
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
                item = CartItem.objects.filter(
                    product=product
                ).first()
                cart = Cart.objects.get(owner=request.user)
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
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def list(self, request):
        self.serializer_class = LocationSerializer
        return super(LocationList, self).list(request)


class LocationDetail(RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_object()
        serializer = LocationSerializer(queryset, many=False)
        return Response(serializer.data)

    
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


class OrderSuccessApi(CreateModelMixin, RetrieveAPIView):
    """
    Api for create order and moving to courier
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            # check if type of purchase 'самовывоз' return message response -> look on the map with shop
            # if type of purchase 'курьером' check person users which is available
            # if is than send client geo position
            return Response({'message': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'message': serializer.data}, status=status.HTTP_400_BAD_REQUEST)








        
        

        

        

        




    

    
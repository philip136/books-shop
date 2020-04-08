from django.shortcuts import render
from .models import (Product,
                     CartItem,
                     Cart,
                     Order,
                     TypeProduct)
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import (ListAPIView,
                                     RetrieveAPIView,
                                     DestroyAPIView,
                                     UpdateAPIView)
from rest_framework.response import Response
from rest_framework.permissions import (IsAdminUser,
                                        AllowAny,
                                        IsAuthenticated)
from django.shortcuts import get_object_or_404
from .serializer import (ProductSerializer,
                         CartItemSerializer,
                         CartSerializer,
                         TypeProductSerializer)
from django.urls import reverse
from django.http import QueryDict
from decimal import Decimal



class TypeProductsApi(RetrieveAPIView):
    """
    Api for any type products
    """
    lookup_field = 'type'
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        type = kwargs.get('type')
        products = [product for product in self.get_queryset()]
        return Response({f'Products: {type}': ProductSerializer(products,many=True).data})

    def get_queryset(self):
        type_name = self.kwargs.get('type')
        type_obj = TypeProduct.objects.get(type=type_name)
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
    permission_classes = (AllowAny, )


class CartItemApi(RetrieveAPIView):
    """ 
    Api for create item and after create cart
    """

    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated,]

    def post(self, request, *args, **kwargs):
        product = request.data.get('product_name', None)
        if product is None:
            return Response({
                'message': "Продукт корзины не найден"
            })
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            product = Product.objects.get(name=product)
            count = request.data.get('count', None)
            product_total = product.get_price() * int(count)
            item,_ = CartItem.objects.get_or_create(
                product=product,
                count=count,
                product_total=Decimal(product_total)
            )
            count_after = product.get_count - int(count)
            product.set_count = count_after
            item.save()
            # create cart if session doesn't have her
            # else add cartItem to cart
            try:
                cart_id = request.session['cart_id']
                cart = Cart.objects.get(pk=str(cart_id))
                request.session['total'] = cart.products.count()
            except:
                cart = Cart()
                cart.save()
                cart_id = str(cart.id)
                request.session['cart_id'] = str(cart_id)
                cart = Cart.objects.get(pk=cart_id)
            cart.add_to_cart(item)
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
        cart_id = self.request.session['cart_id']
        cart = Cart.objects.filter(id=cart_id)
        self.request.session['total'] = cart[0].products.count()
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
            cart_id = request.session['cart_id']
            cart = Cart.objects.get(pk=str(cart_id))
            request.session['total'] = cart.products.count()
        except:
            cart = Cart()
            cart.save()
            cart_id = str(cart.id)
            request.session['cart_id'] = str(cart_id)
            cart = Cart.objects.get(pk=cart_id)
        cart.remove_from_cart(product,cart_item.id)
        return Response({'message': f'Продукт {product} удален из корзины'},
                        status=status.HTTP_204_NO_CONTENT
        )

    
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
                cart_id = request.session['cart_id']
                cart = Cart.objects.get(pk=str(cart_id))
                request.session['total'] = cart.products.count()
            except:
                cart = Cart()
                cart.save()
                cart_id = str(cart.id)
                request.session['cart_id'] = str(cart_id)
                cart = Cart.objects.get(pk=cart_id)
            cart.change_from_cart(count,cart_item)
            cart.save()
            serializer.save()
            return Response({'message': 'Продукт корзины успешно изменен'},
                              status=status.HTTP_200_OK)
        return Response({'message': 'Введенные данные невалидны'})





        
        

        

        

        




    

    
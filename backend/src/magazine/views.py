from django.shortcuts import render
from .models import (Product,
                     CartItem,
                     Cart,
                     Order)
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import (ListAPIView,
                                     RetrieveAPIView)
from rest_framework.response import Response
from rest_framework.permissions import (IsAdminUser,
                                        AllowAny,
                                        IsAuthenticated)
from django.shortcuts import get_object_or_404
from .serializer import (ProductSerializer,
                         CartItemSerializer,
                         CartSerializer)
from django.urls import reverse
from django.http import QueryDict
from decimal import Decimal


class ProductsApi(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)


class ProductDetailApi(RetrieveAPIView):
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
        product = request.data.get('product', None)
        if product is None:
            return Response({
                'message': "Product doesn't exist!"
            })
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            product = Product.objects.get(name=product)
            count = request.data.get('count', None)
            product_total = product.get_price() * int(count)
            item = CartItem.objects.create(
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
            cart.add_to_cart(item.id)
            new_cart_total = 0.00
            for item in cart.products.all():
                new_cart_total += float(item.product_total)
            cart.cart_total = new_cart_total
            cart.save()
            product.save()
            serializer.save()
            return Response({'message': 'Success create cartItem'},
                        status=status.HTTP_201_CREATED)
        return Response({'message': {serializer.errors}},
                        status=status.HTTP_400_BAD_REQUEST)



class CartApi(ListAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = (IsAuthenticated,)

        




    

    
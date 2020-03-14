from django.shortcuts import render
from .models import Product
from rest_framework.generics import (ListAPIView,
                                     RetrieveAPIView)
from rest_framework.response import Response
from rest_framework.permissions import (IsAdminUser,
                                        AllowAny )
from .serializer import ProductSerializer


class ProductsApi(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

class ProductDetailApi(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny, )
    

    
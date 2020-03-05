from django.shortcuts import render
from .models import Product
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .serializer import ProductSerializer


class ProductsApi(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
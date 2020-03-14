from django.urls import path
from .views import (ProductsApi,
                    ProductDetailApi)


app_name = "magazine"
urlpatterns = [
    path("api/products/", ProductsApi.as_view(), name="products"),
    path("api/products/<int:pk>/", ProductDetailApi.as_view(), name="product"),
]

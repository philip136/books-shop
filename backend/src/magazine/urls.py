from django.urls import path
from .views import ProductsApi


app_name = "magazine"
urlpatterns = [
    path("api/products/", ProductsApi.as_view(), name="products"),
]

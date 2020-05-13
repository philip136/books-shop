from django.urls import (path,
                         re_path)
from .views import (ProductsApi,
                    TypeProductsApi,
                    ProductDetailApi,
                    CartItemApi,
                    CartApi,
                    DeleteItemApi,
                    UpdateCartItemApi,
                    OrderSuccessApi,
                    LocationList,
                    LocationDetail,
                    OrderRoomApi,
                    ProfileApi,
                    )


app_name = "magazine"
urlpatterns = [
    path("api/products/type/<slug:type>/", TypeProductsApi.as_view(), name="filter-products"),
    path("api/products/", ProductsApi.as_view(), name="products"),
    path("api/products/<int:pk>/", ProductDetailApi.as_view(), name="product"),
    path("api/cart/<int:pk>/", CartItemApi.as_view(), name="cart-item"),
    path("api/cart/", CartApi.as_view(), name='my-cart'),
    path("api/cart/delete/<int:pk>/", DeleteItemApi.as_view(), name="delete-item"),
    path("api/cart/update/<int:pk>/", UpdateCartItemApi.as_view(), name="update-item"),
    path("api/order/success/", OrderSuccessApi.as_view(), name="order-success"),
    path("api/location/", LocationList.as_view(), name="location-list"),
    path("api/location/<int:pk>/", LocationDetail.as_view(), name="location-detail"),
    path("api/order-room/<int:pk>/", OrderRoomApi.as_view(), name="order-room"),
    path("api/profile/<int:pk>/", ProfileApi.as_view(), name='profile'),
]

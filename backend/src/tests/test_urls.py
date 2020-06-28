from django.test import TestCase
from django.urls import (reverse,
                        resolve)
from magazine.api.views import (TypeProductsApi,
                                ProductsApi,
                                ProductDetailApi,
                                CartApi,
                                CartItemApi,
                                DeleteItemApi,
                                UpdateCartItemApi,
                                OrderSuccessApi,
                                OrderRoomConnectApi,
                                OrderRoomApi,
                                LocationList,
                                LocationDetail,
                                ProfileApi)
from magazine.models import (TypeProduct,
                            Product,
                            CartItem,
                            Cart,
                            Location,
                            Profile,
                            Order,
                            RoomOrder,
                            Shop)
from django.contrib.auth.models import User
from decimal import Decimal
from datetime import datetime
import pytest


class TestMagazineAppUrls(TestCase):
    """
    Test Magazine app urls 
    """

    def setUp(self):
        self.type_product = TypeProduct.objects.create(
            type='book'
        )
        self.product = Product.objects.create(
            type=self.type_product,
            name='test_book',
            count=10,
            delivery_time=datetime.now().date(),
            price=Decimal(20.00)
        )
        self.item = CartItem.objects.create(
            product=self.product,
            count=1,
            product_total=self.product.price
        )
        self.user = User.objects.create_user(username='test_user')
        self.profile = Profile.objects.create(user=self.user)
        self.location = Location.objects.create(
            title=f'Current position {self.user.username}',
            profile=self.profile
        )
        self.room = RoomOrder()
        self.room.save()
        self.room.participants.add(self.profile)
        self.room.locations.add(self.location)
        

    def test_type_products_url(self):
        type_slug = self.type_product.type
        url = reverse("magazine:filter-products", args=[type_slug])
        assert resolve(url).func.view_class == TypeProductsApi

    def test_list_products_url(self):
        url = reverse("magazine:products")
        assert resolve(url).func.view_class == ProductsApi

    def test_detail_product_url(self):
        product_slug = self.product.id
        url = reverse("magazine:product", args=[product_slug])
        assert resolve(url).func.view_class == ProductDetailApi

    def test_cart_item_detail_url(self):
        cart_slug = self.item.id
        url = reverse("magazine:cart-item", args=[cart_slug])
        assert resolve(url).func.view_class == CartItemApi

    def test_cart_url(self):
        url = reverse("magazine:my-cart", args=['test'])
        assert resolve(url).func.view_class == CartApi

    def test_cart_item_delete_url(self):
        cart_item_slug = self.item.id
        url = reverse("magazine:delete-item", args=[cart_item_slug])
        assert resolve(url).func.view_class == DeleteItemApi

    def test_update_item_url(self):
        cart_item_slug = self.item.id
        url = reverse("magazine:update-item", args=[cart_item_slug])
        assert resolve(url).func.view_class == UpdateCartItemApi

    def test_order_success_url(self):
        url = reverse("magazine:order-success")
        assert resolve(url).func.view_class == OrderSuccessApi

    def test_locations_list_url(self):
        url = reverse("magazine:location-list")
        assert resolve(url).func.view_class == LocationList

    def test_location_detail_url(self):
        location_slug = self.location.id
        url = reverse("magazine:location-detail", args=[location_slug])
        assert resolve(url).func.view_class == LocationDetail

    def test_profile_detail_url(self):
        profile_slug = self.profile.id
        url = reverse("magazine:profile", args=[profile_slug])
        assert resolve(url).func.view_class == ProfileApi

    def test_order_room_detail_url(self):
        room_slug = self.room.id
        url = reverse("magazine:order-room", args=[room_slug])
        assert resolve(url).func.view_class == OrderRoomApi

    def test_connect_to_room_url(self):
        url = reverse("magazine:connect-to-room")
        assert resolve(url).func.view_class == OrderRoomConnectApi

    
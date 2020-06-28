from django.test import TestCase
from magazine.models import (Product,
                            TypeProduct,
                            Profile,
                            CartItem,
                            Cart,
                            Location,
                            Order,
                            RoomOrder,
                            Shop)
from django.utils import timezone
from django.contrib.auth.models import User
from decimal import Decimal
import pytest



class TestProductModel(TestCase):
    """
    Test Product model 
    """
    def setUp(self):
        self.type = TypeProduct.objects.create(
            type='book'
        )
        self.product = Product.objects.create(
            name='test_product',
            price=Decimal(10.00),
            delivery_time=timezone.now().date(),
            count=10,
            type=self.type
        )

    def test_type_success_created(self):
        assert self.type is not None
    
    def test_product_success_created(self):
        assert self.product is not None

    def test_get_price_product(self):
        price = self.product.price
        assert price == self.product.get_price()
    
    def test_count_property(self):
        count = self.product.get_count
        assert count == self.product.count
        self.product.get_count = 2
        assert self.product.get_count == 2
        

class TestProfileModel(TestCase):
    """
    Test Profile model
    """
    def setUp(self):
        self.user = User.objects.create_user(username='test_user')
        self.profile = Profile.objects.create(
            user=self.user,
            busy=False
        )

    def test_profile_created(self):
        assert self.profile is not None

    def test_busy_property(self):
        not_busy = self.profile.get_busy
        assert not_busy is False
        self.profile.get_busy = True
        assert self.profile.get_busy == True


class TestCartItemModel(TestCase):
    """
    Test CartItem models
    """

    def setUp(self):
        self.type = TypeProduct.objects.create(
            type='book'
        )
        self.product = Product.objects.create(
            name='test_product',
            price=Decimal(10.00),
            delivery_time=timezone.now().date(),
            count=10,
            type=self.type
        )

        self.cart_item = CartItem.objects.create(
            product=self.product,
            count=1,
            product_total=self.product.price
        )

    def test_cart_item_created(self):
        assert self.cart_item is not None


class TestCartModel(TestCase):
    """
    Test Cart model
    """

    def setUp(self):
        self.type = TypeProduct.objects.create(
            type='book'
        )
        self.product = Product.objects.create(
            name='test_product',
            price=Decimal(10.00),
            delivery_time=timezone.now().date(),
            count=10,
            type=self.type
        )

        self.cart_item = CartItem.objects.create(
            product=self.product,
            count=1,
            product_total=Decimal(10.00)
        )
    
        self.user = User.objects.create_user(username='test_user')
        self.profile = Profile.objects.create(
            user=self.user,
            busy=False
        )
        self.cart = Cart.objects.create(
            owner=self.profile,
            cart_total=Decimal(0.00)
        )
        self.cart.products.add(self.cart_item)

    def test_cart_created(self):
        assert self.cart is not None

    def test_add_to_cart(self):
        count_product = self.cart.products.all()
        assert len(count_product) == 1

        product = Product.objects.create(
            name='test_product_2',
            price=Decimal(15.00),
            delivery_time=timezone.now().date(),
            count=10,
            type=self.type
        )
        cart_item = CartItem.objects.create(
            product=product,
            count=1,
            product_total=15.00
        )
        self.cart.add_to_cart(cart_item, self.cart)
        assert len(self.cart.products.all()) == 2
        if cart_item in self.cart.products.all():
            count_products = len(self.cart.products.all())
            self.cart.add_to_cart(cart_item, self.cart)
            count_after = len(self.cart.products.all())
            assert count_products == count_after
        
    def test_check_price_after_bought(self):
        start_total = self.cart.cart_total
        assert start_total == Decimal(0.00)
        self.cart.add_to_cart(self.cart_item, self.cart)
        total_after = self.cart_item.product_total
        assert self.cart.cart_total == total_after

    def test_remove_from_cart(self):
        count_products = len(self.cart.products.all())
        total_price = self.cart.cart_total
        self.cart.remove_from_cart(self.product)
        count_products_after = len(self.cart.products.all())
        assert count_products == count_products_after + 1
        assert total_price == 0.00

    def test_change_from_cart(self):
        item = self.cart.products.first()
        price_item = item.product_total * item.count
        self.cart.change_from_cart(10, item)
        new_total_price = self.cart.cart_total
        assert item.count == 10
        assert new_total_price == price_item * 10

    
class TestLocationModel(TestCase):
    """
    Test Location model
    """

    def setUp(self):
        self.user = User.objects.create_user(username='test_user')
        self.profile = Profile.objects.create(user=self.user, busy=False)
        self.location = Location.objects.create(
            title=f"Current position {self.profile.user.username}",
            profile=self.profile,
        )

    def test_location_created(self):
        assert self.location is not None

    def test_longitude_or_latitude_property(self):
        longitude = self.location.longitude
        latitude = self.location.latitude
        assert longitude == 0
        assert latitude == 0

    def test_change_position(self):
        longitude = self.location.longitude
        latitude = self.location.latitude

        longitude = 5.55
        latitude = 10.5
        assert longitude == 5.55
        assert latitude == 10.5


class TestShopModel(TestCase):
    """
    Test Shop model
    """

    def setUp(self):
        self.user = User.objects.create_user(username='test_user')
        self.profile = Profile.objects.create(user=self.user, busy=False)
        self.location = Location.objects.create(
            title=f"Current position {self.profile.user.username}",
            profile=self.profile,
        )
        self.shop = Shop.objects.create(
            name='Test Shop',
            position=self.location,
        )
        self.shop.personal.add(self.profile)

    def test_shop_is_working_now(self):
        hour_now = timezone.now().hour
        if hour_now < 22:
            assert self.shop.is_working() == True
        else:
            assert self.shop.is_working() == False


class TestOrderModel(TestCase):
    """
    Test Order model
    """

    def setUp(self):
        self.type = TypeProduct.objects.create(
            type='book'
        )
        self.product = Product.objects.create(
            name='test_product',
            price=Decimal(10.00),
            delivery_time=timezone.now().date(),
            count=10,
            type=self.type
        )

        self.cart_item = CartItem.objects.create(
            product=self.product,
            count=1,
            product_total=self.product.price
        )

        self.user = User.objects.create_user(username='test_user')
        self.profile = Profile.objects.create(user=self.user, busy=False)
        self.cart = Cart.objects.create(owner=self.profile)
        self.cart.products.add(self.cart_item)
        self.order = Order.objects.create(
            user=self.profile,
            items=self.cart,
            first_name='test',
            last_name='testov',
            phone="+375294651234",
        )

    def test_order_created(self):
        assert self.order is not None

    def test_order_status_property(self):
        order_status = self.order.check_status
        assert order_status == "Принят к обработке"
        self.order.check_status = "Выполняется"
        assert self.order.check_status == "Выполняется"

    def test_search_free_driver(self):
        assert self.order.search_free_driver() == None
        courier_user = User.objects.create(
            username='test_courier',
            password='courier12345',
            is_staff=True,
            is_active=True
        )
        courier_profile = Profile.objects.create(user=courier_user, busy=False)
        assert self.order.search_free_driver() == courier_profile


class TestRoomOrderModel(TestCase):
    """
    Test Room Order model
    """

    def setUp(self):
        self.customer = User.objects.create(
            username='test_customer',
            password='customer12345',
        )
        self.courier = User.objects.create(
            username='test_courier',
            password='courier12345',
            is_staff=True,
            is_active=True
        )
        self.profile_customer = Profile.objects.create(user=self.customer)
        self.profile_courier = Profile.objects.create(user=self.courier)
        self.location_customer = Location.objects.create(
            title=f'Current position {self.customer.username}',
            profile=self.profile_customer
        )
        self.location_courier = Location.objects.create(
            title=f'Current position {self.courier.username}',
            profile=self.profile_courier
        )
        self.location_courier.latitude, self.location_courier.longitude = 20.15, 10.15
        self.location_customer.latitude, self.location_customer.longitude = 55.123, 27.50

        self.room = RoomOrder()
        self.room.save()
        self.room.participants.add(self.profile_customer, self.profile_courier)
        self.room.locations.add(self.location_customer, self.location_courier)

    def test_room_order_created(self):
        assert self.room is not None





        



    



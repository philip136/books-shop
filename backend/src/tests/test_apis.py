from django.test import (TestCase,
                        Client)
from magazine.models import (TypeProduct,
                            Product,
                            CartItem,
                            Cart,
                            Profile,
                            Order,
                            Location,
                            Shop,
                            RoomOrder
                            )
from rest_framework.test import (APIClient,
                                APITestCase)
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework import status
from magazine.api.serializer import (TypeProductSerializer,
                                    ProductSerializer,
                                    CartItemSerializer,
                                    ProfileSerializer,
                                    CartSerializer,
                                    LocationSerializer,
                                    OrderRoomSerializer,
                                    ShopSerializer,
                                    OrderSerializer,
                                    LocationSerializer)
from django.urls import reverse
from datetime import datetime
from decimal import Decimal
from django.contrib.auth.models import User
from PIL import Image
import random
import json
import pytest
import os


client = Client()


class TestTypeProductApi(TestCase):
    def setUp(self):
        path_to_image = os.getcwd() + '/media/uploads/'
        image = os.listdir(path=path_to_image)
        self.type_book = TypeProduct.objects.create(
            type='book'
        )
        self.type_calendar = TypeProduct.objects.create(
            type='calendar'
        )
        self.type_notepad = TypeProduct.objects.create(
            type='notepad'
        )
        self.book = Product.objects.create(
            name='test_book',
            price=Decimal(10.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_book,
        )
        self.calendar = Product.objects.create(
            name='test_calendar',
            price=Decimal(5.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_calendar,
        )
        self.notepad = Product.objects.create(
            name='test_notepad',
            price=Decimal(10.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_notepad,
        )

    def test_get_products_of_book(self):
        url = reverse('magazine:filter-products', args=[self.type_book.type])
        response = client.get(url)
        books_data = Product.objects.filter(type=self.type_book)
        serializer = TypeProductSerializer(books_data, many=True)
        assert response.data == serializer.data

    def test_get_products_of_calendar(self):
        url = reverse('magazine:filter-products', args=[self.type_calendar.type])
        response = client.get(url)
        calendar_data = Product.objects.filter(type=self.type_calendar)
        serializer = TypeProductSerializer(calendar_data, many=True)
        assert response.data == serializer.data

    def test_get_products_of_notepad(self):
        url = reverse('magazine:filter-products', args=[self.type_notepad.type])
        response = client.get(url)
        notepad_data = Product.objects.filter(type=self.type_notepad)
        serializer = TypeProductSerializer(notepad_data, many=True)
        assert response.data == serializer.data


class TestProductApi(TestCase):
    def setUp(self):
        path_to_image = os.getcwd() + '/media/uploads/'
        image = os.listdir(path=path_to_image)

        self.type_book = TypeProduct.objects.create(
            type='book'
        )
        self.book1 = Product.objects.create(
            name='test_book1',
            price=Decimal(10.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_book,
        )
        self.book2 = Product.objects.create(
            name='test_book2',
            price=Decimal(20.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_book,
        )

    def test_list_products(self):
        url = reverse("magazine:products")
        response = client.get(url)
        books = Product.objects.all()
        serializer = ProductSerializer(books, many=True)
        assert response.data == serializer.data


class TestProductDetailApi(TestCase):
    def setUp(self):
        path_to_image = os.getcwd() + '/media/uploads/'
        image = os.listdir(path=path_to_image)

        self.type_book = TypeProduct.objects.create(
            type='book'
        )
        self.book1 = Product.objects.create(
            name='test_book1',
            price=Decimal(10.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_book,
        )

    def test_detail_product(self):
        url = reverse("magazine:product", args=[self.book1.id])
        response = client.get(url)
        serializer = ProductSerializer(self.book1, many=False)
        assert serializer.data['id'] == response.data['id']


class TestCartApi(TestCase):
    def setUp(self):
        path_to_image = os.getcwd() + '/media/uploads/'
        image = os.listdir(path=path_to_image)
        self.user = User.objects.create_user(username='test')
        self.profile = Profile.objects.create(user=self.user)
        self.type_book = TypeProduct.objects.create(
            type='book'
        )
        self.book1 = Product.objects.create(
            name='test_book1',
            price=Decimal(10.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_book,
        )
        self.item = CartItem.objects.create(
            product=self.book1,
            count=1,
            product_total=self.book1.price
        )
        self.cart = Cart.objects.create(owner=self.profile)
        self.cart.products.add(self.item)

    def test_get_cart(self):
        url = reverse("magazine:my-cart", args=[self.user.username])
        response = client.get(url)
        serializer = CartSerializer(self.cart)
        assert serializer.data != response.data
        assert serializer.data['owner']['user'] == self.user.username



class TestProfileApi(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test')
        self.profile = Profile.objects.create(user=self.user)

    def test_get_profile(self):
        url = reverse("magazine:profile", args=[self.profile.id])
        response = client.get(url)
        serializer = ProfileSerializer(self.profile)
        assert response.data != serializer.data
        assert len(response.data) + 2 == len(serializer.data)


class TestCartItemApi(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = 'te_test_1'
        self.password = 'test12345'
        self.user = User.objects.create(
            username=self.username,
            password=self.password,
            email='test_testovski@gmail.com'
        )
        self.profile = Profile.objects.create(user=self.user)
        self.token = Token.objects.create(user=self.user)
       
        path_to_image = os.getcwd() + '/media/uploads/'
        image = os.listdir(path=path_to_image)
        self.type_book = TypeProduct.objects.create(type='book')
        self.book1 = Product.objects.create(
            name='test_book1',
            price=Decimal(10.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_book,
        )
        self.item = CartItem.objects.create(product=self.book1,count=1)
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_login_user(self):
        self.client.login(username=self.username, password=self.password)

    def test_post_cart_item_in_cart(self):
        url = reverse("magazine:cart-item", kwargs={"pk": 1})
        serializer_data = CartItemSerializer(self.item).data
        response = self.client.post(url, serializer_data)
        assert response.status_code == status.HTTP_201_CREATED
        cart_created = Cart.objects.get(owner=self.profile)
        cart_add_item = len(cart_created.products.all())
        cart_total = cart_created.cart_total
        assert cart_created is not None
        assert cart_add_item == 1
        assert cart_total == self.item.product_total


class TestUpdateCartItemApi(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = 'te_test_1'
        self.password = 'test12345'
        self.user = User.objects.create(
            username=self.username,
            password=self.password,
            email='test_testovski@gmail.com'
        )
        self.token = Token.objects.create(user=self.user)
        self.profile = Profile.objects.create(user=self.user)
        path_to_image = os.getcwd() + '/media/uploads/'
        image = os.listdir(path=path_to_image)
        self.type_book = TypeProduct.objects.create(type='book')
        self.book1 = Product.objects.create(
            name='test_book1',
            price=Decimal(10.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_book,
        )
        self.item = CartItem.objects.create(product=self.book1,count=1)
        self.cart = Cart.objects.create(owner=self.profile)
        self.cart.products.add(self.item)
        self.api_authentication()
    
    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_put_cart_item_in_cart(self):
        url = reverse("magazine:update-item", kwargs={"pk":1})
        item_changed = CartItem.objects.create(product=self.book1,count=3)
        serializer_data = CartItemSerializer(item_changed).data
        response = self.client.put(url, serializer_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert item_changed.count  == self.item.count + 2

    
class TestDeleteItemApi(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = 'te_test_1'
        self.password = 'test12345'
        self.user = User.objects.create(
            username=self.username,
            password=self.password,
            email='test_testovski@gmail.com'
        )
        self.token = Token.objects.create(user=self.user)
        self.profile = Profile.objects.create(user=self.user)
        path_to_image = os.getcwd() + '/media/uploads/'
        image = os.listdir(path=path_to_image)
        self.type_book = TypeProduct.objects.create(type='book')
        self.book1 = Product.objects.create(
            name='test_book1',
            price=10.00,
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=self.type_book,
        )
        self.item = CartItem.objects.create(product=self.book1,count=1)
        self.cart = Cart.objects.create(owner=self.profile)
        self.cart.products.add(self.item)
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
    
    def test_delete_item_from_cart(self):
        url = reverse("magazine:delete-item", kwargs={"pk": self.item.id})
        response = self.client.delete(url, {"pk": self.item.id})
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert len(self.cart.products.all()) == 0

    
class TestLocationAPI(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = 'te_test_1'
        self.password = 'test12345'
        self.user = User.objects.create(
            username=self.username,
            password=self.password,
            email='test_testovski@gmail.com'
        )
        self.token = Token.objects.create(user=self.user)
        self.profile = Profile.objects.create(user=self.user)
        self.location = Location.objects.create(title=f'{self.username}',profile=self.profile)
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_location_is_created(self):
        assert self.location is not None

    def test_detail_location(self):
        url = reverse("magazine:location-detail", kwargs={"pk": 1})
        self.location_another = Location.objects.create(
            title=f'{self.username}',
            profile=self.profile
            )
        first_data_location = LocationSerializer(self.location).data
        second_data_location = LocationSerializer(self.location_another).data
        assert  first_data_location == second_data_location
        self.location_another.latitude = 10
        self.location_another.longitude = 10

        serializer_data = LocationSerializer(self.location_another).data
        response = self.client.put(url, serializer_data, format='json')
        assert response.status_code == 200
        assert second_data_location['latitude'] != serializer_data['latitude']
        assert second_data_location['longitude'] != serializer_data['longitude']

    def test_locations_list(self):
        self.location_2 = Location.objects.create(
            title=f'{self.username}',
            profile=self.profile
        )
        url = reverse("magazine:location-list")
        response = self.client.get(url)
        assert response.status_code == 200


class TestOrderAPI(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = 'te_test_1'
        self.password = 'test12345'
        self.user = User.objects.create(
            username=self.username,
            password=self.password,
            email='test_testovski@gmail.com'
        )
        self.token = Token.objects.create(user=self.user)
        self.profile = Profile.objects.create(user=self.user)
        username = 'te_test_2'
        password = 'test12345'
        shop_owner = User.objects.create(
            username=username,
            password=password,
            email='test_testovski@gmail.com',
            is_staff=True,
            is_active=True
        )
        profile_of_owner = Profile.objects.create(user=shop_owner)
        self.location = Location.objects.create(
            title='current_pos Magazika',
            profile=profile_of_owner)
        self.location.latitude = 5
        self.location.longitude = 10
        self.shop = Shop.objects.create(
            name='MAGAZIK',
            position=self.location,
        )
        self.shop.personal.add(profile_of_owner)
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def create_cart(self):
        path_to_image = os.getcwd() + '/media/uploads/'
        image = os.listdir(path=path_to_image)
        type_book = TypeProduct.objects.create(type='book')
        book1 = Product.objects.create(
            name='test_book1',
            price=Decimal(10.00),
            delivery_time=datetime.now().date(),
            count=10,
            image=image[0],
            type=type_book,
        )
        item = CartItem.objects.create(product=book1,count=1)
        cart = Cart.objects.create(owner=self.profile)
        cart.products.add(item)
        return cart

    def test_checkout_without_courier(self):
        url = reverse("magazine:order-success")
        cart = self.create_cart()
        order = Order.objects.create(
            user=self.profile,
            items=cart,
            first_name='Тест',
            last_name='Тестовский',
            phone='+375441239976',
        )
        serializer = OrderSerializer(order).data
        response = self.client.post(url, serializer, format='json')
        assert response.status_code == 200
        is_working = self.shop.is_working()
        if is_working:
            assert response.data["message"] == "Комната успешно создана"
        else:
            assert response.data["message"] == ("Простите но наш магазин уже закрыт, "
                        "обратитесь позже мы работаем с 9:00 - 22:00 каждый день")
    
    def test_checkout_with_courier(self):
        url = reverse("magazine:order-success")
        cart = self.create_cart()
        order = Order.objects.create(
            user=self.profile,
            items=cart,
            first_name='Тест',
            last_name='Тестовский',
            phone='+375441239976',
            purchase_type="Доставка курьером"
        )
        serializer = OrderSerializer(order).data

        response = self.client.post(url, serializer, format='json')
        assert response.status_code == 200
        is_working = self.shop.is_working()
        if is_working:
            assert response.data["message"] == "Комната успешно создана"
        else:
            assert response.data["message"] == ("Простите но наш магазин уже закрыт, "
                        "обратитесь позже мы работаем с 9:00 - 22:00 каждый день")

    def test_order_room_connect_if_room_does_not_exist(self):
        url_room = reverse("magazine:connect-to-room")
        cart = self.create_cart()
        data = {"username": self.profile.user.username}
        response_room = self.client.post(url_room, data, format='json')
        assert response_room.data['message'] == 'Текущих комнат нет'

    def test_order_room_connect_if_room_is_exist(self):
        order_room = RoomOrder()
        order_room.save()

        order_room.participants.add(self.profile)
        location = Location.objects.create(
            title=f'current pos {self.username}',
            profile=self.profile
        )
        order_room.locations.add(location)
        url = reverse("magazine:order-room", args=[order_room.id])
        response = self.client.get(url)
        assert response.status_code == 200

    def test_connect_as_courier(self):
        order_room = RoomOrder()
        order_room.save()

        courier = User.objects.create(
            username='test_courier',
            password='test12345',
            email='test_testovski@gmail.com',
            is_staff=True,
            is_active=True
        )
        p_courier = Profile.objects.create(user=courier)

        order_room.participants.add(self.profile, p_courier)
        location_customer = Location.objects.create(
            title=f'current pos {self.username}',
            profile=self.profile
        )
        location_courier = Location.objects.create(
            title=f'current pos {courier.username}',
            profile=p_courier
        )
        order_room.locations.add(location_customer, location_courier)
        url = reverse("magazine:connect-to-room")
        username = {"username": courier.username}
        response = self.client.post(url, username)
        assert response.status_code == 200
        assert response.data["message"] == order_room.id

    def test_validate_data_first_name(self):
        url = reverse("magazine:order-success")
        cart = self.create_cart()
        order = Order.objects.create(
            user=self.profile,
            items=cart,
            first_name='Test',
            last_name='Тестовский',
            phone='+375441239976',
            purchase_type="Доставка курьером"
        )
        serializer = OrderSerializer(order).data
        response = self.client.post(url, serializer, format='json')
        assert response.data["message"] == "Проверьте правильность введенных данных"
    
    def test_validate_data_last_name(self):
        url = reverse("magazine:order-success")
        cart = self.create_cart()
        order = Order.objects.create(
            user=self.profile,
            items=cart,
            first_name='Тест',
            last_name='Testovski',
            phone='+375441239976',
            purchase_type="Доставка курьером"
        )
        serializer = OrderSerializer(order).data
        response = self.client.post(url, serializer, format='json')
        assert response.data["message"] == "Проверьте правильность введенных данных"

    def test_validate_data_mobile_phone(self):
        url = reverse("magazine:order-success")
        cart = self.create_cart()
        order = Order.objects.create(
            user=self.profile,
            items=cart,
            first_name='Test',
            last_name='Тестовский',
            phone='375441239976',
            purchase_type="Доставка курьером"
        )
        serializer = OrderSerializer(order).data
        response = self.client.post(url, serializer, format='json')
        assert response.data["message"] == "Проверьте правильность введенных данных"


        
        
       

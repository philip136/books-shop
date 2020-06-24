from django.test import (TestCase,
                        Client)
from magazine.models import (TypeProduct,
                            Product,
                            CartItem,
                            Cart,
                            Profile,
                            Order,
                            )
from magazine.api.serializer import (TypeProductSerializer,
                                    ProductSerializer,
                                    CartItemSerializer,
                                    ProfileSerializer,
                                    CartSerializer,
                                    LocationSerializer,
                                    OrderRoomSerializer,
                                    ShopSerializer,
                                    OrderSerializer)
from django.urls import reverse
from datetime import datetime
from decimal import Decimal
from django.contrib.auth.models import User
from PIL import Image
import json
import pytest
import os


client = Client()


class TestTypeProductApi(TestCase):
    """
    Test TypeProduct api
    """

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
    """
    Test Product api
    """

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
    """
    Test Product Detail api
    """

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
    """
    Test Cart api
    """

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
        url = reverse("magazine:my-cart")
        response = client.get(url)
        serializer = CartSerializer(self.cart)
        assert serializer.data != response.data
        assert serializer.data['owner']['user'] == self.user.username



class TestProfileApi(TestCase):
    """
    Test Profile api
    """

    def setUp(self):
        self.user = User.objects.create_user(username='test')
        self.profile = Profile.objects.create(user=self.user)

    def test_get_profile(self):
        url = reverse("magazine:profile", args=[self.profile.id])
        response = client.get(url)
        serializer = ProfileSerializer(self.profile)
        assert response.data != serializer.data
        assert len(response.data) + 2 == len(serializer.data)



    

        
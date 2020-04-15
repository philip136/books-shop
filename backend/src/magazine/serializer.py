from rest_framework import serializers
from .models import (Product,
                     Cart,
                     CartItem,
                     Order,
                     TypeProduct)
from django.contrib.auth.models import User
import datetime
import re


class TypeProductSerializer(serializers.ModelDurationField):
    class Meta:
        model = TypeProduct
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'delivery_time',
            'image',
            'count',
            'type',
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')

    class Meta:
        model = CartItem
        fields = [
            'product_name',
            'count',
            'product_total'
        ]

    def validate_count(self, count):
        data = self.get_initial()
        product = data.get('product_name')
        product = Product.objects.get(name=product)
        product_count = int(product.count)
        count_items = int(count)
        if product_count < count_items:
            raise serializers.ValidationError("Столько товаров нет в наличии")
        return count


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'is_superuser',
            'username',
            'first_name',
            'last_name',
            'is_active'
        ]


class CartSerializer(serializers.ModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = Cart
        fields = [
            'owner',
            'products',
            'cart_total',

        ]
        depth = 2


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username')
    items = serializers.SerializerMethodField('_items')
    total_price = serializers.SerializerMethodField('_summary')
    date = serializers.SerializerMethodField('_date')
    phone = serializers.CharField(max_length=13)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)

    class Meta:
        model = Order
        fields = [
            'user',
            'items',
            'total_price',
            'first_name',
            'last_name',
            'phone',
            'date',
            'purchase_type',
            'status',
        ]

    def validate_phone(self, phone):
        result = re.match(r'^\+375(17|29|33|44)[0-9]{3}[0-9]{2}[0-9]{2}$', phone)
        if result is None:
            raise serializers.ValidationError("Проверьте правильность введенного номера!"
                                              "Номер должен начинать с '+375' и его"
                                              " длина не должна быть меньее 12 цифр")
        return result

    def validate_first_name(self, first_name):
        result = re.match(r'^[A-Za-z]{2,30}$', first_name)
        if result is None:
            raise serializers.ValidationError("Имя должно содержать только буквы, "
                                              "и его длина не должна быть меньше 2")
        return result

    def validate_last_name(self, last_name):
        result = re.match(r'^[A-Za-z]{3,30}$', last_name)
        if result is None:
            raise serializers.ValidationError("Фамилия должна содержать только буквы, "
                                              "и ее длина не должна быть меньше 3")

    def _date(self, obj):
        return datetime.date.today()

    def _items(self, obj):
        data = self.get_initial()
        owner = User.objects.get(username=data.get('user'))
        cart = Cart.objects.get(owner=owner)
        return CartSerializer(cart).data

    def _summary(self, obj):
        data = self.get_initial()
        owner = User.objects.get(username=data.get('user'))
        cart = Cart.objects.get(owner=owner)
        cart_total = cart.cart_total
        return cart_total







    
    



from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from django.utils.translation import ugettext_lazy as _
from .models import (Product,
                     Cart,
                     CartItem,
                     Order,
                     TypeProduct,
                     Profile,
                     Location,
                     Shop,
                     RoomOrder)
from django.contrib.auth.models import User
import datetime
import re


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        profile = Profile()
        profile.user = user
        profile.save()
        user.save()
        return user


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            'id',
            'title',
            'profile',
            'address',
            'point',
            'latitude',
            'longitude',
        ]
        read_only_fields = ['id', 'title', 'description', 'address', ]


class TypeProductSerializer(serializers.ModelSerializer):
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


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = [
            'user',
            'status_staff',
            'payment',
            'busy',
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


class OrderRoomSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True)
    locations = LocationSerializer(many=True)

    class Meta:
        model = RoomOrder
        fields = [
            'id',
            'participants',
            'locations',
        ]


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = [
            'name',
            'position',
            'starts_working',
            'finishes_working',
        ]
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username')
    items = serializers.SerializerMethodField('_items')
    total_price = serializers.SerializerMethodField('_summary')
    date = serializers.SerializerMethodField('_date')
    phone = serializers.CharField(max_length=13)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)

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
        return result








    
    



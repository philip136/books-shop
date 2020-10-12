from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from django.utils.translation import ugettext_lazy as _
from magazine.models import (Product,
                             Cart,
                             CartItem,
                             Order,
                             TypeProduct,
                             Profile,
                             Location,
                             Shop,
                             RoomOrder)
from shop.settings import SIMPLE_JWT
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import (TokenObtainPairSerializer,
                                                  TokenRefreshSerializer)
import logging
import datetime
import re


logger = logging.getLogger(__name__)


class UserSerializerLogIn(TokenObtainPairSerializer):
    """
    Custom Obtain token append username, expirationDate for access token
    and status_staff for permissions routes
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        user_status = User.objects.get(username=attrs["username"]).is_staff
        data["username"] = attrs["username"]
        data["is_staff"] = user_status
        data["expirationDate"] = SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
        return data


class UserSerializerLogInRefresh(TokenRefreshSerializer):
    """
    Custom Refresh token append expirationDate field
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        data["expirationDate"] = SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
        return data


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer fields for registration
    """
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = Profile
        fields = ['email', 'first_name', 'last_name', 'password1', 'password2']

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

    def create(self, validated_data):
        password = validated_data.pop('password1', None)
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer fields: 
    image: image for product, 
    price: price for product,
    name: product name,
    delivery_time,
    count: total count in stock,
    type: type of product (notebook, book, calendar, etc.)
    """
    image = serializers.ImageField(max_length=None, use_url=True)
    price = serializers.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
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


class TypeProductSerializer(ProductSerializer):
    """
    Serializer Product only finding by type product
    """


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer fields:
    product name
    count: count for one product in a cart
    product_total: price for (product * count)
    """
    product_name = serializers.CharField(source='product.name')
    count = serializers.IntegerField()
    product_total = serializers.DecimalField(max_digits=9, decimal_places=2, default=0.00)

    class Meta:
        model = CartItem
        fields = [
            'id',
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


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer fields:
    user: return username for user,
    busy: user busy or not, if don't busy then user can be a courier
    """
    class Meta:
        model = Profile
        fields = [
            'user',
            'busy',
        ]
    
    def to_representation(self, instance):
        data = super(ProfileSerializer, self).to_representation(instance)
        data.update({
            'user': instance.user.username,
            'is_staff': instance.user.is_staff
        })
        return data


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer fields:
    is_superuser: admin or not,
    is_staff: staff or not, if user is staff then user can be courier or working in a shop,
    username,
    first_name: name,
    last_name: surname,
    is_active: online or not
    """
    class Meta:
        model = User
        fields = [
            'is_superuser',
            'is_staff',
            'username',
            'first_name',
            'last_name',
            'is_active'
        ]


class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer fields:
    latitude and longitude it is geographic coordinates
    """

    latitude = serializers.FloatField()
    longitude = serializers.FloatField()

    class Meta:
        model = Location
        fields = [
            'profile',
            'latitude',
            'longitude',
        ]
        read_only_fields = ['id', 'title', 'profile']


class CartSerializer(serializers.ModelSerializer):
    """
    Serializer fields: product_name, 
        count product in cart,
        product_total - total price for one product in cart
    """
    products = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = [
            'id',
            'products',
            'cart_total',
        ]


class OrderRoomSerializer(serializers.ModelSerializer):
    """
    Room with participants and locations, for any options 
    if participants == shop, then participant is equal user which working in a shop
    and location is equal location for shop
    """
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
    """
    Information about shop: name shop, position shop(latitude, longitude),
    start working shop (by default: 9:00),
    finish working shop (by default: 22:00)
    """
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
    """
    Serializer for checkout order contains the next fields:
    user: username,
    date: day of ordering(today),
    phone: phone number is valid only for Belarus format phone number 
    first_name: name
    last_name: surname
    status: by default('Принят к обработке' in English 'Accepted for processing')
    purchase_type: Options ('Доставка курьером', 'Самовывоз') in English ('Courier delivery','Pickup')
    """
    user=serializers.CharField(source='user.user.username')
    date = serializers.SerializerMethodField('_date')
    phone = serializers.CharField(max_length=13)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)

    def _date(self, obj):
        return datetime.date.today()

    class Meta:
        model = Order
        fields = [
            'user',
            'first_name',
            'last_name',
            'phone',
            'date',
            'purchase_type',
            'status',
        ]
        read_only_fields = ['date', 'status', ]

    def validate_phone(self, phone):
        result = re.match(r'^\+375(17|29|33|44)[0-9]{3}[0-9]{2}[0-9]{2}$', phone)
        if result is None:
            raise serializers.ValidationError("Проверьте правильность введенного номера!"
                                              "Номер должен начинать с '+375' и его"
                                              " длина не должна быть меньше 12 цифр")
        return result.group(0)

    def validate_first_name(self, first_name):
        result = re.match(r'^[A-za-zА-Яа-я]{2,30}$', first_name)
        if result is None:
            raise serializers.ValidationError("Имя должно содержать только буквы, "
                                              "и его длина не должна быть меньше 2")
        return result.group(0)

    def validate_last_name(self, last_name):
        result = re.match(r'^[A-za-zА-Яа-я]{3,30}$', last_name)
        if result is None:
            raise serializers.ValidationError("Фамилия должна содержать только буквы, "
                                              "и ее длина не должна быть меньше 3")
        return result.group(0)








    
    



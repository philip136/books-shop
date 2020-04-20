from django.db import models
from sorl.thumbnail import ImageField
from django.conf import settings
from decimal import Decimal
from django.contrib.auth.models import User
from django.contrib.gis.db import models as models_gis
import datetime


class TypeProduct(models.Model):
    """ Type product: books, notepads and etc """
    type = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Тип продукта"
        verbose_name_plural = "Тип продуктов"

    def __str__(self):
        return self.type


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    delivery_time = models.DateField()
    count = models.IntegerField()
    type = models.ForeignKey(TypeProduct, on_delete=models.CASCADE)
    image = ImageField(upload_to='uploads')

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"

    def __str__(self):
        return f'{self.name}'

    def get_price(self):
        return self.price
    
    @property
    def get_count(self):
        return self.count
    
    @get_count.setter
    def set_count(self, new_count):
        self.count = new_count


class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    count = models.PositiveIntegerField(default=1)
    product_total = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)

    class Meta:
        verbose_name = "Продукт корзины"
        verbose_name_plural = "Продукты корзины"

    def __str__(self):
        return f'Объект корзины {self.product.name}'
    

class Cart(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(CartItem)
    cart_total = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"
    
    def __str__(self):
        return f'Корзина пользователя {self.owner.username}'

    def add_to_cart(self, cart_item, owner):
        cart_item = CartItem.objects.get(id=cart_item.id)
        cart_owner = Cart.objects.filter(owner=owner)
        if cart_item not in cart_owner:
            self.products.add(cart_item)
            self.save()

    def remove_from_cart(self, product, cart_item_id):
        for _item in self.products.all():
            if _item.product == product:
                self.products.remove(_item)
                product.count += _item.count
                self.cart_total -= _item.product_total
                self.save()
    
    def change_from_cart(self, count, cart_item):
        cart_item.count = int(count)
        cart_item.product_total = int(count) * Decimal(cart_item.product.price)
        cart_item.save()
        new_cart_total = 0.00
        for item in self.products.all():
            new_cart_total += float(item.product_total)
        self.cart_total = new_cart_total
        self.save()


ORDER_STATUS_CHOICES = [
    ("Принят к обработке", "Принят к обработке"),
    ("Выполняется", "Выполняется"),
    ("Оплачен", "Оплачен"),
]

ORDER_TYPE_OF_PURCHASE = [
    ("Доставка курьером", "Доставка курьером"),
    ("Самовывоз", "Самовывоз"),
]


class Location(models.Model):
    title = models.TextField(max_length=150)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=250, blank=True, null=True)
    point = models_gis.PointField(default='POINT(0 0)', srid=4326)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Геолокация"
        verbose_name_plural = "Геолокации"

    def __str__(self):
        return f'Aдрес: {self.title}'

    @property
    def longitude(self):
        return self.point[0]

    @property
    def latitude(self):
        return self.point[1]


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    busy = models.BooleanField(default=False)
    payment = models.BooleanField(default=False)
    courier = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING,
        related_name='profile_as_courier'
    )
    client = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING,
        related_name='profile_as_client'
    )
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = "Профиль"
        verbose_name_plural = "Профили"

    def __str__(self):
        return f'Профиль пользователя: {self.user.username}'


class Shop(models.Model):
    name = models.CharField(max_length=50)
    position = models.ForeignKey(Location, on_delete=models.CASCADE)
    starts_working = models.TimeField(default=datetime.time(hour=9, minute=0, second=0))
    finishes_working = models.TimeField(default=datetime.time(hour=22, minute=0, second=0))

    class Meta:
        verbose_name = "Магазин"
        verbose_name_plural = "Магазины"

    def __str__(self):
        return f'Магазин {self.name}'

    @staticmethod
    def _working():
        time_now, _ = datetime.datetime.now(), datetime.datetime.today()
        time_close = datetime.time(hour=22, minute=0, second=0)
        delta = time_now - datetime.datetime.combine(_, time_close)
        if delta.days < 0:
            return False
        return True


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.ForeignKey(Cart, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=13)
    date = models.DateTimeField(default=datetime.date.today)
    purchase_type = models.CharField(max_length=30, choices=ORDER_TYPE_OF_PURCHASE, default="Самовывоз")
    status = models.CharField(max_length=30, choices=ORDER_STATUS_CHOICES)

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Заказ номер {self.id}"

    @staticmethod
    def setup_driver(user):
        couriers = Profile.objects.filter(is_staff=True,
                                          is_active=True,
                                          busy=False)
        client = Profile.objects.get(user=user)
        courier = Profile.objects.get(user__profile=couriers.first())
        courier.client = client
        courier.save()
        return courier
    

    



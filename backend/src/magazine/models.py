from django.db import models
from sorl.thumbnail import ImageField
from decimal import Decimal
from django.contrib.auth.models import User
from django.contrib.gis.db import models as models_gis
import datetime
import math
import logging


logger = logging.getLogger(__name__)


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
    image = ImageField(upload_to='uploads', default='uploads/default.png')

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
    def get_count(self, new_count):
        self.count = new_count



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    busy = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Профиль"
        verbose_name_plural = "Профили"

    def __str__(self):
        return self.user.username

    @property
    def get_busy(self):
        return self.busy

    @get_busy.setter
    def get_busy(self, state):
        self.busy = state
    

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
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)
    products = models.ManyToManyField(CartItem)
    cart_total = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"
    
    def __str__(self):
        return f'Корзина пользователя {self.owner.user.username}'

    def add_to_cart(self, cart_item, cart, product):
        if cart_item not in cart.products.all():
            cart.products.add(cart_item)
            cart.cart_total += cart_item.product_total
            product.count -= cart_item.count
            product.save()
            cart.save()
           

    def remove_from_cart(self, product, cart):
        for cart_item in cart.products.all():
            if cart_item.product == product:
                cart.products.remove(cart_item)
                product.count += cart_item.count
                product.save()  
                cart.cart_total -= cart_item.product_total
                cart_item.delete()
                cart.save()
    
    def change_from_cart(self, count, cart_item, product, cart):
        difference: int = cart_item.count - int(count)
        # if difference between old buy and new buy < 0, then count product increased
        # was 2 product count, now 3 product count => then diff = -1

        product.count += difference
        product.save()
        
        cart_item.count = int(count)
        cart_item.product_total = int(count) * cart_item.product.price
        cart_item.save()

        new_cart_total = Decimal(0.00)
        for item in cart.products.all():
            new_cart_total += item.product_total
        cart.cart_total = new_cart_total
        cart.save()


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
    title = models.CharField(max_length=80)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
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

    @longitude.setter
    def longitude(self, new_longitude):
        self.point[0] = new_longitude

    @property
    def latitude(self):
        return self.point[1]

    @latitude.setter
    def latitude(self, new_latitude):
        self.point[1] = new_latitude


class Shop(models.Model):
    name = models.CharField(max_length=50)
    personal = models.ManyToManyField(Profile)
    position = models.ForeignKey(Location, on_delete=models.CASCADE)
    starts_working = models.TimeField(default=datetime.time(hour=9, minute=0, second=0))
    finishes_working = models.TimeField(default=datetime.time(hour=22, minute=0, second=0))

    class Meta:
        verbose_name = "Магазин"
        verbose_name_plural = "Магазины"

    def __str__(self):
        return f'Магазин {self.name}'

    def is_working(self):
        time_now, _ = datetime.datetime.now(), datetime.datetime.today()
        time_close = datetime.datetime.combine(_, datetime.time(hour=22, minute=0, second=0))
        if time_now > time_close:
            return False
        return True


class RoomOrder(models.Model):
    """
    In room exist client and courier,
    they can sharing location between themselves
    """
    participants = models.ManyToManyField(
        Profile, related_name='room', blank=True
    )
    locations = models.ManyToManyField(Location, blank=True)

    class Meta:
        verbose_name = "Комната клиент-курьер"
        verbose_name_plural = "Комнаты клиент-курьер"

    def __str__(self):
        return f"Комната №{self.id}"


class Order(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    items = models.ForeignKey(Cart, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=13)
    date = models.DateTimeField(default=datetime.datetime.today())
    purchase_type = models.CharField(max_length=30, choices=ORDER_TYPE_OF_PURCHASE, default="Самовывоз")
    status = models.CharField(max_length=30, choices=ORDER_STATUS_CHOICES, default="Принят к обработке")
    payment = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Заказ {self.user.user.username}"

    def search_free_driver(self):
        profile_driver = Profile.objects.filter(
            busy=False,
            user__is_active=True,
            user__is_staff=True
        ).first()
        return profile_driver

    @property
    def check_status(self):
        return self.status

    @check_status.setter
    def check_status(self, new_status):
        self.status = new_status
        if self.status == "Оплачен":
            self.delete()
    

    



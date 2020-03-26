from django.db import models
from sorl.thumbnail import ImageField
from django.conf import settings


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


ORDER_STATUS_CHOICES = [
    ("Принят к обработке", "Принят к обработке"),
    ("Выполняется", "Выполняется"),
    ("Оплачен", "Оплачен"),
]

ORDER_TYPE_OF_PURCHASE = [
    ("Доставка курьером", "Доставка курьером"),
    ("Самовывоз", "Самовывоз"),
]


class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    count = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = "Продукт корзины"
        verbose_name_plural = "Продукты корзины"
    

class Cart(models.Model):
    products = models.ManyToManyField(CartItem)
    cart_total = models.DecimalField(max_digits=9,decimal_places=2)

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.ManyToManyField(Cart)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=12)
    date = models.DateTimeField(auto_now_add=True)
    purchase_type = models.CharField(max_length=30, choices=ORDER_TYPE_OF_PURCHASE, default="Самовывоз")
    status = models.CharField(max_length=30, choices=ORDER_STATUS_CHOICES)

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    



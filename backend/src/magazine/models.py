from django.db import models
from sorl.thumbnail import ImageField
from django.conf import settings
from decimal import Decimal
from django.contrib.auth.models import User



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
    product_total = models.DecimalField(max_digits=9,decimal_places=2, default=0.00)

    class Meta:
        verbose_name = "Продукт корзины"
        verbose_name_plural = "Продукты корзины"

    def __str__(self):
        return f'Cart Item {self.product.name}'
    
    

class Cart(models.Model):
    products = models.ManyToManyField(CartItem)
    cart_total = models.DecimalField(max_digits=9,decimal_places=2, default=0.00)

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"

    def add_to_cart(self, cart_item):
        cart_item = CartItem.objects.get(product__name=cart_item.product.name)
        print(cart_item)
        if cart_item not in Cart.objects.all():
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


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Профиль"
        verbose_name_plural = "Профили"
    
    
    

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.ManyToManyField(Cart)
    total_price = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=12)
    date = models.DateTimeField(auto_now_add=True)
    purchase_type = models.CharField(max_length=30, choices=ORDER_TYPE_OF_PURCHASE, default="Самовывоз")
    status = models.CharField(max_length=30, choices=ORDER_STATUS_CHOICES)

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Заказ номер {self.id}"
    

    



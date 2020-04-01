from django.contrib import admin
from .models import (Product,
                     TypeProduct,
                     CartItem,
                     Cart,
                     Order,
                     Profile)

admin.site.register(Product)
admin.site.register(TypeProduct)
admin.site.register(CartItem)
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Profile)

# Register your models here.

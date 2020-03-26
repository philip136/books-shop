from django.contrib import admin
from .models import (Product,
                     TypeProduct,
                     CartItem,
                     Cart,
                     Order)

admin.site.register(Product)
admin.site.register(TypeProduct)
admin.site.register(CartItem)
admin.site.register(Cart)
admin.site.register(Order)

# Register your models here.

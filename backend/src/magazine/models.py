from django.db import models


class TypeProduct(models.Model):
    """ Type product: books, notepads and etc """
    type = models.CharField(max_length=50)

    def __str__(self):
        return self.type
    


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    delivery_time = models.DateField()
    count = models.IntegerField()
    type = models.ForeignKey(TypeProduct, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name}'



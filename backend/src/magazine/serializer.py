from rest_framework import serializers
from .models import (Product,
                     Cart,
                     CartItem,
                     Order)



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


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = [
            'products',
            'cart_total'
        ]
        depth = 2
    
    



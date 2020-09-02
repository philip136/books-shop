from magazine.models import (CartItem, Cart)
from rest_framework.response import Response
from rest_framework import status
import logging


logger = logging.getLogger(__name__)


def item_in_cart(cart, item: CartItem) -> bool:
    logger.debug(f"{item} from {cart}")
    return item in cart.products.all()


def operation_with_cart(cart: Cart, item: CartItem, operation: str, **kwargs):
    product = item.product
    
    if item_in_cart(cart, item):
        if operation == "remove_from_cart":
            cart.remove_from_cart(product, cart)

        if operation == "change_from_cart" or operation == "add_to_cart":
            count = kwargs.get('count')
            cart.change_from_cart(count, item, product, cart)
    else: 
        if operation == "add_to_cart":
            logger.info(item, cart)
            cart.add_to_cart(item, cart, product)




    



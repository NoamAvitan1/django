from django.db import models
from typing import List

class Customer(models.Model):
    name: str = models.CharField(max_length=100)
    email: str = models.EmailField()
    phone: str = models.CharField(max_length=20)

    def __str__(self) -> str:
        return self.name

class Product(models.Model):
    name: str = models.CharField(max_length=100)
    price: float = models.DecimalField(max_digits=10, decimal_places=2)
    type: str = models.CharField(max_length=20)

    def __str__(self) -> str:
        return self.name

class Order(models.Model):
    order_number: str = models.CharField(max_length=20)
    customer: Customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    date: str = models.DateField(auto_now_add=True)
    comments: str = models.TextField(blank=True)
    last_update_date: str = models.DateField(auto_now=True)
    creation_date: str = models.DateField(auto_now_add=True)
    products: List[Product] = models.ManyToManyField(Product)

    def __str__(self) -> str:
        return self.order_number

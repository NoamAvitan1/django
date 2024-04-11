# orders/models.py
from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Order(models.Model):
    order_number = models.CharField(max_length=20)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    comments = models.TextField(blank=True)
    last_update_date = models.DateField(auto_now=True)
    creation_date = models.DateField(auto_now_add=True)
    products = models.ManyToManyField(Product)

    def __str__(self):
        return self.order_number


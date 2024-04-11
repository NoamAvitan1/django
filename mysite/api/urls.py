from django.urls import path
from . import views


urlpatterns = [
    path('customer/create', views.CreateCustomer.as_view(),name="create-customer"),
    path('customers/', views.RetriveCustomers.as_view(),name="get-customers"),
    path('customer/get/<int:pk>/', views.RetriveCustomer.as_view(),name="get-customer"),
    path('customer/delete/<int:pk>/', views.DeleteCustomer.as_view(),name="delete-customer"),
    path('customer/update/<int:pk>/', views.EditCustomer.as_view(),name="update-customer"),
    path('product/create', views.CreateProduct.as_view(),name="create-product"),
    path('products/', views.RetrieveProducts.as_view(),name="get-products"),
    path('product/get/<int:pk>/', views.RetriveProduct.as_view(),name="get-product"),
    path('product/delete/<int:pk>/', views.DeleteProduct.as_view(),name="delete-product"),
    path('product/update/<int:pk>/', views.EditProduct.as_view(),name="update-product"),
    path('orders/', views.getOrders.as_view(),name="get-orders"),
    path('orders/create/', views.OrderListCreate.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', views.OrderDetail.as_view(), name='order-detail'),
    path('login/', views.login, name='login'),
    path('signup/', views.register_user, name='signup'),
    path('staylogin/', views.stayLogin, name='staylogin'),
    path('total-sales/<int:client_id>/', views.TotalSales.as_view(), name='total_sales'),
]
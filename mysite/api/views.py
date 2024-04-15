from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.views import APIView
from .models import Customer, Product, Order
from rest_framework.response import Response
from rest_framework import status
from .pagination import CustomPagination
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomerSerializer, ProductSerializer, OrderSerializer,UserSerializer
from django.db.models import Sum

class CreateCustomer(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
class RetriveCustomers(generics.ListAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    pagination_class = CustomPagination

class RetriveUpdateDestroyCustomer(generics.RetrieveUpdateDestroyAPIView):
      queryset = Customer.objects.all()
      serializer_class = CustomerSerializer
    
class CreateProduct(generics.CreateAPIView):
      queryset = Product.objects.all()
      serializer_class = ProductSerializer
      
class RetrieveProducts(generics.ListAPIView):
      queryset = Product.objects.all()
      serializer_class = ProductSerializer
      pagination_class = CustomPagination

class RetriveUpdateDestroyProduct(generics.RetrieveUpdateDestroyAPIView):
      queryset = Product.objects.all()
      serializer_class = ProductSerializer

class getOrders(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    pagination_class = CustomPagination

class OrderListCreate(APIView):
    def post(self, request, *args, **kwargs):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            if 'customer_id' not in request.data:
                return Response({"customer_id": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)
            if 'products' not in request.data:
                return Response({"products": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)
            
            customer_id = request.data['customer_id']
            product_names = request.data['products']
            product_ids = []
            for product_name in product_names:
                products = Product.objects.filter(name=product_name)
                if products.exists():
                    product = products.first()
                    product_ids.append(product.id)
                else:
                    return Response({"products": [f"Product '{product_name}' does not exist."]}, status=status.HTTP_400_BAD_REQUEST)
            
            order = serializer.save(customer_id=customer_id)
            order.products.set(product_ids)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            if 'products' in request.data:
                product_names = request.data['products']
                product_ids = []
                for product_name in product_names:
                    products = Product.objects.filter(name=product_name)
                    if products.exists():
                        product = products.first()
                        product_ids.append(product.id)
                    else:
                        return Response({"products": [f"Product '{product_name}' does not exist."]}, status=status.HTTP_400_BAD_REQUEST)
                instance.products.set(product_ids)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TotalSales(APIView):
    def get(self, request, client_id):
        try:
            orders = Order.objects.filter(customer_id=client_id)
            total_sales = orders.aggregate(total_sales=Sum('products__price'))['total_sales']
            if total_sales is None:
                total_sales = 0            
            orders_serializer = OrderSerializer(orders, many=True)
            return Response({"total_sales": total_sales, "orders": orders_serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail":"Incorrect password"},status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token":token.key,"user":serializer.data}, status=status.HTTP_201_CREATED)
    
@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(username=request.data['username'])
            user.set_password((request.data['password']))
            user.save()
            token = Token.objects.create(user=user)
            return Response({"token":token.key,"user":serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def stayLogin(request):
    return Response({"user":{"email":request.user.email,"username":request.user.username,"id":request.user.id}})



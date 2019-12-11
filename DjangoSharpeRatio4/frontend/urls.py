from django.urls import path
from . import views
urlpatterns = [
    path('', views.index ),
    path('calculate_sharpe_ratio/',views.calculate_sharpe_ratio,name='calculate_sharpe_ratio'),
    path('verify_valid_ticker/',views.verify_valid_ticker,name='verify_valid_ticker')
]

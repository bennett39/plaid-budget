from django.urls import path

from . import views

app_name = 'plaid_api'
urlpatterns = [
    path('', views.index, name='index'),
    path('get_access_token', views.get_access_token),
    path('auth', views.auth),
    path('identity', views.identity),
    path('transactions', views.transactions),
    path('balance', views.balance),
    path('accounts', views.accounts),
    path('linegraph', views.linegraph),
]

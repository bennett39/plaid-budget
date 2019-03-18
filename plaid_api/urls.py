from django.urls import path

from . import views

app_name = 'plaid_api'
urlpatterns = [
    path('', views.index, name='index'),
    path('get_access_token', views.get_access_token),
    path('auth', views.auth),
]

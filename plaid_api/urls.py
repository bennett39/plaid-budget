from django.urls import path

from . import views

app_name = 'plaid_api'
urlpatterns = [
    path('', views.index, name='index'),
]

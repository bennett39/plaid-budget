from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from django.conf.urls import url


urlpatterns = [
    path('accounts/', include('django.contrib.auth.urls')),
    path('accounts/', include('django_registration.backends.activation.urls')),
    path('', include('budget.urls', namespace='budget')),
    path('plaid/', include('plaid_api.urls')),
    path('admin/', admin.site.urls),
]

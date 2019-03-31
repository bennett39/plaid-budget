from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token


urlpatterns = [
    url(r'^accounts/', include('django_registration.backends.activation.urls')),
    url(r'^accounts/', include('django.contrib.auth.urls')),
    path('', include('budget.urls', namespace='budget')),
    url(r'^api-token-auth/', obtain_jwt_token),
    path('plaid/', include('plaid_api.urls')),
    path('admin/', admin.site.urls),
]

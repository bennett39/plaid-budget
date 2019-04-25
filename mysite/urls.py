from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from django.conf.urls import url
#  from rest_framework_jwt.views import obtain_jwt_token
from . import views as test_views


urlpatterns = [
    path('accounts/', include('django.contrib.auth.urls')),
    path('accounts/', include('django_registration.backends.activation.urls')),
    path('test_conf/<year>/', test_views.year_view),
    path('', include('budget.urls', namespace='budget')),
    #  url(r'^api-token-auth/', obtain_jwt_token),
    path('plaid/', include('plaid_api.urls')),
    path('admin/', admin.site.urls),
]

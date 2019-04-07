from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .serializers import UserSerializer, GroupSerializer
import json

#  import plaid_api.views as pl

@login_required
def index(request):
    #  auth_response = json.loads(pl.auth(request).content)
    #  identity_response = json.loads(pl.identity(request).content)
    #  transactions_response = json.loads(pl.transactions(request).content)
    #  balance_response = json.loads(pl.balance(request).content)
    #  accounts_response = json.loads(pl.accounts(request).content)
    context = {
        #  'auth': auth_response,
        #  'identity': identity_response,
        #  'transactions': transactions_response,
        #  'balance': balance_response,
        #  'accounts': accounts_response,
    }
    return render(request, "budget/index.html", context)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    permission_classes = (IsAuthenticated,)
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

import datetime
import json
import os
import plaid

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Item

from dotenv import load_dotenv
load_dotenv()

PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_PUBLIC_KEY = os.getenv('PLAID_PUBLIC_KEY')
PLAID_ENV = os.getenv('PLAID_ENV', 'development')
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions')

client = plaid.Client(
    client_id=PLAID_CLIENT_ID,
    secret=PLAID_SECRET,
    public_key=PLAID_PUBLIC_KEY,
    environment=PLAID_ENV,
    api_version='2018-05-22',
)


@login_required
def index(request):
    """Show login landing page"""
    context = {
        'plaid_public_key': PLAID_PUBLIC_KEY,
        'plaid_environment': PLAID_ENV,
        'plaid_products': PLAID_PRODUCTS,
    }
    return render(request, "plaid_api/index.html", context)


@login_required
@require_http_methods(['POST'])
def get_access_token(request):
    """Return plaid access token via POST only"""
    public_token = request.POST['public_token']
    try:
        exchange_response = client.Item.public_token.exchange(public_token)
    except plaid.errors.PlaidError as e:
        print(e)
        return JsonResponse(format_error(e))
    pretty_print_response(exchange_response)
    access_token = exchange_response['access_token']
    i = Item(access_token=access_token, user=request.user)
    i.save()
    return JsonResponse(exchange_response)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def auth(request):
    access_tokens = lookup_access_tokens(request.user)
    auth_response = {}
    for access_token in access_tokens:
        try:
            auth_response[access_token] = client.Auth.get(access_token)
        except plaid.errors.PlaidError as e:
            auth_response[access_token] = format_error(e)
    pretty_print_response(auth_response)
    return Response({'error': None, 'auth': auth_response})


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def identity(request):
    access_tokens = lookup_access_tokens(request.user)
    identity_response = {}
    for access_token in access_tokens:
        try:
            identity_response[access_token] = client.Identity.get(access_token)
        except plaid.errors.PlaidError as e:
            identity_response[access_token] = format_error(e)
    pretty_print_response(identity_response)
    return Response({'error': None, 'identity': identity_response})


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def transactions(request):
    access_tokens = lookup_access_tokens(request.user)
    start_date = '{:%Y-%m-%d}'.format(datetime.datetime.now()
                + datetime.timedelta(-30))
    end_date = '{:%Y-%m-%d}'.format(datetime.datetime.now())
    transactions_response = {}
    for access_token in access_tokens:
        try:
            transactions_response[access_token] = \
                client.Transactions.get(access_token, start_date, end_date)
        except plaid.errors.PlaidError as e:
            transactions_response[access_token] = format_error(e)
    pretty_print_response(transactions_response)
    return Response({'error': None, 'transactions': transactions_response})


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def linegraph(request):
    access_tokens = lookup_access_tokens(request.user)
    start_date = '{:%Y-%m-%d}'.format(datetime.datetime.now()
                + datetime.timedelta(-62))
    end_date = '{:%Y-%m-%d}'.format(datetime.datetime.now())
    data = {}
    for access_token in access_tokens:
        try:
            data[access_token] = \
                client.Transactions.get(access_token, start_date, end_date)
        except plaid.errors.PlaidError as e:
            data[access_token] = format_error(e)
    curr_month = datetime.datetime.today().month
    prev_month = curr_month - 1
    prev_total = curr_total = 0
    output = {}
    for i in range(1, 32):
        output[i] = {
            prev_month: 0,
            curr_month: 0
        }
    for token in data:
        try:
            for t in data[token]["transactions"]:
                date = datetime.datetime.strptime(t['date'], '%Y-%m-%d').date()
                if t['amount'] < 0 and date.month in output[1]:
                    output[date.day][date.month] += int(t['amount'] * 100)
        except:
            print(f"Error parsing data[{token}]['transactions']")
    for key in output:
        val = output[key]
        prev_total += val[prev_month]
        curr_total += val[curr_month]
        val[prev_month] = prev_total / 100.00
        val[curr_month] = curr_total / 100.00
    return Response(response)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def balance(request):
    """
    Retrieve real-time balance data for each of an Item's accounts
    https://plaid.com/docs/#balance
    """
    access_tokens = lookup_access_tokens(request.user)
    balance_response = {}
    for access_token in access_tokens:
        try:
            balance_response[access_token] = client.Accounts.balance.get(access_token)
        except plaid.errors.PlaidError as e:
            balance_response[access_token] = format_error(e)
    pretty_print_response(balance_response)
    return Response({'error': None, 'balance': balance_response})


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def accounts(request):
    """
    Retrieve an Item's accounts
    https://plaid.com/docs/#accounts
    """
    access_tokens = lookup_access_tokens(request.user)
    accounts_response = {}
    for access_token in access_tokens:
        try:
            accounts_response[access_token] = client.Accounts.get(access_token)
        except plaid.errors.PlaidError as e:
            accounts_response[access_token] = format_error(e)
    pretty_print_response(accounts_response)
    return Response({'error': None, 'accounts': accounts_response})


def pretty_print_response(response):
    print(json.dumps(response, indent=2, sort_keys=True))

def format_error(e):
    return {
        'error': {
            'display_message': e.display_message,
            'error_code': e.code,
            'error_type': e.type,
        }
    }

def lookup_access_tokens(user):
    res = []
    for item in Item.objects.filter(user=user):
        res.append(item.access_token)
    return res

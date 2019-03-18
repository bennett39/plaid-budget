import json
import os
import plaid

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods

from dotenv import load_dotenv
load_dotenv()

PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_PUBLIC_KEY = os.getenv('PLAID_PUBLIC_KEY')
PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions')

client = plaid.Client(
    client_id=PLAID_CLIENT_ID,
    secret=PLAID_SECRET,
    public_key=PLAID_PUBLIC_KEY,
    environment=PLAID_ENV,
    api_version='2018-05-22',
)

access_token = None


def index(request):
    """Show login landing page"""
    context = {
        'plaid_public_key': PLAID_PUBLIC_KEY,
        'plaid_environment': PLAID_ENV,
        'plaid_products': PLAID_PRODUCTS,
    }
    return render(request, "plaid_api/index.html", context)


@require_http_methods(['POST'])
def get_access_token(request):
    """Return plaid access token via POST only"""
    global access_token
    public_token = request.POST['public_token']
    try:
        exchange_response = client.Item.public_token.exchange(public_token)
    except plaid.errors.PlaidError as e:
        return JsonResponse(format_error(e))
    pretty_print_response(exchange_response)
    access_token = exchange_response['access_token']
    return JsonResponse(exchange_response)

def pretty_print_response(response):
    print(json.dumps(response, indent=2, sort_keys=True))

def format_error(e):
    return {
        'error': {
            'display_message': e.display_message,
            'error_code': e.code,
            'error_type': e.type,
            'error_message': e.message
        }
    }


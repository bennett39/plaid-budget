from django.http import HttpResponse

def year_view(request, year):
    return HttpResponse("<html><body>" + year + "</body></html>")


def password_reset(request, uidb64, token):
    return HttpResponse("<html><body><p>UIDB64: " + uidb64
            + "</p><p>TOKEN: " + token + "</p></body></html>")

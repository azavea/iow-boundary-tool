from django.http import HttpResponse



# TODO: Replace this with api views

def index(request):

    return HttpResponse(

        "Example API response", content_type="text/plain; charset=UTF-8"

    )

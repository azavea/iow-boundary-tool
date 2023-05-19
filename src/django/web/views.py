from django.conf import settings
from django.shortcuts import render


def environment(request):
    """
    A JavaScript snippet that initializes the environment
    """
    environment = {
        'IOW_TILES_HOST': settings.IOW_TILES_HOST,
    }

    # Add Environment variable, lowered for easier comparison
    # One of `development`, `testing`, `staging`, `production`
    environment['ENVIRONMENT'] = settings.ENVIRONMENT.lower()

    context = {'environment': environment}

    return render(
        request,
        'web/environment.js',
        context,
        content_type='application/javascript; charset=utf-8',
    )

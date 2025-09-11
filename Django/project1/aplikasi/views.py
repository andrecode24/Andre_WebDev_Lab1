from django.shortcuts import HttpResponse
from django.template import loader
from .models import Mahasiswa


# Create your views here.
def mahasiswa(request):
    mymahasiswa = Mahasiswa.objects.all().values()
    template = loader.get_template('index.html')
 
    context = {
        'mymahasiswa': mymahasiswa,
    }

    return HttpResponse(template.render(context, request))
from django.contrib import admin
from apps.Reader.models import Reader

# Register your models here.

admin.site.register(Reader,admin.ModelAdmin)
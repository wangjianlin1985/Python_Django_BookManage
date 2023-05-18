from django.contrib import admin
from apps.ReaderType.models import ReaderType

# Register your models here.

admin.site.register(ReaderType,admin.ModelAdmin)
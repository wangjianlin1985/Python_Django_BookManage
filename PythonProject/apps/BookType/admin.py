from django.contrib import admin
from apps.BookType.models import BookType

# Register your models here.

admin.site.register(BookType,admin.ModelAdmin)
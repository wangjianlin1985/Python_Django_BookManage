from django.db import models
from apps.BookType.models import BookType
from tinymce.models import HTMLField


class Book(models.Model):
    barcode = models.CharField(max_length=20, default='', primary_key=True, verbose_name='图书条形码')
    bookName = models.CharField(max_length=20, default='', verbose_name='图书名称')
    bookTypeObj = models.ForeignKey(BookType,  db_column='bookTypeObj', on_delete=models.PROTECT, verbose_name='图书所在类别')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='图书价格')
    count = models.IntegerField(default=0,verbose_name='库存')
    publishDate = models.CharField(max_length=20, default='', verbose_name='出版日期')
    publish = models.CharField(max_length=20, default='', verbose_name='出版社')
    bookPhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='图书图片')
    bookDesc = HTMLField(max_length=8000, verbose_name='图书简介')

    class Meta:
        db_table = 't_Book'
        verbose_name = '图书信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        book = {
            'barcode': self.barcode,
            'bookName': self.bookName,
            'bookTypeObj': self.bookTypeObj.bookTypeName,
            'bookTypeObjPri': self.bookTypeObj.bookTypeId,
            'price': self.price,
            'count': self.count,
            'publishDate': self.publishDate,
            'publish': self.publish,
            'bookPhoto': self.bookPhoto.url,
            'bookDesc': self.bookDesc,
        }
        return book


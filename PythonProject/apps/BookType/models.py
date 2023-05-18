from django.db import models


class BookType(models.Model):
    bookTypeId = models.AutoField(primary_key=True, verbose_name='图书类别')
    bookTypeName = models.CharField(max_length=18, default='', verbose_name='类别名称')
    days = models.IntegerField(default=0,verbose_name='可借阅天数')

    class Meta:
        db_table = 't_BookType'
        verbose_name = '图书类型信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        bookType = {
            'bookTypeId': self.bookTypeId,
            'bookTypeName': self.bookTypeName,
            'days': self.days,
        }
        return bookType


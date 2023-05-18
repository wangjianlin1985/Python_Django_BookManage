from django.db import models


class ReaderType(models.Model):
    readerTypeId = models.AutoField(primary_key=True, verbose_name='读者类型编号')
    readerTypeName = models.CharField(max_length=20, default='', verbose_name='读者类型')
    number = models.IntegerField(default=0,verbose_name='可借阅数目')

    class Meta:
        db_table = 't_ReaderType'
        verbose_name = '读者类型信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        readerType = {
            'readerTypeId': self.readerTypeId,
            'readerTypeName': self.readerTypeName,
            'number': self.number,
        }
        return readerType


from django.db import models
from apps.ReaderType.models import ReaderType


class Reader(models.Model):
    readerNo = models.CharField(max_length=20, default='', primary_key=True, verbose_name='读者编号')
    password = models.CharField(max_length=20, default='', verbose_name='登录密码')
    readerTypeObj = models.ForeignKey(ReaderType,  db_column='readerTypeObj', on_delete=models.PROTECT, verbose_name='读者类型')
    readerName = models.CharField(max_length=20, default='', verbose_name='姓名')
    sex = models.CharField(max_length=2, default='', verbose_name='性别')
    birthday = models.CharField(max_length=20, default='', verbose_name='读者生日')
    telephone = models.CharField(max_length=20, default='', verbose_name='联系电话')
    email = models.CharField(max_length=50, default='', verbose_name='联系Email')
    address = models.CharField(max_length=80, default='', verbose_name='读者地址')
    photo = models.ImageField(upload_to='img', max_length='100', verbose_name='读者头像')

    class Meta:
        db_table = 't_Reader'
        verbose_name = '读者信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        reader = {
            'readerNo': self.readerNo,
            'password': self.password,
            'readerTypeObj': self.readerTypeObj.readerTypeName,
            'readerTypeObjPri': self.readerTypeObj.readerTypeId,
            'readerName': self.readerName,
            'sex': self.sex,
            'birthday': self.birthday,
            'telephone': self.telephone,
            'email': self.email,
            'address': self.address,
            'photo': self.photo.url,
        }
        return reader


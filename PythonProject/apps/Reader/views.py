from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Reader.models import Reader
from apps.ReaderType.models import ReaderType
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台读者添加
    def primaryKeyExist(self, readerNo):  # 判断主键是否存在
        try:
            Reader.objects.get(readerNo=readerNo)
            return True
        except Reader.DoesNotExist:
            return False

    def get(self,request):
        readerTypes = ReaderType.objects.all()  # 获取所有读者类型
        context = {
            'readerTypes': readerTypes,
        }

        # 使用模板
        return render(request, 'Reader/reader_frontAdd.html', context)

    def post(self, request):
        readerNo = request.POST.get('reader.readerNo') # 判断读者编号是否存在
        if self.primaryKeyExist(readerNo):
            return JsonResponse({'success': False, 'message': '读者编号已经存在'})

        reader = Reader() # 新建一个读者对象然后获取参数
        reader.readerNo = readerNo
        reader.password = request.POST.get('reader.password')
        reader.readerTypeObj = ReaderType.objects.get(readerTypeId=request.POST.get('reader.readerTypeObj.readerTypeId'))
        reader.readerName = request.POST.get('reader.readerName')
        reader.sex = request.POST.get('reader.sex')
        reader.birthday = request.POST.get('reader.birthday')
        reader.telephone = request.POST.get('reader.telephone')
        reader.email = request.POST.get('reader.email')
        reader.address = request.POST.get('reader.address')
        try:
            reader.photo = self.uploadImageFile(request,'reader.photo')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        reader.save() # 保存读者信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改读者
    def get(self, request, readerNo):
        context = {'readerNo': readerNo}
        return render(request, 'Reader/reader_frontModify.html', context)

class FrontSelfModifyView(BaseView):  # 前台修改个人信息
    def get(self, request):
        context = {'readerNo': request.session['user_name']}
        return render(request, 'Reader/reader_frontModify.html', context)

class FrontListView(BaseView):  # 前台读者查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        readerNo = self.getStrParam(request, 'readerNo')
        readerTypeObj_readerTypeId = self.getIntParam(request, 'readerTypeObj.readerTypeId')
        readerName = self.getStrParam(request, 'readerName')
        birthday = self.getStrParam(request, 'birthday')
        telephone = self.getStrParam(request, 'telephone')
        # 然后条件组合查询过滤
        readers = Reader.objects.all()
        if readerNo != '':
            readers = readers.filter(readerNo__contains=readerNo)
        if readerTypeObj_readerTypeId != '0':
            readers = readers.filter(readerTypeObj=readerTypeObj_readerTypeId)
        if readerName != '':
            readers = readers.filter(readerName__contains=readerName)
        if birthday != '':
            readers = readers.filter(birthday__contains=birthday)
        if telephone != '':
            readers = readers.filter(telephone__contains=telephone)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(readers, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        readers_page = self.paginator.page(self.currentPage)

        # 获取所有读者类型
        readerTypes = ReaderType.objects.all()
        # 构造模板需要的参数
        context = {
            'readerTypes': readerTypes,
            'readers_page': readers_page,
            'readerNo': readerNo,
            'readerTypeObj_readerTypeId': int(readerTypeObj_readerTypeId),
            'readerName': readerName,
            'birthday': birthday,
            'telephone': telephone,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Reader/reader_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示读者详情页
    def get(self, request, readerNo):
        # 查询需要显示的读者对象
        reader = Reader.objects.get(readerNo=readerNo)
        context = {
            'reader': reader
        }
        # 渲染模板显示
        return render(request, 'Reader/reader_frontshow.html', context)


class ListAllView(View): # 前台查询所有读者
    def get(self,request):
        readers = Reader.objects.all()
        readerList = []
        for reader in readers:
            readerObj = {
                'readerNo': reader.readerNo,
                'readerName': reader.readerName,
            }
            readerList.append(readerObj)
        return JsonResponse(readerList, safe=False)


class UpdateView(BaseView):  # Ajax方式读者更新
    def get(self, request, readerNo):
        # GET方式请求查询读者对象并返回读者json格式
        reader = Reader.objects.get(readerNo=readerNo)
        return JsonResponse(reader.getJsonObj())

    def post(self, request, readerNo):
        # POST方式提交读者修改信息更新到数据库
        reader = Reader.objects.get(readerNo=readerNo)
        reader.password = request.POST.get('reader.password')
        reader.readerTypeObj = ReaderType.objects.get(readerTypeId=request.POST.get('reader.readerTypeObj.readerTypeId'))
        reader.readerName = request.POST.get('reader.readerName')
        reader.sex = request.POST.get('reader.sex')
        reader.birthday = request.POST.get('reader.birthday')
        reader.telephone = request.POST.get('reader.telephone')
        reader.email = request.POST.get('reader.email')
        reader.address = request.POST.get('reader.address')
        try:
            photoName = self.uploadImageFile(request, 'reader.photo')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        if photoName != 'img/NoImage.jpg':
            reader.photo = photoName
        reader.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台读者添加
    def primaryKeyExist(self, readerNo):  # 判断主键是否存在
        try:
            Reader.objects.get(readerNo=readerNo)
            return True
        except Reader.DoesNotExist:
            return False

    def get(self,request):
        readerTypes = ReaderType.objects.all()  # 获取所有读者类型
        context = {
            'readerTypes': readerTypes,
        }

        # 渲染显示模板界面
        return render(request, 'Reader/reader_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        readerNo = request.POST.get('reader.readerNo') # 判断读者编号是否存在
        if self.primaryKeyExist(readerNo):
            return JsonResponse({'success': False, 'message': '读者编号已经存在'})

        reader = Reader() # 新建一个读者对象然后获取参数
        reader.readerNo = readerNo
        reader.password = request.POST.get('reader.password')
        reader.readerTypeObj = ReaderType.objects.get(readerTypeId=request.POST.get('reader.readerTypeObj.readerTypeId'))
        reader.readerName = request.POST.get('reader.readerName')
        reader.sex = request.POST.get('reader.sex')
        reader.birthday = request.POST.get('reader.birthday')
        reader.telephone = request.POST.get('reader.telephone')
        reader.email = request.POST.get('reader.email')
        reader.address = request.POST.get('reader.address')
        try:
            reader.photo = self.uploadImageFile(request,'reader.photo')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        reader.save() # 保存读者信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新读者
    def get(self, request, readerNo):
        context = {'readerNo': readerNo}
        return render(request, 'Reader/reader_modify.html', context)


class ListView(BaseView):  # 后台读者列表
    def get(self, request):
        # 使用模板
        return render(request, 'Reader/reader_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        readerNo = self.getStrParam(request, 'readerNo')
        readerTypeObj_readerTypeId = self.getIntParam(request, 'readerTypeObj.readerTypeId')
        readerName = self.getStrParam(request, 'readerName')
        birthday = self.getStrParam(request, 'birthday')
        telephone = self.getStrParam(request, 'telephone')
        # 然后条件组合查询过滤
        readers = Reader.objects.all()
        if readerNo != '':
            readers = readers.filter(readerNo__contains=readerNo)
        if readerTypeObj_readerTypeId != '0':
            readers = readers.filter(readerTypeObj=readerTypeObj_readerTypeId)
        if readerName != '':
            readers = readers.filter(readerName__contains=readerName)
        if birthday != '':
            readers = readers.filter(birthday__contains=birthday)
        if telephone != '':
            readers = readers.filter(telephone__contains=telephone)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(readers, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        readers_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        readerList = []
        for reader in readers_page:
            reader = reader.getJsonObj()
            readerList.append(reader)
        # 构造模板页面需要的参数
        reader_res = {
            'rows': readerList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(reader_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除读者信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        readerNos = self.getStrParam(request, 'readerNos')
        readerNos = readerNos.split(',')
        count = 0
        try:
            for readerNo in readerNos:
                Reader.objects.get(readerNo=readerNo).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出读者信息到excel并下载
    def get(self, request):
        # 收集查询参数
        readerNo = self.getStrParam(request, 'readerNo')
        readerTypeObj_readerTypeId = self.getIntParam(request, 'readerTypeObj.readerTypeId')
        readerName = self.getStrParam(request, 'readerName')
        birthday = self.getStrParam(request, 'birthday')
        telephone = self.getStrParam(request, 'telephone')
        # 然后条件组合查询过滤
        readers = Reader.objects.all()
        if readerNo != '':
            readers = readers.filter(readerNo__contains=readerNo)
        if readerTypeObj_readerTypeId != '0':
            readers = readers.filter(readerTypeObj=readerTypeObj_readerTypeId)
        if readerName != '':
            readers = readers.filter(readerName__contains=readerName)
        if birthday != '':
            readers = readers.filter(birthday__contains=birthday)
        if telephone != '':
            readers = readers.filter(telephone__contains=telephone)
        #将查询结果集转换成列表
        readerList = []
        for reader in readers:
            reader = reader.getJsonObj()
            readerList.append(reader)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(readerList)
        # 设置要导入到excel的列
        columns_map = {
            'readerNo': '读者编号',
            'readerTypeObj': '读者类型',
            'readerName': '姓名',
            'sex': '性别',
            'birthday': '读者生日',
            'telephone': '联系电话',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'readers.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="readers.xlsx"'
        return response


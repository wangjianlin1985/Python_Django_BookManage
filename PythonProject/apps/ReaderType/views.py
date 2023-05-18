from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.ReaderType.models import ReaderType
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台读者类型添加
    def get(self,request):

        # 使用模板
        return render(request, 'ReaderType/readerType_frontAdd.html')

    def post(self, request):
        readerType = ReaderType() # 新建一个读者类型对象然后获取参数
        readerType.readerTypeName = request.POST.get('readerType.readerTypeName')
        readerType.number = int(request.POST.get('readerType.number'))
        readerType.save() # 保存读者类型信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改读者类型
    def get(self, request, readerTypeId):
        context = {'readerTypeId': readerTypeId}
        return render(request, 'ReaderType/readerType_frontModify.html', context)


class FrontListView(BaseView):  # 前台读者类型查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        # 然后条件组合查询过滤
        readerTypes = ReaderType.objects.all()
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(readerTypes, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        readerTypes_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'readerTypes_page': readerTypes_page,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'ReaderType/readerType_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示读者类型详情页
    def get(self, request, readerTypeId):
        # 查询需要显示的读者类型对象
        readerType = ReaderType.objects.get(readerTypeId=readerTypeId)
        context = {
            'readerType': readerType
        }
        # 渲染模板显示
        return render(request, 'ReaderType/readerType_frontshow.html', context)


class ListAllView(View): # 前台查询所有读者类型
    def get(self,request):
        readerTypes = ReaderType.objects.all()
        readerTypeList = []
        for readerType in readerTypes:
            readerTypeObj = {
                'readerTypeId': readerType.readerTypeId,
                'readerTypeName': readerType.readerTypeName,
            }
            readerTypeList.append(readerTypeObj)
        return JsonResponse(readerTypeList, safe=False)


class UpdateView(BaseView):  # Ajax方式读者类型更新
    def get(self, request, readerTypeId):
        # GET方式请求查询读者类型对象并返回读者类型json格式
        readerType = ReaderType.objects.get(readerTypeId=readerTypeId)
        return JsonResponse(readerType.getJsonObj())

    def post(self, request, readerTypeId):
        # POST方式提交读者类型修改信息更新到数据库
        readerType = ReaderType.objects.get(readerTypeId=readerTypeId)
        readerType.readerTypeName = request.POST.get('readerType.readerTypeName')
        readerType.number = int(request.POST.get('readerType.number'))
        readerType.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台读者类型添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'ReaderType/readerType_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        readerType = ReaderType() # 新建一个读者类型对象然后获取参数
        readerType.readerTypeName = request.POST.get('readerType.readerTypeName')
        readerType.number = int(request.POST.get('readerType.number'))
        readerType.save() # 保存读者类型信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新读者类型
    def get(self, request, readerTypeId):
        context = {'readerTypeId': readerTypeId}
        return render(request, 'ReaderType/readerType_modify.html', context)


class ListView(BaseView):  # 后台读者类型列表
    def get(self, request):
        # 使用模板
        return render(request, 'ReaderType/readerType_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        # 然后条件组合查询过滤
        readerTypes = ReaderType.objects.all()
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(readerTypes, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        readerTypes_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        readerTypeList = []
        for readerType in readerTypes_page:
            readerType = readerType.getJsonObj()
            readerTypeList.append(readerType)
        # 构造模板页面需要的参数
        readerType_res = {
            'rows': readerTypeList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(readerType_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除读者类型信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        readerTypeIds = self.getStrParam(request, 'readerTypeIds')
        readerTypeIds = readerTypeIds.split(',')
        count = 0
        try:
            for readerTypeId in readerTypeIds:
                ReaderType.objects.get(readerTypeId=readerTypeId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出读者类型信息到excel并下载
    def get(self, request):
        # 收集查询参数
        # 然后条件组合查询过滤
        readerTypes = ReaderType.objects.all()
        #将查询结果集转换成列表
        readerTypeList = []
        for readerType in readerTypes:
            readerType = readerType.getJsonObj()
            readerTypeList.append(readerType)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(readerTypeList)
        # 设置要导入到excel的列
        columns_map = {
            'readerTypeId': '读者类型编号',
            'readerTypeName': '读者类型',
            'number': '可借阅数目',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'readerTypes.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="readerTypes.xlsx"'
        return response


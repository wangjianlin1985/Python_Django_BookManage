from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.BookType.models import BookType
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台图书类型添加
    def get(self,request):

        # 使用模板
        return render(request, 'BookType/bookType_frontAdd.html')

    def post(self, request):
        bookType = BookType() # 新建一个图书类型对象然后获取参数
        bookType.bookTypeName = request.POST.get('bookType.bookTypeName')
        bookType.days = int(request.POST.get('bookType.days'))
        bookType.save() # 保存图书类型信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改图书类型
    def get(self, request, bookTypeId):
        context = {'bookTypeId': bookTypeId}
        return render(request, 'BookType/bookType_frontModify.html', context)


class FrontListView(BaseView):  # 前台图书类型查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        # 然后条件组合查询过滤
        bookTypes = BookType.objects.all()
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(bookTypes, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        bookTypes_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'bookTypes_page': bookTypes_page,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'BookType/bookType_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示图书类型详情页
    def get(self, request, bookTypeId):
        # 查询需要显示的图书类型对象
        bookType = BookType.objects.get(bookTypeId=bookTypeId)
        context = {
            'bookType': bookType
        }
        # 渲染模板显示
        return render(request, 'BookType/bookType_frontshow.html', context)


class ListAllView(View): # 前台查询所有图书类型
    def get(self,request):
        bookTypes = BookType.objects.all()
        bookTypeList = []
        for bookType in bookTypes:
            bookTypeObj = {
                'bookTypeId': bookType.bookTypeId,
                'bookTypeName': bookType.bookTypeName,
            }
            bookTypeList.append(bookTypeObj)
        return JsonResponse(bookTypeList, safe=False)


class UpdateView(BaseView):  # Ajax方式图书类型更新
    def get(self, request, bookTypeId):
        # GET方式请求查询图书类型对象并返回图书类型json格式
        bookType = BookType.objects.get(bookTypeId=bookTypeId)
        return JsonResponse(bookType.getJsonObj())

    def post(self, request, bookTypeId):
        # POST方式提交图书类型修改信息更新到数据库
        bookType = BookType.objects.get(bookTypeId=bookTypeId)
        bookType.bookTypeName = request.POST.get('bookType.bookTypeName')
        bookType.days = int(request.POST.get('bookType.days'))
        bookType.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台图书类型添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'BookType/bookType_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        bookType = BookType() # 新建一个图书类型对象然后获取参数
        bookType.bookTypeName = request.POST.get('bookType.bookTypeName')
        bookType.days = int(request.POST.get('bookType.days'))
        bookType.save() # 保存图书类型信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新图书类型
    def get(self, request, bookTypeId):
        context = {'bookTypeId': bookTypeId}
        return render(request, 'BookType/bookType_modify.html', context)


class ListView(BaseView):  # 后台图书类型列表
    def get(self, request):
        # 使用模板
        return render(request, 'BookType/bookType_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        # 然后条件组合查询过滤
        bookTypes = BookType.objects.all()
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(bookTypes, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        bookTypes_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        bookTypeList = []
        for bookType in bookTypes_page:
            bookType = bookType.getJsonObj()
            bookTypeList.append(bookType)
        # 构造模板页面需要的参数
        bookType_res = {
            'rows': bookTypeList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(bookType_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除图书类型信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        bookTypeIds = self.getStrParam(request, 'bookTypeIds')
        bookTypeIds = bookTypeIds.split(',')
        count = 0
        try:
            for bookTypeId in bookTypeIds:
                BookType.objects.get(bookTypeId=bookTypeId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出图书类型信息到excel并下载
    def get(self, request):
        # 收集查询参数
        # 然后条件组合查询过滤
        bookTypes = BookType.objects.all()
        #将查询结果集转换成列表
        bookTypeList = []
        for bookType in bookTypes:
            bookType = bookType.getJsonObj()
            bookTypeList.append(bookType)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(bookTypeList)
        # 设置要导入到excel的列
        columns_map = {
            'bookTypeId': '图书类别',
            'bookTypeName': '类别名称',
            'days': '可借阅天数',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'bookTypes.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="bookTypes.xlsx"'
        return response


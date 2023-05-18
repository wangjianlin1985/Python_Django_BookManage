var bookType_manage_tool = null; 
$(function () { 
	initBookTypeManageTool(); //建立BookType管理对象
	bookType_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#bookType_manage").datagrid({
		url : '/BookType/list',
		queryParams: {
			"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		},
		fit : true,
		fitColumns : true,
		striped : true,
		rownumbers : true,
		border : false,
		pagination : true,
		pageSize : 5,
		pageList : [5, 10, 15, 20, 25],
		pageNumber : 1,
		sortName : "bookTypeId",
		sortOrder : "desc",
		toolbar : "#bookType_manage_tool",
		columns : [[
			{
				field : "bookTypeId",
				title : "图书类别",
				width : 70,
			},
			{
				field : "bookTypeName",
				title : "类别名称",
				width : 140,
			},
			{
				field : "days",
				title : "可借阅天数",
				width : 70,
			},
		]],
	});

	$("#bookTypeEditDiv").dialog({
		title : "修改管理",
		top: "50px",
		width : 700,
		height : 515,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#bookTypeEditForm").form("validate")) {
					//验证表单 
					if(!$("#bookTypeEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#bookTypeEditForm").form({
						    url:"/BookType/update/" + $("#bookType_bookTypeId_edit").val(),
						    onSubmit: function(){
								if($("#bookTypeEditForm").form("validate"))  {
				                	$.messager.progress({
										text : "正在提交数据中...",
									});
				                	return true;
				                } else { 
				                    return false; 
				                }
						    },
						    success:function(data){
						    	$.messager.progress("close");
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#bookTypeEditDiv").dialog("close");
			                        bookType_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#bookTypeEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#bookTypeEditDiv").dialog("close");
				$("#bookTypeEditForm").form("reset"); 
			},
		}],
	});
});

function initBookTypeManageTool() {
	bookType_manage_tool = {
		init: function() {
		},
		reload : function () {
			$("#bookType_manage").datagrid("reload");
		},
		redo : function () {
			$("#bookType_manage").datagrid("unselectAll");
		},
		search: function() {
			$("#bookType_manage").datagrid("options").queryParams=queryParams; 
			$("#bookType_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#bookTypeQueryForm").form({
			    url:"/BookType/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#bookTypeQueryForm").submit();
		},
		remove : function () {
			var rows = $("#bookType_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var bookTypeIds = [];
						for (var i = 0; i < rows.length; i ++) {
							bookTypeIds.push(rows[i].bookTypeId);
						}
						$.ajax({
							type : "POST",
							url : "/BookType/deletes",
							data : {
								bookTypeIds : bookTypeIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#bookType_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#bookType_manage").datagrid("loaded");
									$("#bookType_manage").datagrid("load");
									$("#bookType_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#bookType_manage").datagrid("loaded");
									$("#bookType_manage").datagrid("load");
									$("#bookType_manage").datagrid("unselectAll");
									$.messager.alert("消息",data.message);
								}
							},
						});
					}
				});
			} else {
				$.messager.alert("提示", "请选择要删除的记录！", "info");
			}
		},
		edit : function () {
			var rows = $("#bookType_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/BookType/update/" + rows[0].bookTypeId,
					type : "get",
					data : {
						//bookTypeId : rows[0].bookTypeId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (bookType, response, status) {
						$.messager.progress("close");
						if (bookType) { 
							$("#bookTypeEditDiv").dialog("open");
							$("#bookType_bookTypeId_edit").val(bookType.bookTypeId);
							$("#bookType_bookTypeId_edit").validatebox({
								required : true,
								missingMessage : "请输入图书类别",
								editable: false
							});
							$("#bookType_bookTypeName_edit").val(bookType.bookTypeName);
							$("#bookType_bookTypeName_edit").validatebox({
								required : true,
								missingMessage : "请输入类别名称",
							});
							$("#bookType_days_edit").val(bookType.days);
							$("#bookType_days_edit").validatebox({
								required : true,
								validType : "integer",
								missingMessage : "请输入可借阅天数",
								invalidMessage : "可借阅天数输入不对",
							});
						} else {
							$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
						}
					}
				});
			} else if (rows.length == 0) {
				$.messager.alert("警告操作！", "编辑记录至少选定一条数据！", "warning");
			}
		},
	};
}

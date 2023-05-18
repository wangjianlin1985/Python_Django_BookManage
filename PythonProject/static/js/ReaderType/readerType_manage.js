var readerType_manage_tool = null; 
$(function () { 
	initReaderTypeManageTool(); //建立ReaderType管理对象
	readerType_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#readerType_manage").datagrid({
		url : '/ReaderType/list',
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
		sortName : "readerTypeId",
		sortOrder : "desc",
		toolbar : "#readerType_manage_tool",
		columns : [[
			{
				field : "readerTypeId",
				title : "读者类型编号",
				width : 70,
			},
			{
				field : "readerTypeName",
				title : "读者类型",
				width : 140,
			},
			{
				field : "number",
				title : "可借阅数目",
				width : 70,
			},
		]],
	});

	$("#readerTypeEditDiv").dialog({
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
				if ($("#readerTypeEditForm").form("validate")) {
					//验证表单 
					if(!$("#readerTypeEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#readerTypeEditForm").form({
						    url:"/ReaderType/update/" + $("#readerType_readerTypeId_edit").val(),
						    onSubmit: function(){
								if($("#readerTypeEditForm").form("validate"))  {
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
			                        $("#readerTypeEditDiv").dialog("close");
			                        readerType_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#readerTypeEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#readerTypeEditDiv").dialog("close");
				$("#readerTypeEditForm").form("reset"); 
			},
		}],
	});
});

function initReaderTypeManageTool() {
	readerType_manage_tool = {
		init: function() {
		},
		reload : function () {
			$("#readerType_manage").datagrid("reload");
		},
		redo : function () {
			$("#readerType_manage").datagrid("unselectAll");
		},
		search: function() {
			$("#readerType_manage").datagrid("options").queryParams=queryParams; 
			$("#readerType_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#readerTypeQueryForm").form({
			    url:"/ReaderType/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#readerTypeQueryForm").submit();
		},
		remove : function () {
			var rows = $("#readerType_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var readerTypeIds = [];
						for (var i = 0; i < rows.length; i ++) {
							readerTypeIds.push(rows[i].readerTypeId);
						}
						$.ajax({
							type : "POST",
							url : "/ReaderType/deletes",
							data : {
								readerTypeIds : readerTypeIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#readerType_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#readerType_manage").datagrid("loaded");
									$("#readerType_manage").datagrid("load");
									$("#readerType_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#readerType_manage").datagrid("loaded");
									$("#readerType_manage").datagrid("load");
									$("#readerType_manage").datagrid("unselectAll");
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
			var rows = $("#readerType_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/ReaderType/update/" + rows[0].readerTypeId,
					type : "get",
					data : {
						//readerTypeId : rows[0].readerTypeId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (readerType, response, status) {
						$.messager.progress("close");
						if (readerType) { 
							$("#readerTypeEditDiv").dialog("open");
							$("#readerType_readerTypeId_edit").val(readerType.readerTypeId);
							$("#readerType_readerTypeId_edit").validatebox({
								required : true,
								missingMessage : "请输入读者类型编号",
								editable: false
							});
							$("#readerType_readerTypeName_edit").val(readerType.readerTypeName);
							$("#readerType_readerTypeName_edit").validatebox({
								required : true,
								missingMessage : "请输入读者类型",
							});
							$("#readerType_number_edit").val(readerType.number);
							$("#readerType_number_edit").validatebox({
								required : true,
								validType : "integer",
								missingMessage : "请输入可借阅数目",
								invalidMessage : "可借阅数目输入不对",
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

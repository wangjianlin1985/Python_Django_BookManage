var reader_manage_tool = null; 
$(function () { 
	initReaderManageTool(); //建立Reader管理对象
	reader_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#reader_manage").datagrid({
		url : '/Reader/list',
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
		sortName : "readerNo",
		sortOrder : "desc",
		toolbar : "#reader_manage_tool",
		columns : [[
			{
				field : "readerNo",
				title : "读者编号",
				width : 140,
			},
			{
				field : "readerTypeObj",
				title : "读者类型",
				width : 140,
			},
			{
				field : "readerName",
				title : "姓名",
				width : 140,
			},
			{
				field : "sex",
				title : "性别",
				width : 140,
			},
			{
				field : "birthday",
				title : "读者生日",
				width : 140,
			},
			{
				field : "telephone",
				title : "联系电话",
				width : 140,
			},
			{
				field : "photo",
				title : "读者头像",
				width : "70px",
				height: "65px",
				formatter: function(val,row) {
					return "<img src='" + val + "' width='65px' height='55px' />";
				}
 			},
		]],
	});

	$("#readerEditDiv").dialog({
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
				if ($("#readerEditForm").form("validate")) {
					//验证表单 
					if(!$("#readerEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#readerEditForm").form({
						    url:"/Reader/update/" + $("#reader_readerNo_edit").val(),
						    onSubmit: function(){
								if($("#readerEditForm").form("validate"))  {
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
			                        $("#readerEditDiv").dialog("close");
			                        reader_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#readerEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#readerEditDiv").dialog("close");
				$("#readerEditForm").form("reset"); 
			},
		}],
	});
});

function initReaderManageTool() {
	reader_manage_tool = {
		init: function() {
			$.ajax({
				url : "/ReaderType/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#readerTypeObj_readerTypeId_query").combobox({ 
					    valueField:"readerTypeId",
					    textField:"readerTypeName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{readerTypeId:0,readerTypeName:"不限制"});
					$("#readerTypeObj_readerTypeId_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#reader_manage").datagrid("reload");
		},
		redo : function () {
			$("#reader_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#reader_manage").datagrid("options").queryParams;
			queryParams["readerNo"] = $("#readerNo").val();
			queryParams["readerTypeObj.readerTypeId"] = $("#readerTypeObj_readerTypeId_query").combobox("getValue");
			queryParams["readerName"] = $("#readerName").val();
			queryParams["birthday"] = $("#birthday").datebox("getValue"); 
			queryParams["telephone"] = $("#telephone").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#reader_manage").datagrid("options").queryParams=queryParams; 
			$("#reader_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#readerQueryForm").form({
			    url:"/Reader/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#readerQueryForm").submit();
		},
		remove : function () {
			var rows = $("#reader_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var readerNos = [];
						for (var i = 0; i < rows.length; i ++) {
							readerNos.push(rows[i].readerNo);
						}
						$.ajax({
							type : "POST",
							url : "/Reader/deletes",
							data : {
								readerNos : readerNos.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#reader_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#reader_manage").datagrid("loaded");
									$("#reader_manage").datagrid("load");
									$("#reader_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#reader_manage").datagrid("loaded");
									$("#reader_manage").datagrid("load");
									$("#reader_manage").datagrid("unselectAll");
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
			var rows = $("#reader_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Reader/update/" + rows[0].readerNo,
					type : "get",
					data : {
						//readerNo : rows[0].readerNo,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (reader, response, status) {
						$.messager.progress("close");
						if (reader) { 
							$("#readerEditDiv").dialog("open");
							$("#reader_readerNo_edit").val(reader.readerNo);
							$("#reader_readerNo_edit").validatebox({
								required : true,
								missingMessage : "请输入读者编号",
								editable: false
							});
							$("#reader_password_edit").val(reader.password);
							$("#reader_readerTypeObj_readerTypeId_edit").combobox({
								url:"/ReaderType/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"readerTypeId",
							    textField:"readerTypeName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#reader_readerTypeObj_readerTypeId_edit").combobox("select", reader.readerTypeObjPri);
									//var data = $("#reader_readerTypeObj_readerTypeId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#reader_readerTypeObj_readerTypeId_edit").combobox("select", data[0].readerTypeId);
						            //}
								}
							});
							$("#reader_readerName_edit").val(reader.readerName);
							$("#reader_readerName_edit").validatebox({
								required : true,
								missingMessage : "请输入姓名",
							});
							$("#reader_sex_edit").val(reader.sex);
							$("#reader_sex_edit").validatebox({
								required : true,
								missingMessage : "请输入性别",
							});
							$("#reader_birthday_edit").datebox({
								value: reader.birthday,
							    required: true,
							    showSeconds: true,
							});
							$("#reader_telephone_edit").val(reader.telephone);
							$("#reader_email_edit").val(reader.email);
							$("#reader_address_edit").val(reader.address);
							$("#reader_photoImg").attr("src", reader.photo);
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

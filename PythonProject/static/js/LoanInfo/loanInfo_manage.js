var loanInfo_manage_tool = null; 
$(function () { 
	initLoanInfoManageTool(); //建立LoanInfo管理对象
	loanInfo_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#loanInfo_manage").datagrid({
		url : '/LoanInfo/list',
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
		sortName : "loadId",
		sortOrder : "desc",
		toolbar : "#loanInfo_manage_tool",
		columns : [[
			{
				field : "loadId",
				title : "借阅编号",
				width : 70,
			},
			{
				field : "book",
				title : "图书对象",
				width : 140,
			},
			{
				field : "reader",
				title : "读者对象",
				width : 140,
			},
			{
				field : "borrowDate",
				title : "借阅时间",
				width : 140,
			},
			{
				field : "returnDate",
				title : "归还时间",
				width : 140,
			},
		]],
	});

	$("#loanInfoEditDiv").dialog({
		title : "图书归还处理",
		top: "50px",
		width : 700,
		height : 315,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#loanInfoEditForm").form("validate")) {
					//验证表单 
					if(!$("#loanInfoEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#loanInfoEditForm").form({
						    url:"/LoanInfo/update/" + $("#loanInfo_loadId_edit").val(),
						    onSubmit: function(){
								if($("#loanInfoEditForm").form("validate"))  {
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
			                        $("#loanInfoEditDiv").dialog("close");
			                        loanInfo_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#loanInfoEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#loanInfoEditDiv").dialog("close");
				$("#loanInfoEditForm").form("reset"); 
			},
		}],
	});
});

function initLoanInfoManageTool() {
	loanInfo_manage_tool = {
		init: function() {
			$.ajax({
				url : "/Book/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#book_barcode_query").combobox({ 
					    valueField:"barcode",
					    textField:"bookName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{barcode:"",bookName:"不限制"});
					$("#book_barcode_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/Reader/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#reader_readerNo_query").combobox({ 
					    valueField:"readerNo",
					    textField:"readerName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{readerNo:"",readerName:"不限制"});
					$("#reader_readerNo_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#loanInfo_manage").datagrid("reload");
		},
		redo : function () {
			$("#loanInfo_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#loanInfo_manage").datagrid("options").queryParams;
			queryParams["book.barcode"] = $("#book_barcode_query").combobox("getValue");
			queryParams["reader.readerNo"] = $("#reader_readerNo_query").combobox("getValue");
			queryParams["borrowDate"] = $("#borrowDate").datebox("getValue"); 
			queryParams["returnDate"] = $("#returnDate").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#loanInfo_manage").datagrid("options").queryParams=queryParams; 
			$("#loanInfo_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#loanInfoQueryForm").form({
			    url:"/LoanInfo/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#loanInfoQueryForm").submit();
		},
		remove : function () {
			var rows = $("#loanInfo_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var loadIds = [];
						for (var i = 0; i < rows.length; i ++) {
							loadIds.push(rows[i].loadId);
						}
						$.ajax({
							type : "POST",
							url : "/LoanInfo/deletes",
							data : {
								loadIds : loadIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#loanInfo_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#loanInfo_manage").datagrid("loaded");
									$("#loanInfo_manage").datagrid("load");
									$("#loanInfo_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#loanInfo_manage").datagrid("loaded");
									$("#loanInfo_manage").datagrid("load");
									$("#loanInfo_manage").datagrid("unselectAll");
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
			var rows = $("#loanInfo_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/LoanInfo/update/" + rows[0].loadId,
					type : "get",
					data : {
						//loadId : rows[0].loadId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (loanInfo, response, status) {
						$.messager.progress("close");
						if (loanInfo) { 
							$("#loanInfoEditDiv").dialog("open");
							$("#loanInfo_loadId_edit").val(loanInfo.loadId);
							$("#loanInfo_loadId_edit").validatebox({
								required : true,
								missingMessage : "请输入借阅编号",
								editable: false
							});
							$("#loanInfo_book_barcode_edit").combobox({
								url:"/Book/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"barcode",
							    textField:"bookName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#loanInfo_book_barcode_edit").combobox("select", loanInfo.bookPri);
									//var data = $("#loanInfo_book_barcode_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#loanInfo_book_barcode_edit").combobox("select", data[0].barcode);
						            //}
								}
							});
							$("#loanInfo_reader_readerNo_edit").combobox({
								url:"/Reader/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"readerNo",
							    textField:"readerName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#loanInfo_reader_readerNo_edit").combobox("select", loanInfo.readerPri);
									//var data = $("#loanInfo_reader_readerNo_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#loanInfo_reader_readerNo_edit").combobox("select", data[0].readerNo);
						            //}
								}
							});
							$("#loanInfo_borrowDate_edit").datetimebox({
								value: loanInfo.borrowDate,
							    required: true,
							    showSeconds: true,
							});
							$("#loanInfo_returnDate_edit").datetimebox({
								value: loanInfo.returnDate,
							    required: true,
							    showSeconds: true,
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

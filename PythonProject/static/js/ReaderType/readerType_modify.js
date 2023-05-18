$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/ReaderType/update/" + $("#readerType_readerTypeId_modify").val(),
		type : "get",
		data : {
			//readerTypeId : $("#readerType_readerTypeId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (readerType, response, status) {
			$.messager.progress("close");
			if (readerType) { 
				$("#readerType_readerTypeId_modify").val(readerType.readerTypeId);
				$("#readerType_readerTypeId_modify").validatebox({
					required : true,
					missingMessage : "请输入读者类型编号",
					editable: false
				});
				$("#readerType_readerTypeName_modify").val(readerType.readerTypeName);
				$("#readerType_readerTypeName_modify").validatebox({
					required : true,
					missingMessage : "请输入读者类型",
				});
				$("#readerType_number_modify").val(readerType.number);
				$("#readerType_number_modify").validatebox({
					required : true,
					validType : "integer",
					missingMessage : "请输入可借阅数目",
					invalidMessage : "可借阅数目输入不对",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#readerTypeModifyButton").click(function(){ 
		if ($("#readerTypeModifyForm").form("validate")) {
			$("#readerTypeModifyForm").form({
			    url:"ReaderType/update/" + $("#readerType_readerTypeId_modify").val(),
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
                	var obj = jQuery.parseJSON(data);
                    if(obj.success){
                        $.messager.alert("消息","信息修改成功！");
                        $(".messager-window").css("z-index",10000);
                        //location.href="frontlist";
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    } 
			    }
			});
			//提交表单
			$("#readerTypeModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});

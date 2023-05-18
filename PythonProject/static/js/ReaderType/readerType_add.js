$(function () {
	$("#readerType_readerTypeName").validatebox({
		required : true, 
		missingMessage : '请输入读者类型',
	});

	$("#readerType_number").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入可借阅数目',
		invalidMessage : '可借阅数目输入不对',
	});

	//单击添加按钮
	$("#readerTypeAddButton").click(function () {
		//验证表单 
		if(!$("#readerTypeAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#readerTypeAddForm").form({
			    url:"/ReaderType/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#readerTypeAddForm").form("validate"))  { 
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
                    //此处data={"Success":true}是字符串
                	var obj = jQuery.parseJSON(data); 
                    if(obj.success){ 
                        $.messager.alert("消息","保存成功！");
                        $(".messager-window").css("z-index",10000);
                        $("#readerTypeAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#readerTypeAddForm").submit();
		}
	});

	//单击清空按钮
	$("#readerTypeClearButton").click(function () { 
		//$("#readerTypeAddForm").form("clear"); 
		location.reload()
	});
});

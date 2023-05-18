$(function () {
	$("#bookType_bookTypeName").validatebox({
		required : true, 
		missingMessage : '请输入类别名称',
	});

	$("#bookType_days").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入可借阅天数',
		invalidMessage : '可借阅天数输入不对',
	});

	//单击添加按钮
	$("#bookTypeAddButton").click(function () {
		//验证表单 
		if(!$("#bookTypeAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#bookTypeAddForm").form({
			    url:"/BookType/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#bookTypeAddForm").form("validate"))  { 
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
                        $("#bookTypeAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#bookTypeAddForm").submit();
		}
	});

	//单击清空按钮
	$("#bookTypeClearButton").click(function () { 
		//$("#bookTypeAddForm").form("clear"); 
		location.reload()
	});
});

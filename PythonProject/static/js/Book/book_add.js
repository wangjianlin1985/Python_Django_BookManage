$(function () {
	//实例化图书简介编辑器
    tinyMCE.init({
        selector: "#book_bookDesc",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
	$("#book_barcode").validatebox({
		required : true, 
		missingMessage : '请输入图书条形码',
	});

	$("#book_bookName").validatebox({
		required : true, 
		missingMessage : '请输入图书名称',
	});

	$("#book_price").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入图书价格',
		invalidMessage : '图书价格输入不对',
	});

	$("#book_count").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入库存',
		invalidMessage : '库存输入不对',
	});

	$("#book_publishDate").datebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	//单击添加按钮
	$("#bookAddButton").click(function () {
		//验证表单 
		if(!$("#bookAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#bookAddForm").form({
			    url:"/Book/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#bookAddForm").form("validate"))  { 
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
                        $("#bookAddForm").form("clear");
                        tinyMCE.editors['book_bookDesc'].setContent("");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#bookAddForm").submit();
		}
	});

	//单击清空按钮
	$("#bookClearButton").click(function () { 
		//$("#bookAddForm").form("clear"); 
		location.reload()
	});
});

$(function () {
    //实例化图书简介编辑器
    tinyMCE.init({
        selector: "#book_bookDesc_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Book/update/" + $("#book_barcode_modify").val(),
		type : "get",
		data : {
			//barcode : $("#book_barcode_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (book, response, status) {
			$.messager.progress("close");
			if (book) { 
				$("#book_barcode_modify").val(book.barcode);
				$("#book_barcode_modify").validatebox({
					required : true,
					missingMessage : "请输入图书条形码",
					editable: false
				});
				$("#book_bookName_modify").val(book.bookName);
				$("#book_bookName_modify").validatebox({
					required : true,
					missingMessage : "请输入图书名称",
				});
				$("#book_bookTypeObj_bookTypeId_modify").combobox({
					url:"/BookType/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"bookTypeId",
					textField:"bookTypeName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#book_bookTypeObj_bookTypeId_modify").combobox("select", book.bookTypeObjPri);
						//var data = $("#book_bookTypeObj_bookTypeId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#book_bookTypeObj_bookTypeId_edit").combobox("select", data[0].bookTypeId);
						//}
					}
				});
				$("#book_price_modify").val(book.price);
				$("#book_price_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入图书价格",
					invalidMessage : "图书价格输入不对",
				});
				$("#book_count_modify").val(book.count);
				$("#book_count_modify").validatebox({
					required : true,
					validType : "integer",
					missingMessage : "请输入库存",
					invalidMessage : "库存输入不对",
				});
				$("#book_publishDate_modify").datebox({
					value: book.publishDate,
					required: true,
					showSeconds: true,
				});
				$("#book_publish_modify").val(book.publish);
				$("#book_bookPhotoImgMod").attr("src", book.bookPhoto);
				tinyMCE.editors['book_bookDesc_modify'].setContent(book.bookDesc);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#bookModifyButton").click(function(){ 
		if ($("#bookModifyForm").form("validate")) {
			$("#bookModifyForm").form({
			    url:"Book/update/" + $("#book_barcode_modify").val(),
			    onSubmit: function(){
					if($("#bookEditForm").form("validate"))  {
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
			$("#bookModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});

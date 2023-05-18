$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Reader/update/" + $("#reader_readerNo_modify").val(),
		type : "get",
		data : {
			//readerNo : $("#reader_readerNo_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (reader, response, status) {
			$.messager.progress("close");
			if (reader) { 
				$("#reader_readerNo_modify").val(reader.readerNo);
				$("#reader_readerNo_modify").validatebox({
					required : true,
					missingMessage : "请输入读者编号",
					editable: false
				});
				$("#reader_password_modify").val(reader.password);
				$("#reader_readerTypeObj_readerTypeId_modify").combobox({
					url:"/ReaderType/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"readerTypeId",
					textField:"readerTypeName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#reader_readerTypeObj_readerTypeId_modify").combobox("select", reader.readerTypeObjPri);
						//var data = $("#reader_readerTypeObj_readerTypeId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#reader_readerTypeObj_readerTypeId_edit").combobox("select", data[0].readerTypeId);
						//}
					}
				});
				$("#reader_readerName_modify").val(reader.readerName);
				$("#reader_readerName_modify").validatebox({
					required : true,
					missingMessage : "请输入姓名",
				});
				$("#reader_sex_modify").val(reader.sex);
				$("#reader_sex_modify").validatebox({
					required : true,
					missingMessage : "请输入性别",
				});
				$("#reader_birthday_modify").datebox({
					value: reader.birthday,
					required: true,
					showSeconds: true,
				});
				$("#reader_telephone_modify").val(reader.telephone);
				$("#reader_email_modify").val(reader.email);
				$("#reader_address_modify").val(reader.address);
				$("#reader_photoImgMod").attr("src", reader.photo);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#readerModifyButton").click(function(){ 
		if ($("#readerModifyForm").form("validate")) {
			$("#readerModifyForm").form({
			    url:"Reader/update/" + $("#reader_readerNo_modify").val(),
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
			$("#readerModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});

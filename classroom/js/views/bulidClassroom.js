/**
 * @Author: Arvay
 * @Date:   2017年10月9日10:52:02
 * @Last modified by:   Arvay
 * @Last modified time: 2017年10月9日10:52:04
 */
$(function() {
	$('#startTime').datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		autoclose: true,
		minView: 'hour',
		maxView: 'decade',
		todayBtn: true
	});
	$('#endTime').datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		autoclose: true,
		minView: 'hour',
		maxView: 'decade',
		todayBtn: true
	});
	$('.container2 > img').cropper({
		aspectRatio: 16 / 9,
		movable: true,
		dragCrop: false,
		minCropBoxWidth: 320,
		minCropBoxHeight: 180,
		background: false,
		touchDragZoom:true,
		guides: false
	});

	// Upload cropped image to server
	$("#uploadUrl").click(function(){
		var $imgData=$("#preview").cropper('getCroppedCanvas')
		var dataurl = $imgData.toDataURL('image/png');
		console.log(dataurl)
	})

	$("#fileImg").click(function() {
		$("#buildUpload").click(); //隐藏了input:file样式后，点击头像就可以本地上传
		$("#buildUpload").on("change", function() {
			var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
			console.log(objUrl)
		$("#preview").cropper('replace',objUrl)
			if(objUrl) {
				$(".container2 img").attr("src", objUrl); //将图片路径存入src中，显示出图片
			}
		});
	});
	//建立一個可存取到該file的url
	function getObjectURL(file) {
		var url = null;
		if(window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if(window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if(window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	};
	/**
	 * 选择产品标签
	 */
	$(".lineList").on('click','li',function(){
		var thisClass = $(this).attr('class');
		if(thisClass == 'afterShow'){
			$(this).removeClass('afterShow')
		}else{
			$(this).addClass("afterShow");
		}
	});
})
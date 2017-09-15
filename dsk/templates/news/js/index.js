$(".header ").load('../header2.html');
		$("footer").load('../footer.html');
		$(".roomTab li").click(function() {
			var index = $(this).index();
			if(index == 0) {
				window.location.href = '../classroom.html?page=0';
			} else {
				window.location.href = '../classroom.html?page=1';
			}
		});
		$(function() {
			var href = window.location.search.split('=')[1];
			if(href == '0') {
				$(".roomTab li ").eq(0).addClass('roomTabClick').siblings().removeClass('roomTabClick');
			} else {
				$(".roomTab li ").eq(1).addClass('roomTabClick').siblings().removeClass('roomTabClick');
			};
			//详情
			$(".rommTextBox ").show();
		});
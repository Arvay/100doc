$(function() {
	function e() {
		$(".indexBox").hide(), $(".liveNext,#id_test_video").show(), $(".dskVideo").removeClass("dskVideoBorder"), $(".videoTitle,.indexLive").show(), $(".liveTab li").eq(0).addClass("liveTabAdd").siblings().removeClass("liveTabAdd")
	}

	function i() {
		$(".indexLive").show(), $(".dskVideo").addClass("dskVideoBorder"), $(".videoTitle,.liveSwiper,#id_test_video,.liveRight,.indexBox").hide(), $(".liveTab li").eq(1).addClass("liveTabAdd").siblings().removeClass("liveTabAdd");
		var e = setInterval(function() {
			l.update(), ++a > 6 && clearInterval(e)
		}, 800)
	}
	var l = new Swiper(".swiper-container", {
			direction: "horizontal",
			slidesPerView: 3,
			spaceBetween: 30,
			nextButton: ".swiper-button-next",
			prevButton: ".swiper-button-prev"
		}),
		d = window.location.search.split("=")[1],
		ps = window.location.search.split("?")[1];
	if(ps == "page") {
		d = 0
	};
	var s = new TcPlayer("id_test_video", {
		mp4: "http://ccp.alihealth.cn/static/images/suspense.mp4",
		autoplay: !1,
		width: "928",
		height: "522"
	});
	if("0" == d){
		(e(), $(".liveNext h1").html("公益视频"), $(".liveTab li").eq(0).addClass("liveTabAdd").siblings().removeClass("liveTabAdd"),setTimeout(function(){
			s.play();
		},5000))
	}else if("1"==d){
		(i(), $(".liveNext").show(), $(".liveNext h1").html("公益直播"), $(".id_test_video").css("display", "none"), $(".liveTab li").eq(1).addClass("liveTabAdd").siblings().removeClass("liveTabAdd"))
	}else if("2"==d){
		(i(), $(".reportBox,.report").show(), $(".id_test_video").css("display", "none"), $(".liveTab li").eq(2).addClass("liveTabAdd").siblings().removeClass("liveTabAdd"))
	};
	$(".liveTab li").click(function() {
		var l = $(this).index();
		 0 == l ? (e(), $(".liveNext h1").html("公益视频"), setTimeout(function(){
		 	s.play()
		 },5000)) : (i(), $(".liveNext").show(), $(".liveNext h1").html("公益直播"));
		 $(this).addClass("liveTabAdd").siblings().removeClass("liveTabAdd");
		 if(l==2){
		 	$(".liveNext,.reportText").hide();
		 	$(".reportBox,.report").show();
		 };
		 if(l!=0){
		 	s.pause();
		 };
		 if(l<2){
		 	$(".reportBox").hide();
		 };
	}), $(".liveRight li").click(function() {
		l.update(), $(".liveRight").hide()
	}), $(".el-ul").on("click", "span", function() {
		$(".contactUsBox").hide();
		var d = $(this).attr("class");
		"teb2_1" == d ? (l.update(), $(".liveTab li").eq(0).addClass("liveTabAdd").siblings().removeClass("liveTabAdd"), $(".liveNext").hide(), e()) : "teb2_2" == d && ($(".liveNext").show(), $(".liveTab li").eq(1).addClass("liveTabAdd").siblings().removeClass("liveTabAdd"), i())
	});
	/**
	 * 加载新闻
	 */
	$(".reportList li").click(function(){
		var urlId = $(this).attr('id');
		$(".reportText").load("news/"+urlId+".html").show(),$(".report").hide();
	});
	var a = 1,
		t = setInterval(function() {
			l.update(), ++a > 30 && clearInterval(t)
		}, 400);
	window._bd_share_config = {
			"common": {
				"bdSnsKey": {},
				"bdText": "",
				"bdMini": "2",
				"bdPic": "",
				"bdUrl":"http://ccp.alihealth.cn/dskLive.html?page=0",
				"bdStyle": "0",
				"bdSize": "16"
			},
			"share": {},
			"image": {
				"viewList": ["qzone", "tsina", "tqq", "renren", "weixin"],
				"viewText": "分享到：",
				"viewSize": "16"
			},
			"selectShare": {
				"bdContainerClass": null,
				"bdSelectMiniList": ["qzone", "tsina", "tqq", "renren", "weixin"]
			}
		};
	with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
});
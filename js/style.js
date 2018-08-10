$(function(){
	var slider = $("#hwslider");
	var dots = $("#dots span"),
		prev = $("#prev"),next = $("#next");
	var sliderInder = slider.children('ul')
	var hwsliderLi = sliderInder.children('li');
	var hwsliderSize = hwsliderLi.length;  //滑块的总个数
	var sliderWidth = 600; //滑块初始宽度
	var sliderHeight = 320; //滑块初始高度
	var index = 1; //初始显示第一个滑块
	var speed = 400; //滑动速度
	var interval = 3000; //间隔时间
	var dotShow = true; //是否显示可切换的导航圆点
	var autoPlay = false; //是否支持自动滑动
	var clickable = true; //是否已经点击了滑块在做滑动动画

	

	//初始化组件
	var resize = function(){
		var sWidth = slider.width();
		var dotWidth = hwsliderSize*20;
		var dotOffset = (sWidth-dotWidth)/2;

		var sHeight = sliderHeight/sliderWidth*sWidth;
		slider.css('height',sHeight); 
		$("#dots").css('left',dotOffset+'px'); //导航圆点位置

		var arrOffset = (sHeight-40)/2;
		$(".arr").css('top',arrOffset+'px'); //导航箭头位置
	}

	resize();

	$(window).resize(function(){
	  resize();
	});

});

// 移动端触屏滑动

var mouseX = 0,
	touchStartY = 0,
	touchStartX = 0;


	hwsliderLi.on({
		//触控开始
		'touchstart': function(e) {
			touchStartY = e.originalEvent.touches[0].clientY;
			touchStartX = e.originalEvent.touches[0].clientX;
		},

		//触控结束
		'touchend': function(e) {
			var touchEndY = e.originalEvent.changedTouches[0].clientY,
				touchEndX = e.originalEvent.changedTouches[0].clientX,
				yDiff = touchStartY - touchEndY,
				xDiff = touchStartX - touchEndX;

			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
		        if ( xDiff > 5 ) {
		        	if(index >= hwsliderSize){
						index = 1;
					}else{
						index += 1;
					}
		            moveTo(index,'next');
		        } else {
		        	if(index == 1){
						index = hwsliderSize;
					}else{
						index -= 1;
					}
		            moveTo(index,'prev');
		        }                       
		    }
			touchStartY = null;
			touchStartX = null;
		},

		//触控移动
		'touchmove': function(e) {
			if(e.preventDefault) { e.preventDefault(); }

		}
	});

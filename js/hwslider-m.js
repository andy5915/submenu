$(function(){
	var slider = $("#hwslider");
	var dots = $("#dots span"),
		prev = $("#prev"),next = $("#next");
	var sliderInder = slider.children('ul')
	var hwsliderLi = sliderInder.children('li');
	var hwsliderSize = hwsliderLi.length;  //滑块的总个数
	var sliderWidth = 600; //
	var sliderHeight = 320;
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
	
	//滑动移动
	var moveTo = function(index,dir){ 
		if(clickable){
			clickable = false;

			//位移距离
			var offset = slider.width();
			if(dir == 'prev'){
				offset = -1*offset;
			}

			//当前滑块动画
			sliderInder.children('.active').stop().animate({
				left: -offset},
				speed,
				 function() {
				 	$(this).removeClass('active');
			});
			//下一个滑块动画
			hwsliderLi.eq(index-1).css('left', offset + 'px').addClass('active').stop().animate({
				left: 0}, 
				speed,
				function(){
					clickable = true;
			});

			//显示可切换的圆点
			if(dotShow){
				dots.removeClass('active');
				dots.eq(index-1).addClass('active');
			}
		}else{
			return false;
		}
	}

	next.on('click', function(event) {
		event.preventDefault();
		if(clickable){
			if(index >= hwsliderSize){
				index = 1;
			}else{
				index += 1;
			}
			moveTo(index,'next');
		}
	});

	prev.on('click', function(event) {
		event.preventDefault();
		if(clickable){
			if(index == 1){
				index = hwsliderSize;
			}else{
				index -= 1;
			}

			moveTo(index,'prev');
		}
		
	});


	dots.on('click',  function(event) {
		event.preventDefault();
		
		if(clickable){
			var dotIndex = $(this).data('index');
			if(dotIndex > index){
				dir = 'next';
			}else{
				dir = 'prev';
			}
			if(dotIndex != index){
				index = dotIndex;
				moveTo(index, dir);
			}
		}
	});

	//自动滑动
	if(autoPlay){
		var timer;
		var play = function(){
			index++;
			if(index > hwsliderSize){
				index = 1;
			}
			moveTo(index, 'next');
		}
		timer = setInterval(play, interval); //设置定时器

		//鼠标滑上时暂停
		slider.hover(function() {
			timer = clearInterval(timer);
		}, function() {
			timer = setInterval(play, interval);
		});
	};

	//检测ie
	function detectIE() {
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		var version = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));

		return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) ? true : false;
	}

	var ie = detectIE();
	var mouseDown = false,
		mouseMove = false,
		mouseStart = 0,
		mouseX = 0,
		touchStartY = 0,
		touchStartX = 0;

	
	 
	hwsliderLi.on('mousedown',  function(e) {
		event.preventDefault();
		mouseDown = true;
		//mouseMove = true;
		if (ie) {
			mouseStart = event.clientX + document.body.scrollLeft;
		} else {
			mouseStart = e.pageX;
		}

		$(this).mousemove(function(e) {
			if (!mouseDown) return;
			mouseMove = true;
			if (ie) {
				mouseX = event.clientX + document.body.scrollLeft;
			} else {
				mouseX = e.pageX;
			}

		}).mouseup(function(e) {
			mouseDown = false;
			if (!mouseMove) return;
			mouseMove = false;

			var limit = 20;
			if (mouseStart > mouseX+limit) {
				if(clickable){
					if(index >= hwsliderSize){
						index = 1;
					}else{
						index++;
					}
					moveTo(index,'next');
				}
			} else if (mouseStart < mouseX+limit) {
				if(clickable){
					if(index == 1){
						index = hwsliderSize;
					}else{
						index--;
					}
					moveTo(index,'prev');
				}
			}
		});
	});
	

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
});
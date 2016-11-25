define([], function(){
    var _isShow = false;
    var $tag, $aboutme, $friends;

    var ctn,radio,scaleW,idx,basicwrap;

    //第一步 -- 初始化
    var reset = function() {
        //设定窗口比率
        radio = document.body.scrollHeight/document.body.scrollWidth;
        //设定一页的宽度
        scaleW = document.body.scrollWidth;
        //设定初始的索引值
        idx = 0;
    };
    //第一步 -- 组合
    var combine = function(){
        if($tag){
            document.getElementById("js-mobile-tagcloud").innerHTML = $tag.innerHTML;
        }
        if($aboutme){
            document.getElementById("js-mobile-aboutme").innerHTML = $aboutme.innerHTML;
        }
        if($friends){
            document.getElementById("js-mobile-friends").innerHTML = $friends.innerHTML;
        }
    }
    //第三步 -- 根据数据渲染DOM
    var renderDOM = function(){
        //生成节点
        var $viewer = document.createElement("div");
        $viewer.id = "viewer";
        $viewer.className = "hide";
        $tag = document.getElementById("js-tagcloud");
        $aboutme = document.getElementById("js-aboutme");
        $friends = document.getElementById("js-friends");
        function menuList(name) {
            return $("link.menu-list").attr(name);
        };
        var tagStr = $tag?'<span class="viewer-title">'+ menuList("tags") + '</span><div class="viewer-div tagcloud" id="js-mobile-tagcloud"></div>':"";
        var friendsStr = $friends?'<span class="viewer-title">'+ menuList("friends") + '</span><div class="viewer-div friends" id="js-mobile-friends"></div>':"";
        var aboutmeStr = $aboutme?'<span class="viewer-title">'+ menuList("about") + '</span><div class="viewer-div aboutme" id="js-mobile-aboutme"></div>':"";
		var searchStr = '<form id="search-form_mobile"  class="search_mobile"><input type="text" id="st-search-input_mobile" name="q" results="0" class="st-default-search-input_mobile" maxlength="50" placeholder="Search..." autocomplete="off" autocorrect="off"><i class="fa fa-times" onclick="resetSearch_mobile()"></i><p id="search_hint" class="search-hint">向右拖动结果至绿色打开链接~</p><div id="local-search-result_mobile"></div><p class="no-result">No results found <i class="fa fa-spinner fa-pulse"></i></p><p class="loading-xml">Loading XML File... <i class="fa fa-spinner fa-pulse"></i></p></form>'

        $viewer.innerHTML = '<div id="viewer-box">\
        <div class="viewer-box-l">\
            <div class="viewer-box-wrap">'+searchStr+aboutmeStr+friendsStr+tagStr+'</div>\
        </div>\
        <div class="viewer-box-r"></div>\
        </div>';

        //主要图片节点
        document.getElementsByTagName("body")[0].appendChild($viewer);
        var wrap = document.getElementById("viewer-box");
        basicwrap = wrap;
        wrap.style.height = document.body.scrollHeight + 'px';
    };

    var show = function(target, idx){
        document.getElementById("viewer").className = "";
        setTimeout(function(){
            basicwrap.className = "anm-swipe";
        },0);
        _isShow = true;
        document.ontouchstart=function(e){
            if(e.target.tagName != "A"){
                return false;
            }
        }
    }

    var hide = function(){
        document.getElementById("viewer-box").className = "";
        _isShow = false;
        document.ontouchstart=function(){
            return true;
        }
		resetSearch_mobile();
    }

    //第四步 -- 绑定 DOM 事件
    var bindDOM = function(){
        var scaleW = scaleW;
        
        //滑动隐藏
        document.getElementById("viewer-box").addEventListener("webkitTransitionEnd", function(){

            if(_isShow == false){
                document.getElementById("viewer").className = "hide";
                _isShow = true;
            }else{
            }
            
        }, false);

        //点击展示和隐藏
        ctn.addEventListener("touchend", function(){
            show();
        }, false);

        var $right = document.getElementsByClassName("viewer-box-r")[0];
        var touchStartTime;
        var touchEndTime;
        $right.addEventListener("touchstart", function(){
            touchStartTime = + new Date();
        }, false);
        $right.addEventListener("touchend", function(){
            touchEndTime = + new Date();
            if(touchEndTime - touchStartTime < 300){
                hide();
            }
            touchStartTime = 0;
            touchEndTime = 0;
        }, false);

        $(".slider-trigger").click(function(){
            show();
        })
        $(".viewer-box-r").click(function(){
            hide();
        })

        //滚动样式
        var $overlay = $("#mobile-nav .overlay");
        var $header = $(".js-mobile-header");
        window.onscroll = function(){
            var scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
            if(scrollTop >= 69){
                $overlay.addClass("fixed");
            }else{
                $overlay.removeClass("fixed");
            }
            if(scrollTop >= 160){
                $header.removeClass("hide").addClass("fixed");
            }else{
                $header.addClass("hide").removeClass("fixed");
            }
        };
        $header[0].addEventListener("touchstart", function(){
            $('html, body').animate({scrollTop:0}, 'slow');
        }, false);
    };
	
	if (yiliaConfig.search) {
        var search = function(){
            require([yiliaConfig.rootUrl + 'js/search.js'], function(){
                var inputArea = document.querySelector("#st-search-input_mobile");
                var $HideWhenSearch = $(".viewer-title, #js-mobile-aboutme, #js-mobile-friends, #js-mobile-tagcloud");
				var resetButton = document.querySelector("#search-form_mobile .fa-times");
                var $resetButton = $("#search-form_mobile .fa-times");
                var $resultArea = $("#local-search-result_mobile");
				$resetButton.hide();
				$("#search_hint").hide();
				
				// 解决搜索结果区无法滚动、点击穿透等问题
				// 直接监听触摸事件手动处理滚动及点击事件
				var ScrollArea = document.querySelector('.viewer-box-l');
				var TouceArea = document.querySelector("#local-search-result_mobile");
				var WholeView = document.querySelector("#viewer");
				
				var scrollStart = 0;
				var moveStart = 0;
				var TouchedItem;
				var TouchedOpen = false;
				
				TouceArea.onscroll = function(e) {
					e.preventDefault();
				}
				
				TouceArea.ontouchstart = function(e) {
					e.preventDefault();
					
					// 记录起始点坐标
					var MarginOffset = parseInt(ScrollArea.style.marginTop.replace("px", ""));
					if (isNaN(MarginOffset)) {
						MarginOffset =  0;
					}
					var currentY = e.touches[0].pageY;
					scrollStart = currentY - MarginOffset;
					moveStart = e.touches[0].pageX;
					
					// 找出点击了哪个选项
					var i;
					if (TouceArea.children.length > 0) {
						var liArea;
						var i;
						TouchedItem = null;
						TouchedOpen = false;
						for (i = 0; i < TouceArea.children[0].childNodes.length; i++) {
							liArea = TouceArea.children[0].childNodes[i];
							if (liArea.offsetTop > currentY) {
								TouchedItem = TouceArea.children[0].childNodes[i - 1];
								break;
							}
						}
						// Deal Last One
						if (!TouchedItem) {
							if (liArea.offsetTop + liArea.clientHeight > currentY) {
								TouchedItem = TouceArea.children[0].childNodes[TouceArea.children[0].childNodes.length - 1];
							}
						}
					}

				}
				
				TouceArea.ontouchmove = function(e) {
					e.preventDefault();
					
					// 记录当前坐标
					var Offset = e.touches[0].pageY - scrollStart;
					var OffsetX = e.touches[0].pageX - moveStart - 25;  // 减去一个值，避免微小移动也触发事件，影响体验

					// 实现垂直滚动
					if (TouceArea.clientHeight + Offset < WholeView.clientHeight * 0.7) {
						Offset = WholeView.clientHeight * 0.7 - TouceArea.clientHeight;
					}
					if (Offset > 0)
						Offset = 0;
					ScrollArea.style.marginTop = Offset + "px";
					
					// 实现水平滑动
					if (TouchedItem && OffsetX > 0) {
						TouchedItem.style.marginLeft = OffsetX + "px";
						if (OffsetX > TouchedItem.clientWidth / 2) {
							TouchedItem.style.backgroundColor = "rgba(13,118,13,0.60)";
							TouchedOpen = true;
						} else {
							TouchedItem.style.backgroundColor = "";
							TouchedOpen = false;
						}
					}
				}
				
				TouceArea.ontouchend = function(e) {
					e.preventDefault();
					
					// 处理拖动打开链接事件
					if (TouchedItem) {
						TouchedItem.style.marginLeft = "0px";
						TouchedItem.style.backgroundColor = "";
						if (TouchedOpen) {
							hide(); // 隐藏搜索框
							// 待搜索框完全隐藏后再打开新链接，视觉效果更好点
							window.setTimeout('window.location.href=' + '"' + TouchedItem.children[0].href + '"', 200);
						}						
					}

					
				}
				
				// 处理移动端搜索框无法点击的问题
				inputArea.addEventListener("touchstart", function(){
					inputArea.focus();
				}, false);

				resetButton.addEventListener("touchstart", function(){
					$resetButton.click();
				}, false);

                var getSearchFile = function(){
                    var search_path = "search.xml";
                    var path = yiliaConfig.rootUrl + search_path;
					$(".loading-xml").show(200);
                    searchFunc(path, 'st-search-input_mobile', 'local-search-result_mobile', true);
                }

                var getFileOnload = inputArea.getAttribute('searchonload');
                if (yiliaConfig.search && getFileOnload === "true") {
                    getSearchFile();
                } else {
                    inputArea.onfocus = function(){ 
					getSearchFile();
					}
                }


                var HideTocArea = function(){
                    $HideWhenSearch.css("visibility","hidden");
                    $resetButton.show();
					$("#search_hint").show();
                }
                inputArea.oninput = function(){ HideTocArea() }
                inputArea.onkeydown = function(){ if(event.keyCode==13) return false}
				inputArea.addEventListener('input', function(){
					if (this.value == "") {
						resetSearch_mobile();
					}
				});

                resetSearch_mobile = function(){
                    $HideWhenSearch.css("visibility","initial");
                    $resultArea.html("");
                    document.querySelector("#search-form_mobile").reset();
                    $resetButton.hide();
					$("#search_hint").hide();
                    $(".no-result").hide();
					$('.viewer-box-l').css("marginTop", "0px");
                }

                $resultArea.bind("DOMNodeRemoved DOMNodeInserted", function(e) {
                    if (!$(e.target).text()) {
                        $(".no-result").show(200);
                    } else {
                      $(".no-result").hide();
                    }
                })
            })
        }()
    }

    return{
        init: function(){
            //构造函数需要的参数
            ctn = document.getElementsByClassName("slider-trigger")[0];
            //构造四步
            reset();
            renderDOM();
            combine();
            bindDOM();
            resetTags();
        }
    }
})
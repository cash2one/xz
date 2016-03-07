"function"!=typeof Object.create&&(Object.create=function(t){function e(){}return e.prototype=t,new e}),function($,t,e){var o={init:function(t,e){var o=this;o.$elem=$(e),o.options=$.extend({},$.fn.owlCarousel.options,o.$elem.data(),t),o.userOptions=t,o.loadContent()},loadContent:function(){function t(t){var o,i="";if("function"==typeof e.options.jsonSuccess)e.options.jsonSuccess.apply(this,[t]);else{for(o in t.owl)t.owl.hasOwnProperty(o)&&(i+=t.owl[o].item);e.$elem.html(i)}e.logIn()}var e=this,o;"function"==typeof e.options.beforeInit&&e.options.beforeInit.apply(this,[e.$elem]),"string"==typeof e.options.jsonPath?(o=e.options.jsonPath,$.getJSON(o,t)):e.logIn()},logIn:function(){var t=this;t.$elem.data("owl-originalStyles",t.$elem.attr("style")),t.$elem.data("owl-originalClasses",t.$elem.attr("class")),t.$elem.css({opacity:0}),t.orignalItems=t.options.items,t.checkBrowser(),t.wrapperWidth=0,t.checkVisible=null,t.setVars()},setVars:function(){var t=this;return 0===t.$elem.children().length?!1:(t.baseClass(),t.eventTypes(),t.$userItems=t.$elem.children(),t.itemsAmount=t.$userItems.length,t.wrapItems(),t.$owlItems=t.$elem.find(".owl-item"),t.$owlWrapper=t.$elem.find(".owl-wrapper"),t.playDirection="next",t.prevItem=0,t.prevArr=[0],t.currentItem=0,t.customEvents(),void t.onStartup())},onStartup:function(){var t=this;t.updateItems(),t.calculateAll(),t.buildControls(),t.updateControls(),t.response(),t.moveEvents(),t.stopOnHover(),t.owlStatus(),t.options.transitionStyle!==!1&&t.transitionTypes(t.options.transitionStyle),t.options.autoPlay===!0&&(t.options.autoPlay=5e3),t.play(),t.$elem.find(".owl-wrapper").css("display","block"),t.$elem.is(":visible")?t.$elem.css("opacity",1):t.watchVisibility(),t.onstartup=!1,t.eachMoveUpdate(),"function"==typeof t.options.afterInit&&t.options.afterInit.apply(this,[t.$elem])},eachMoveUpdate:function(){var t=this;t.options.lazyLoad===!0&&t.lazyLoad(),t.options.autoHeight===!0&&t.autoHeight(),t.onVisibleItems(),"function"==typeof t.options.afterAction&&t.options.afterAction.apply(this,[t.$elem])},updateVars:function(){var t=this;"function"==typeof t.options.beforeUpdate&&t.options.beforeUpdate.apply(this,[t.$elem]),t.watchVisibility(),t.updateItems(),t.calculateAll(),t.updatePosition(),t.updateControls(),t.eachMoveUpdate(),"function"==typeof t.options.afterUpdate&&t.options.afterUpdate.apply(this,[t.$elem])},reload:function(){var e=this;t.setTimeout(function(){e.updateVars()},0)},watchVisibility:function(){var e=this;return e.$elem.is(":visible")!==!1?!1:(e.$elem.css({opacity:0}),t.clearInterval(e.autoPlayInterval),t.clearInterval(e.checkVisible),void(e.checkVisible=t.setInterval(function(){e.$elem.is(":visible")&&(e.reload(),e.$elem.animate({opacity:1},200),t.clearInterval(e.checkVisible))},500)))},wrapItems:function(){var t=this;t.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>'),t.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">'),t.wrapperOuter=t.$elem.find(".owl-wrapper-outer"),t.$elem.css("display","block")},baseClass:function(){var t=this,e=t.$elem.hasClass(t.options.baseClass),o=t.$elem.hasClass(t.options.theme);e||t.$elem.addClass(t.options.baseClass),o||t.$elem.addClass(t.options.theme)},updateItems:function(){var t=this,e,o;if(t.options.responsive===!1)return!1;if(t.options.singleItem===!0)return t.options.items=t.orignalItems=1,t.options.itemsCustom=!1,t.options.itemsDesktop=!1,t.options.itemsDesktopSmall=!1,t.options.itemsTablet=!1,t.options.itemsTabletSmall=!1,t.options.itemsMobile=!1,!1;if(e=$(t.options.responsiveBaseWidth).width(),e>(t.options.itemsDesktop[0]||t.orignalItems)&&(t.options.items=t.orignalItems),t.options.itemsCustom!==!1)for(t.options.itemsCustom.sort(function(t,e){return t[0]-e[0]}),o=0;o<t.options.itemsCustom.length;o+=1)t.options.itemsCustom[o][0]<=e&&(t.options.items=t.options.itemsCustom[o][1]);else e<=t.options.itemsDesktop[0]&&t.options.itemsDesktop!==!1&&(t.options.items=t.options.itemsDesktop[1]),e<=t.options.itemsDesktopSmall[0]&&t.options.itemsDesktopSmall!==!1&&(t.options.items=t.options.itemsDesktopSmall[1]),e<=t.options.itemsTablet[0]&&t.options.itemsTablet!==!1&&(t.options.items=t.options.itemsTablet[1]),e<=t.options.itemsTabletSmall[0]&&t.options.itemsTabletSmall!==!1&&(t.options.items=t.options.itemsTabletSmall[1]),e<=t.options.itemsMobile[0]&&t.options.itemsMobile!==!1&&(t.options.items=t.options.itemsMobile[1]);t.options.items>t.itemsAmount&&t.options.itemsScaleUp===!0&&(t.options.items=t.itemsAmount)},response:function(){var e=this,o,i;return e.options.responsive!==!0?!1:(i=$(t).width(),e.resizer=function(){$(t).width()!==i&&(e.options.autoPlay!==!1&&t.clearInterval(e.autoPlayInterval),t.clearTimeout(o),o=t.setTimeout(function(){i=$(t).width(),e.updateVars()},e.options.responsiveRefreshRate))},void $(t).resize(e.resizer))},updatePosition:function(){var t=this;t.jumpTo(t.currentItem),t.options.autoPlay!==!1&&t.checkAp()},appendItemsSizes:function(){var t=this,e=0,o=t.itemsAmount-t.options.items;t.$owlItems.each(function(i){var n=$(this);n.css({width:t.itemWidth}).data("owl-item",Number(i)),(i%t.options.items===0||i===o)&&(i>o||(e+=1)),n.data("owl-roundPages",e)})},appendWrapperSizes:function(){var t=this,e=t.$owlItems.length*t.itemWidth;t.$owlWrapper.css({width:2*e,left:0}),t.appendItemsSizes()},calculateAll:function(){var t=this;t.calculateWidth(),t.appendWrapperSizes(),t.loops(),t.max()},calculateWidth:function(){var t=this;t.itemWidth=Math.round(t.$elem.width()/t.options.items)},max:function(){var t=this,e=-1*(t.itemsAmount*t.itemWidth-t.options.items*t.itemWidth);return t.options.items>t.itemsAmount?(t.maximumItem=0,e=0,t.maximumPixels=0):(t.maximumItem=t.itemsAmount-t.options.items,t.maximumPixels=e),e},min:function(){return 0},loops:function(){var t=this,e=0,o=0,i,n,s;for(t.positionsInArray=[0],t.pagesInArray=[],i=0;i<t.itemsAmount;i+=1)o+=t.itemWidth,t.positionsInArray.push(-o),t.options.scrollPerPage===!0&&(n=$(t.$owlItems[i]),s=n.data("owl-roundPages"),s!==e&&(t.pagesInArray[e]=t.positionsInArray[i],e=s))},buildControls:function(){var t=this;(t.options.navigation===!0||t.options.pagination===!0)&&(t.owlControls=$('<div class="owl-controls"/>').toggleClass("clickable",!t.browser.isTouch).appendTo(t.$elem)),t.options.pagination===!0&&t.buildPagination(),t.options.navigation===!0&&t.buildButtons()},buildButtons:function(){var t=this,e=$('<div class="owl-buttons"/>');t.owlControls.append(e),t.buttonPrev=$("<div/>",{"class":"owl-prev",html:t.options.navigationText[0]||""}),t.buttonNext=$("<div/>",{"class":"owl-next",html:t.options.navigationText[1]||""}),e.append(t.buttonPrev).append(t.buttonNext),e.on("touchstart.owlControls mousedown.owlControls",'div[class^="owl"]',function(t){t.preventDefault()}),e.on("touchend.owlControls mouseup.owlControls",'div[class^="owl"]',function(e){e.preventDefault(),$(this).hasClass("owl-next")?t.next():t.prev()})},buildPagination:function(){var t=this;t.paginationWrapper=$('<div class="owl-pagination"/>'),t.owlControls.append(t.paginationWrapper),t.paginationWrapper.on("touchend.owlControls mouseup.owlControls",".owl-page",function(e){e.preventDefault(),Number($(this).data("owl-page"))!==t.currentItem&&t.goTo(Number($(this).data("owl-page")),!0)})},updatePagination:function(){var t=this,e,o,i,n,s,a;if(t.options.pagination===!1)return!1;for(t.paginationWrapper.html(""),e=0,o=t.itemsAmount-t.itemsAmount%t.options.items,n=0;n<t.itemsAmount;n+=1)n%t.options.items===0&&(e+=1,o===n&&(i=t.itemsAmount-t.options.items),s=$("<div/>",{"class":"owl-page"}),a=$("<span></span>",{text:t.options.paginationNumbers===!0?e:"","class":t.options.paginationNumbers===!0?"owl-numbers":""}),s.append(a),s.data("owl-page",o===n?i:n),s.data("owl-roundPages",e),t.paginationWrapper.append(s));t.checkPagination()},checkPagination:function(){var t=this;return t.options.pagination===!1?!1:void t.paginationWrapper.find(".owl-page").each(function(){$(this).data("owl-roundPages")===$(t.$owlItems[t.currentItem]).data("owl-roundPages")&&(t.paginationWrapper.find(".owl-page").removeClass("active"),$(this).addClass("active"))})},checkNavigation:function(){var t=this;return t.options.navigation===!1?!1:void(t.options.rewindNav===!1&&(0===t.currentItem&&0===t.maximumItem?(t.buttonPrev.addClass("disabled"),t.buttonNext.addClass("disabled")):0===t.currentItem&&0!==t.maximumItem?(t.buttonPrev.addClass("disabled"),t.buttonNext.removeClass("disabled")):t.currentItem===t.maximumItem?(t.buttonPrev.removeClass("disabled"),t.buttonNext.addClass("disabled")):0!==t.currentItem&&t.currentItem!==t.maximumItem&&(t.buttonPrev.removeClass("disabled"),t.buttonNext.removeClass("disabled"))))},updateControls:function(){var t=this;t.updatePagination(),t.checkNavigation(),t.owlControls&&(t.options.items>=t.itemsAmount?t.owlControls.hide():t.owlControls.show())},destroyControls:function(){var t=this;t.owlControls&&t.owlControls.remove()},next:function(t){var e=this;if(e.isTransition)return!1;if(e.currentItem+=e.options.scrollPerPage===!0?e.options.items:1,e.currentItem>e.maximumItem+(e.options.scrollPerPage===!0?e.options.items-1:0)){if(e.options.rewindNav!==!0)return e.currentItem=e.maximumItem,!1;e.currentItem=0,t="rewind"}e.goTo(e.currentItem,t)},prev:function(t){var e=this;if(e.isTransition)return!1;if(e.options.scrollPerPage===!0&&e.currentItem>0&&e.currentItem<e.options.items?e.currentItem=0:e.currentItem-=e.options.scrollPerPage===!0?e.options.items:1,e.currentItem<0){if(e.options.rewindNav!==!0)return e.currentItem=0,!1;e.currentItem=e.maximumItem,t="rewind"}e.goTo(e.currentItem,t)},goTo:function(e,o,i){var n=this,s;return n.isTransition?!1:("function"==typeof n.options.beforeMove&&n.options.beforeMove.apply(this,[n.$elem]),e>=n.maximumItem?e=n.maximumItem:0>=e&&(e=0),n.currentItem=n.owl.currentItem=e,n.options.transitionStyle!==!1&&"drag"!==i&&1===n.options.items&&n.browser.support3d===!0?(n.swapSpeed(0),n.browser.support3d===!0?n.transition3d(n.positionsInArray[e]):n.css2slide(n.positionsInArray[e],1),n.afterGo(),n.singleItemTransition(),!1):(s=n.positionsInArray[e],n.browser.support3d===!0?(n.isCss3Finish=!1,o===!0?(n.swapSpeed("paginationSpeed"),t.setTimeout(function(){n.isCss3Finish=!0},n.options.paginationSpeed)):"rewind"===o?(n.swapSpeed(n.options.rewindSpeed),t.setTimeout(function(){n.isCss3Finish=!0},n.options.rewindSpeed)):(n.swapSpeed("slideSpeed"),t.setTimeout(function(){n.isCss3Finish=!0},n.options.slideSpeed)),n.transition3d(s)):o===!0?n.css2slide(s,n.options.paginationSpeed):"rewind"===o?n.css2slide(s,n.options.rewindSpeed):n.css2slide(s,n.options.slideSpeed),void n.afterGo()))},jumpTo:function(t){var e=this;"function"==typeof e.options.beforeMove&&e.options.beforeMove.apply(this,[e.$elem]),t>=e.maximumItem||-1===t?t=e.maximumItem:0>=t&&(t=0),e.swapSpeed(0),e.browser.support3d===!0?e.transition3d(e.positionsInArray[t]):e.css2slide(e.positionsInArray[t],1),e.currentItem=e.owl.currentItem=t,e.afterGo()},afterGo:function(){var t=this;t.prevArr.push(t.currentItem),t.prevItem=t.owl.prevItem=t.prevArr[t.prevArr.length-2],t.prevArr.shift(0),t.prevItem!==t.currentItem&&(t.checkPagination(),t.checkNavigation(),t.eachMoveUpdate(),t.options.autoPlay!==!1&&t.checkAp()),"function"==typeof t.options.afterMove&&t.prevItem!==t.currentItem&&t.options.afterMove.apply(this,[t.$elem])},stop:function(){var e=this;e.apStatus="stop",t.clearInterval(e.autoPlayInterval)},checkAp:function(){var t=this;"stop"!==t.apStatus&&t.play()},play:function(){var e=this;return e.apStatus="play",e.options.autoPlay===!1?!1:(t.clearInterval(e.autoPlayInterval),void(e.autoPlayInterval=t.setInterval(function(){e.next(!0)},e.options.autoPlay)))},swapSpeed:function(t){var e=this;"slideSpeed"===t?e.$owlWrapper.css(e.addCssSpeed(e.options.slideSpeed)):"paginationSpeed"===t?e.$owlWrapper.css(e.addCssSpeed(e.options.paginationSpeed)):"string"!=typeof t&&e.$owlWrapper.css(e.addCssSpeed(t))},addCssSpeed:function(t){return{"-webkit-transition":"all "+t+"ms ease","-moz-transition":"all "+t+"ms ease","-o-transition":"all "+t+"ms ease",transition:"all "+t+"ms ease"}},removeTransition:function(){return{"-webkit-transition":"","-moz-transition":"","-o-transition":"",transition:""}},doTranslate:function(t){return{"-webkit-transform":"translate3d("+t+"px, 0px, 0px)","-moz-transform":"translate3d("+t+"px, 0px, 0px)","-o-transform":"translate3d("+t+"px, 0px, 0px)","-ms-transform":"translate3d("+t+"px, 0px, 0px)",transform:"translate3d("+t+"px, 0px,0px)"}},transition3d:function(t){var e=this;e.$owlWrapper.css(e.doTranslate(t))},css2move:function(t){var e=this;e.$owlWrapper.css({left:t})},css2slide:function(t,e){var o=this;o.isCssFinish=!1,o.$owlWrapper.stop(!0,!0).animate({left:t},{duration:e||o.options.slideSpeed,complete:function(){o.isCssFinish=!0}})},checkBrowser:function(){var o=this,i="translate3d(0px, 0px, 0px)",n=e.createElement("div"),s,a,r,l;n.style.cssText="  -moz-transform:"+i+"; -ms-transform:"+i+"; -o-transform:"+i+"; -webkit-transform:"+i+"; transform:"+i,s=/translate3d\(0px, 0px, 0px\)/g,a=n.style.cssText.match(s),r=null!==a&&1===a.length,l="ontouchstart"in t||t.navigator.msMaxTouchPoints,o.browser={support3d:r,isTouch:l}},moveEvents:function(){var t=this;(t.options.mouseDrag!==!1||t.options.touchDrag!==!1)&&(t.gestures(),t.disabledEvents())},eventTypes:function(){var t=this,e=["s","e","x"];t.ev_types={},t.options.mouseDrag===!0&&t.options.touchDrag===!0?e=["touchstart.owl mousedown.owl","touchmove.owl mousemove.owl","touchend.owl touchcancel.owl mouseup.owl"]:t.options.mouseDrag===!1&&t.options.touchDrag===!0?e=["touchstart.owl","touchmove.owl","touchend.owl touchcancel.owl"]:t.options.mouseDrag===!0&&t.options.touchDrag===!1&&(e=["mousedown.owl","mousemove.owl","mouseup.owl"]),t.ev_types.start=e[0],t.ev_types.move=e[1],t.ev_types.end=e[2]},disabledEvents:function(){var t=this;t.$elem.on("dragstart.owl",function(t){t.preventDefault()}),t.$elem.on("mousedown.disableTextSelect",function(t){return $(t.target).is("input, textarea, select, option")})},gestures:function(){function o(t){if(void 0!==t.touches)return{x:t.touches[0].pageX,y:t.touches[0].pageY};if(void 0===t.touches){if(void 0!==t.pageX)return{x:t.pageX,y:t.pageY};if(void 0===t.pageX)return{x:t.clientX,y:t.clientY}}}function i(t){"on"===t?($(e).on(r.ev_types.move,s),$(e).on(r.ev_types.end,a)):"off"===t&&($(e).off(r.ev_types.move),$(e).off(r.ev_types.end))}function n(e){var n=e.originalEvent||e||t.event,s;if(3===n.which)return!1;if(!(r.itemsAmount<=r.options.items)){if(r.isCssFinish===!1&&!r.options.dragBeforeAnimFinish)return!1;if(r.isCss3Finish===!1&&!r.options.dragBeforeAnimFinish)return!1;r.options.autoPlay!==!1&&t.clearInterval(r.autoPlayInterval),r.browser.isTouch===!0||r.$owlWrapper.hasClass("grabbing")||r.$owlWrapper.addClass("grabbing"),r.newPosX=0,r.newRelativeX=0,$(this).css(r.removeTransition()),s=$(this).position(),l.relativePos=s.left,l.offsetX=o(n).x-s.left,l.offsetY=o(n).y-s.top,i("on"),l.sliding=!1,l.targetElement=n.target||n.srcElement}}function s(i){var n=i.originalEvent||i||t.event,s,a;r.newPosX=o(n).x-l.offsetX,r.newPosY=o(n).y-l.offsetY,r.newRelativeX=r.newPosX-l.relativePos,"function"==typeof r.options.startDragging&&l.dragging!==!0&&0!==r.newRelativeX&&(l.dragging=!0,r.options.startDragging.apply(r,[r.$elem])),(r.newRelativeX>8||r.newRelativeX<-8)&&r.browser.isTouch===!0&&(void 0!==n.preventDefault?n.preventDefault():n.returnValue=!1,l.sliding=!0),(r.newPosY>10||r.newPosY<-10)&&l.sliding===!1&&$(e).off("touchmove.owl"),s=function(){return r.newRelativeX/5},a=function(){return r.maximumPixels+r.newRelativeX/5},r.newPosX=Math.max(Math.min(r.newPosX,s()),a()),r.browser.support3d===!0?r.transition3d(r.newPosX):r.css2move(r.newPosX)}function a(e){var o=e.originalEvent||e||t.event,n,s,a;o.target=o.target||o.srcElement,l.dragging=!1,r.browser.isTouch!==!0&&r.$owlWrapper.removeClass("grabbing"),r.newRelativeX<0?r.dragDirection=r.owl.dragDirection="left":r.dragDirection=r.owl.dragDirection="right",0!==r.newRelativeX&&(n=r.getNewPosition(),r.goTo(n,!1,"drag"),l.targetElement===o.target&&r.browser.isTouch!==!0&&($(o.target).on("click.disable",function(t){t.stopImmediatePropagation(),t.stopPropagation(),t.preventDefault(),$(t.target).off("click.disable")}),s=$._data(o.target,"events").click,a=s.pop(),s.splice(0,0,a))),i("off")}var r=this,l={offsetX:0,offsetY:0,baseElWidth:0,relativePos:0,position:null,minSwipe:null,maxSwipe:null,sliding:null,dargging:null,targetElement:null};r.isCssFinish=!0,r.$elem.on(r.ev_types.start,".owl-wrapper",n)},getNewPosition:function(){var t=this,e=t.closestItem();return e>t.maximumItem?(t.currentItem=t.maximumItem,e=t.maximumItem):t.newPosX>=0&&(e=0,t.currentItem=0),e},closestItem:function(){var t=this,e=t.options.scrollPerPage===!0?t.pagesInArray:t.positionsInArray,o=t.newPosX,i=null;return $.each(e,function(n,s){o-t.itemWidth/20>e[n+1]&&o-t.itemWidth/20<s&&"left"===t.moveDirection()?(i=s,t.options.scrollPerPage===!0?t.currentItem=$.inArray(i,t.positionsInArray):t.currentItem=n):o+t.itemWidth/20<s&&o+t.itemWidth/20>(e[n+1]||e[n]-t.itemWidth)&&"right"===t.moveDirection()&&(t.options.scrollPerPage===!0?(i=e[n+1]||e[e.length-1],t.currentItem=$.inArray(i,t.positionsInArray)):(i=e[n+1],t.currentItem=n+1))}),t.currentItem},moveDirection:function(){var t=this,e;return t.newRelativeX<0?(e="right",t.playDirection="next"):(e="left",t.playDirection="prev"),e},customEvents:function(){var t=this;t.$elem.on("owl.next",function(){t.next()}),t.$elem.on("owl.prev",function(){t.prev()}),t.$elem.on("owl.play",function(e,o){t.options.autoPlay=o,t.play(),t.hoverStatus="play"}),t.$elem.on("owl.stop",function(){t.stop(),t.hoverStatus="stop"}),t.$elem.on("owl.goTo",function(e,o){t.goTo(o)}),t.$elem.on("owl.jumpTo",function(e,o){t.jumpTo(o)})},stopOnHover:function(){var t=this;t.options.stopOnHover===!0&&t.browser.isTouch!==!0&&t.options.autoPlay!==!1&&(t.$elem.on("mouseover",function(){t.stop()}),t.$elem.on("mouseout",function(){"stop"!==t.hoverStatus&&t.play()}))},lazyLoad:function(){var t=this,e,o,i,n,s;if(t.options.lazyLoad===!1)return!1;for(e=0;e<t.itemsAmount;e+=1)o=$(t.$owlItems[e]),"loaded"!==o.data("owl-loaded")&&(i=o.data("owl-item"),n=o.find(".lazyOwl"),"string"==typeof n.data("src")?(void 0===o.data("owl-loaded")&&(n.hide(),o.addClass("loading").data("owl-loaded","checked")),s=t.options.lazyFollow===!0?i>=t.currentItem:!0,s&&i<t.currentItem+t.options.items&&n.length&&t.lazyPreload(o,n)):o.data("owl-loaded","loaded"))},lazyPreload:function(e,o){function i(){e.data("owl-loaded","loaded").removeClass("loading"),o.removeAttr("data-src"),"fade"===s.options.lazyEffect?o.fadeIn(400):o.show(),"function"==typeof s.options.afterLazyLoad&&s.options.afterLazyLoad.apply(this,[s.$elem])}function n(){a+=1,s.completeImg(o.get(0))||r===!0?i():100>=a?t.setTimeout(n,100):i()}var s=this,a=0,r;"DIV"===o.prop("tagName")?(o.css("background-image","url("+o.data("src")+")"),r=!0):o[0].src=o.data("src"),n()},autoHeight:function(){function e(){var e=$(i.$owlItems[i.currentItem]).height();i.wrapperOuter.css("height",e+"px"),i.wrapperOuter.hasClass("autoHeight")||t.setTimeout(function(){i.wrapperOuter.addClass("autoHeight")},0)}function o(){s+=1,i.completeImg(n.get(0))?e():100>=s?t.setTimeout(o,100):i.wrapperOuter.css("height","")}var i=this,n=$(i.$owlItems[i.currentItem]).find("img"),s;void 0!==n.get(0)?(s=0,o()):e()},completeImg:function(t){var e;return t.complete?(e=typeof t.naturalWidth,"undefined"!==e&&0===t.naturalWidth?!1:!0):!1},onVisibleItems:function(){var t=this,e;for(t.options.addClassActive===!0&&t.$owlItems.removeClass("active"),t.visibleItems=[],e=t.currentItem;e<t.currentItem+t.options.items;e+=1)t.visibleItems.push(e),t.options.addClassActive===!0&&$(t.$owlItems[e]).addClass("active");t.owl.visibleItems=t.visibleItems},transitionTypes:function(t){var e=this;e.outClass="owl-"+t+"-out",e.inClass="owl-"+t+"-in"},singleItemTransition:function(){function t(t){return{position:"relative",left:t+"px"}}var e=this,o=e.outClass,i=e.inClass,n=e.$owlItems.eq(e.currentItem),s=e.$owlItems.eq(e.prevItem),a=Math.abs(e.positionsInArray[e.currentItem])+e.positionsInArray[e.prevItem],r=Math.abs(e.positionsInArray[e.currentItem])+e.itemWidth/2,l="webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend";e.isTransition=!0,e.$owlWrapper.addClass("owl-origin").css({"-webkit-transform-origin":r+"px","-moz-perspective-origin":r+"px","perspective-origin":r+"px"}),s.css(t(a,10)).addClass(o).on(l,function(){e.endPrev=!0,s.off(l),e.clearTransStyle(s,o)}),n.addClass(i).on(l,function(){e.endCurrent=!0,n.off(l),e.clearTransStyle(n,i)})},clearTransStyle:function(t,e){var o=this;t.css({position:"",left:""}).removeClass(e),o.endPrev&&o.endCurrent&&(o.$owlWrapper.removeClass("owl-origin"),o.endPrev=!1,o.endCurrent=!1,o.isTransition=!1)},owlStatus:function(){var t=this;t.owl={userOptions:t.userOptions,baseElement:t.$elem,userItems:t.$userItems,owlItems:t.$owlItems,currentItem:t.currentItem,prevItem:t.prevItem,visibleItems:t.visibleItems,isTouch:t.browser.isTouch,browser:t.browser,dragDirection:t.dragDirection}},clearEvents:function(){var o=this;o.$elem.off(".owl owl mousedown.disableTextSelect"),$(e).off(".owl owl"),$(t).off("resize",o.resizer)},unWrap:function(){var t=this;0!==t.$elem.children().length&&(t.$owlWrapper.unwrap(),t.$userItems.unwrap().unwrap(),t.owlControls&&t.owlControls.remove()),t.clearEvents(),t.$elem.attr("style",t.$elem.data("owl-originalStyles")||"").attr("class",t.$elem.data("owl-originalClasses"))},destroy:function(){var e=this;e.stop(),t.clearInterval(e.checkVisible),e.unWrap(),e.$elem.removeData()},reinit:function(t){var e=this,o=$.extend({},e.userOptions,t);e.unWrap(),e.init(o,e.$elem)},addItem:function(t,e){var o=this,i;return t?0===o.$elem.children().length?(o.$elem.append(t),o.setVars(),!1):(o.unWrap(),i=void 0===e||-1===e?-1:e,i>=o.$userItems.length||-1===i?o.$userItems.eq(-1).after(t):o.$userItems.eq(i).before(t),void o.setVars()):!1},removeItem:function(t){var e=this,o;return 0===e.$elem.children().length?!1:(o=void 0===t||-1===t?-1:t,e.unWrap(),e.$userItems.eq(o).remove(),void e.setVars())}};$.fn.owlCarousel=function(t){return this.each(function(){if($(this).data("owl-init")===!0)return!1;$(this).data("owl-init",!0);var e=Object.create(o);e.init(t,this),$.data(this,"owlCarousel",e)})},$.fn.owlCarousel.options={items:5,itemsCustom:!1,itemsDesktop:[1199,4],itemsDesktopSmall:[979,3],itemsTablet:[768,2],itemsTabletSmall:!1,itemsMobile:[479,1],singleItem:!1,itemsScaleUp:!1,slideSpeed:200,paginationSpeed:800,rewindSpeed:1e3,autoPlay:!1,stopOnHover:!1,navigation:!1,navigationText:["prev","next"],rewindNav:!0,scrollPerPage:!1,pagination:!0,paginationNumbers:!1,responsive:!0,responsiveRefreshRate:200,responsiveBaseWidth:t,baseClass:"owl-carousel",theme:"owl-theme",lazyLoad:!1,lazyFollow:!0,lazyEffect:"fade",autoHeight:!1,jsonPath:!1,jsonSuccess:!1,dragBeforeAnimFinish:!0,mouseDrag:!0,touchDrag:!0,addClassActive:!1,transitionStyle:!1,beforeUpdate:!1,afterUpdate:!1,beforeInit:!1,afterInit:!1,beforeMove:!1,afterMove:!1,afterAction:!1,startDragging:!1,afterLazyLoad:!1}}(jQuery,window,document);
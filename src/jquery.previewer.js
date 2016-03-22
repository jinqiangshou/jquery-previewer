/**
 * jquery.previewer.js - v1.0.0 - 2016-03-17
 * https://github.com/jinqiangshou/jquery-previewer
 * Copyright (c) 2016 Horst Xu
 * Licensed MIT (http://www.opensource.org/licenses/mit-license.php)
 */

!(function($, window, undefined) {
	
	"use strict";
	
	var Helper = {
		
		//try to detect user's browser type with UserAgent
		browserType: (function(){
			
			var ua = navigator.userAgent.toLowerCase();
			var result = /msie/.test(ua) ? "ie" : 
					     /firefox/.test(ua) ? "firefox" : 
					     /opera/.test(ua) ? "opera" :
					     /chrome/.test(ua) ? "chrome" :
					     /safari/.test(ua) ? "safari" : "";
			return result;
		})(),
		
		//get window height and width
		getWindowSize: function(){
			
			var result = {};
			result.winWidth = window.innerWidth || 
						document.documentElement.clientWidth || 
						document.body.clientWidth || 
						1;
            result.winHeight = window.innerHeight || 
            			document.documentElement.clientHeight || 
            			document.body.clientHeight || 
            			1;
            return result;
		},
		
		//encode string to avoid xss attack
		stringEncode: (function(){
			
			var div = document.createElement("div");
			return function(str) {
				div.innerHTML = "";
				div.appendChild(document.createTextNode(str));
				return div.innerHTML;
			};
		})(),
		
		//append $child to $parent, then append $parent to event.target
		domAppend: function(event, $child, $parent) {
			
			var pos_x = event.clientX - 1;
			var pos_y = event.clientY - 1;
			
			var $div = $parent.css({
					"position": "fixed",
					"z-index": 99999,
					"left": pos_x,
					"top": pos_y,
				}).append($child);
			$(event.target).append($div);
		},
		
		//preload image
		imagePreload: function(src) {
			
			var img = new Image();
			img.src = src;
			img.onload = function(){
				//
			};
		},
		
		//apply css settings to $div
		applyCSS: function(css, $div){
			
			if(typeof css === "object") {
				$div.css(css);
			}
		},
		
		//adjust position of popup layer, $div is fixed position
		adjustPosition: function($div) {
			
			var winSize = this.getWindowSize();
			var winWidth = winSize.winWidth;
			var winHeight = winSize.winHeight;
			
			var divHeight = parseInt($div.css("height"));
			var divWidth = parseInt($div.css("width"));
			
			//distance between $div and window's left border
			var divToLeft = parseInt($div.css("left"));
			var divToTop = parseInt($div.css("top"));
			
			//adjust top and left attributes to ensure div entirely visible
			if(divToTop + divHeight > winHeight) {
				$div.css({"top": (winHeight - divHeight - 30) + "px"});
			}
			if(divToLeft + divWidth > winWidth) {
				$div.css({"left": (winWidth - divWidth - 30) + "px"});
			}
		},
		
		//resize image to avoid it too large to make entirely visible
		resizeImage: function($img) {
			
			var winSize = this.getWindowSize();
			var winWidth = winSize.winWidth;
			var winHeight = winSize.winHeight;
			
			var imgHeight = parseInt($img.css("height")) || 1;
			var imgWidth = parseInt($img.css("width")) || 1;

			//image height should be less than 50% window height
			var halfWinHeight = winHeight * 0.5;
			var newWidth = 0;
			if(imgHeight > halfWinHeight) {
				newWidth = (halfWinHeight / imgHeight * imgWidth);
				$img.css({
					"height": halfWinHeight + "px",
					"width":  newWidth + "px"
				});
				imgHeight = halfWinHeight || 1;
				imgWidth = newWidth || 1;
			}
			
			//image width should be less than 70% window width
			var partWinWidth = winWidth * 0.7;
			var newHeight = 0;
			if(imgWidth > partWinWidth) {
				newHeight = (partWinWidth / imgWidth * imgHeight);
				$img.css({
					"height": newHeight + "px",
					"width": partWinWidth + "px"
				});
				imgWidth = partWinWidth;
				imgHeight = newHeight;
			}
			
			return {imgWidth: imgWidth, imgHeight: imgHeight};
		}
	};
	
	/**
	 * @param {Object} container jQuery DOM object that trigger preview event
	 * @param {Object} ops Options for this jquery plugin
	 */
	var Preview = function(container, ops) {
		
		this.container = container;
		
		this.cbFunction = null;
		
		var temp_div = $("<div>");
		this.options = $.extend({
			type: "image", // image, text, video
			src: "",
			trigger: "click", // click, hover
			text: "", // used only when type is "text"
			containerCSS: {}
		}, ops, {div: temp_div});
	
		this.init();
	};
	
	//plugin function init
	Preview.prototype.init = function() {
		var _self = this;
		
		//apply css settings to container
		Helper.applyCSS(_self.options.containerCSS, _self.options.div);
		
		switch(_self.options.type) {
			case "image":
				_self.initImagePreview();
				break;
			case "text":
				_self.initTextPreview();
				break;
			default:
				break;
		}
		
		//bind callback function to trigger event
		$(_self.container).on(_self.options.trigger, function(event){
			_self.cbFunction.call(_self, event, _self.options);
		});
	};
	
	//init text preview
	Preview.prototype.initTextPreview = function() {
		var _self = this;
		
		switch(_self.options.trigger) {
			case "click":
				_self.cbFunction = _self.clickTextCb;
				break;
			case "hover":
				_self.options.trigger = "mouseenter";
				_self.cbFunction = _self.hoverTextCb;
				break;
			default:
				_self.options.trigger = "click";
				_self.cbFunction = _self.clickTextCb;
		}
	};
	
	//text preview, mouse click event callback
	Preview.prototype.clickTextCb = function(event, options) {
		var _self = this;
		
		//max-width of popup layer
		options.div.css({"max-width": "400px"});
		
		var $paragraph = $("<p>");
		$paragraph.css({
			"word-break": "normal",
			"word-wrap": "break-word"
		});
		$paragraph.text(options.text);
		
		options.div.empty();
		options.div.remove();
		
		Helper.domAppend(event, $paragraph, options.div);
		Helper.adjustPosition(options.div);

		options.div.one("mouseleave", function(){
			$(_self.container).off("mouseleave");
			options.div.empty();
			options.div.remove();
		});
		
		$(_self.container).one("mouseleave", function(){
			options.div.off("mouseleave");
			options.div.empty();
			options.div.remove();
		});
	};
	
	//text preview, mouse enter event callback
	Preview.prototype.hoverTextCb = function(event, options) {
		var _self = this;
		_self.clickTextCb(event, options);
	};
	
	//init image preview
	Preview.prototype.initImagePreview = function() {
		var _self = this;
		
		switch (_self.options.trigger) {
			case "click":
				_self.cbFunction = _self.clickImageCb;
				break;
			case "hover":
				_self.options.trigger = "mouseenter";
				_self.cbFunction = _self.hoverImageCb;
				break;
			default:
				_self.options.trigger = "click";
				_self.cbFunction = _self.clickImageCb;
				break;
		}
		
		//preload image
		Helper.imagePreload(_self.options.src);
	};
	
	//image preview, mouse click event callback
	Preview.prototype.clickImageCb = function(event, options) {
		var _self = this;
		
		var img = new Image();
		img.src = _self.options.src;
		
		options.div.empty();
		options.div.remove();
		
		img.onload = function(){
			Helper.domAppend(event, $(img), options.div);
			Helper.resizeImage($(img));
			Helper.adjustPosition(options.div);
		};
		
		options.div.one("mouseleave", function(){
			$(_self.container).off("mouseleave");
			options.div.empty();
			options.div.remove();
		});
		
		$(_self.container).one("mouseleave", function(){
			options.div.off("mouseleave");
			options.div.empty();
			options.div.remove();
		});
	};
	
	//image preview, mouse enter event callback
	Preview.prototype.hoverImageCb = function(event, options) {
		var _self = this;
		_self.clickImageCb(event, options);
	};
	
	$.fn.previewer = function(ops){
		return this.each(function(){
			new Preview(this, ops);
		});
	};
	
})(jQuery, window);

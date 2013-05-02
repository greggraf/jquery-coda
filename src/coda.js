;(function($, w) {

	var version = "0.2.0";
	var logMessage = "";
	var btg;

	if ($) {
		if ($.fn.coda) {    // do not redefine if the plugin is already there
			return false;
		}
		
		// check to see if jQuery greater than 1.4.3, return and log error if not
		if ($().jquery < "1.4.4") {
			return log("Requires jQuery version 1.4.4 or higher");
		}
	
	}
	
	var log = function (str) {
		logMessage =  "CODA Plugin: " + str;

		if ( typeof console !== 'undefined' ) {
			console.log( str );
		}
	};

	var ordUtil = function(url, inc) {
		
		var re = /(\d*)\?$/;
		var ord = +url.match(re)[1];
		
		inc = +inc || 1;

		var new_ord = (ord/10000 + inc) * 10000; // JS can't deal with adding one to big numbers
		var new_url = url.replace(ord, new_ord);

		return {
			"ord": ord,
			"new_ord": new_ord,
			"new_url": new_url
		};
	};
	
	var extractData = function(el, vals) {
		var d = "";
		
		if (typeof el === "undefined") {
			return false;
		}
			
		if (typeof vals === "string") {
			vals = [vals];
		}
		
		if (Object.prototype.toString.call(vals) === '[object Array]') {
			for (var i = 0; i < vals.length; i++) {
				d = el.getAttribute("data-" + vals[i])
				if (d) {
					return d;
				}
			}		 
		}
	
		return false;
	};

	var loadElement = function(element) {
		var self = this;

		var sz, url, adObj, data_replace, data_zone, data_testUrl, data_addkv;

		var activateRefresh = function() {

			var rate = extractData(element, "refreshrate");

			if(!rate) {
				return false;

			} else {			
			
				setTimeout(function() {

					url = ordUtil(url, rate).new_url;

					while (element.firstChild) {
						element.removeChild(element.firstChild);
					}

					buildIframe();
					activateRefresh();
					
				}, rate * 1000);			
			}
		};

		var buildIframe = function(new_url) {
			log("building");

			var ad_src = new_url || url;
			
			var loaded = function() {
			
				$(element).trigger("coda:ad:load", {
					url:ad_src
				});
			
			
			}
				
			var tag = document.createElement("iframe");
			tag.setAttribute("scrolling", "no");
			tag.setAttribute("frameborder", "0");
			tag.setAttribute("allowtransparency", "true");
			tag.setAttribute("leftmargin", "0");
			tag.setAttribute("topmargin", "0");
			tag.setAttribute("marginwidth", "0");
			tag.setAttribute("marginheight", "0");
			tag.setAttribute("width", sz[0]);
			tag.setAttribute("height", sz[1]);
			tag.setAttribute("src", ad_src);

			if (tag.addEventListener) { 
				tag.addEventListener("load", loaded,false);
			} else {
			 if (tag.attachEvent) { // IE DOM
				 var r = tag.attachEvent("onload", loaded);
				}   
			}
			
			element.appendChild(tag)
			
		};


		if (!(btg = window.btg)) {    // grab a local reference to btg
		
			log("error: no CODA");
		
			return false;
		}
		
		if ((element.offsetWidth === 0 && element.offsetHeight === 0)) { // don't put ad in an element that is display: none

			log("error: hidden");		
			return false;
		}

		if (element.getElementsByTagName("iframe").length > 0) { // don't put an ad in an element that is already filled

			log("error: occupied");

			return false;
		}
		
		adObj = {
			"contentType":"adi",
			"dw": "0", // disable the doc.write in DART mobile
			"size": extractData(element, ["sz", "adSizes", "ad-sizes"]),
			"keyValues": ""
		};

		
		// First: if we are replacing page level, set keyValues to replacekv

		data_replace = extractData(element, ["replacekv", "adKeyvalues", "ad-keyvalues"]);

		if (data_replace) {
			// maybe make sure it starts with a !
			adObj.keyValues = ";" + data_replace;
		} else {
			if(btg && btg.config && btg.config.DoubleClick && btg.config.DoubleClick.keyValues) {
				adObj.keyValues = btg.config.DoubleClick.keyValues;
			}
		}

		data_addkv = extractData(element, "addkv");
		if (data_addkv) {
			adObj.keyValues += ";" + data_addkv;
		}

		data_zone = extractData(element, ["zone", "adUnit", "ad-unit"]);
		if (data_zone) {
			adObj.zoneOverride = data_zone;
		}

	
		sz = adObj.size.split("x");
		url = btg.Controller.getAdUrl(adObj);

		data_testUrl = extractData(element, "testUrl");
		if (data_testUrl) {
			url = data_testUrl;
		}

		/*
			assuming we are in dart mobile, 
				- add tp=1 to break the click out of the iframe
				- add sdh=1 to inculde a full document
		*/
		url = url.replace("&dw=0&", "&dw=0&tp=1&sdh=1&"); 

		buildIframe();
		activateRefresh();	

	};

	
	var main = function(cmd) {
	
		var set = this;
	
		if (cmd === "info") {
		
			return {
				ordUtil: ordUtil,
				version: version,
				logMessage: logMessage
			};
			
		} else {

			
			if (!window.btg) {
				log("This plugin depends on btg, CODA is not on the page.");
				return false;

			} else {
				if (cmd && cmd.length) {
					set = cmd;
				}
				
				var l = set.length;  
				for (var i=0;i<l; i++) {  
				 loadElement(set[i]);  
				}

				
				return set;

			}
		} 
	};
	
	if ($) {
		$.fn.coda = main;	
	} else {
		window.fe = window.fe || {};
		window.fe = {
			"coda": main
		}
	}

	
})(window["jQuery"], window);


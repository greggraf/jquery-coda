;(function($, w) {

	var version = "0.2";
	var logMessage = "";
	var btg;
	
	if ($.fn.coda) {    // do not redefine if the plugin is already there
		return false;
	}
	
	var log = function (str) {
		logMessage =  "CODA Plugin: " + str;

		if ( typeof console !== 'undefined' ) {
			console.log( str );
		}
	};

	// check to see if jQuery greater than 1.4.3, return and log error if not
	if ($().jquery < "1.4.4") {
		return log("Requires jQuery version 1.4.4 or higher");
	}

	var ordUtil = function(url, inc) {
		
		var re = /(\d*)\?$/;
		var ord = +url.match(re)[1];
		var new_ord = (ord/10000 + (inc || 1)) * 10000; // JS can't deal with adding one to big numbers
		var new_url = url.replace(ord, new_ord);

		return {
			"ord": ord,
			"new_ord": new_ord,
			"new_url": new_url
		};
	};
	
	var extractData = function(el, vals) {
		
		if (typeof el === "undefined") {
			return false;
		}
		
		var $el = (el.jquery)?  el : $(el);
	
		if (typeof vals === "string") {
			vals = [vals];
		}
		
		if (Object.prototype.toString.call(vals) === '[object Array]') {
			for (var i = 0; i < vals.length; i++) {
				if ($el.data(vals[i])) {
					return $el.data(vals[i]);
				}
			}		 
		}
	
		return false;
	};

	var loadElement = function(element) {
		var self = this;

		var el, sz, url, adObj, data_replace, data_zone, data_testUrl;

		var activateRefresh = function() {

			var rate = extractData(element, "refreshrate");
			
			if(!rate) {
				return false;

			} else {			
			
				setTimeout(function() {

					url = ordUtil(url, rate).new_url;

					el.empty();
					buildIframe();
					activateRefresh();
					
				}, rate * 1000);			
			}
		};

		var buildIframe = function(new_url) {
			
			var ad_src = new_url || url;
			
			$("<iframe />").attr({
				"scrolling": "no",
				"frameborder": "0",
				"allowtransparency": "true",
				"leftmargin": "0",
				"topmargin": "0",
				"marginwidth": "0",
				"marginheight": "0",
				"width": sz[0],
				"height": sz[1],
				"src": ad_src
			}).appendTo(element).
			bind("load", function() {
			
				el.trigger("coda.ad.load", {
					url:ad_src
				});
			
			
			});		
		};

		el = $(element);


		if (!(btg = window.btg)) {    // grab a local reference to btg
		
			el.trigger("coda.ad.load", {"error": "no CODA"} );
		
			return false;
		}
		
		if (!(el.is(":visible"))) { // don't put ad in an element that is display: none

			el.trigger("coda.ad.load", {"error": "hidden"} );
		
			return false;
		}

		if (el.children("iframe").length > 0) { // don't put an ad in an element that is already filled

			el.trigger("coda.ad.load", {"error": "occupied"} );

			return false;
		}
		
		adObj = {
			"contentType":"adi",
			"dw": "0", // disable the doc.write in DART mobile
			"size": extractData(el, ["sz", "adSizes"]),
			"keyValues": ""
		};

		
		// First: if we are replacing page level, set keyValues to replacekv
				
		if (data_replace= extractData(el, ["replacekv", "adKeyvalues"])) {
			// maybe make sure it starts with a !
			adObj.keyValues = ";" + data_replace;
		} else {
			if(btg && btg.config && btg.config.DoubleClick && btg.config.DoubleClick.keyValues) {
				adObj.keyValues = btg.config.DoubleClick.keyValues;
			}
		}
		
		if (data_addkv = extractData(el, "addkv")) {
			adObj.keyValues += ";" + data_addkv;
		}
	
		if (data_zone = extractData(el, ["zone", "adUnit"])) {
			adObj.zoneOverride = data_zone;
		}

	
		sz = adObj.size.split("x");
		url = btg.Controller.getAdUrl(adObj);

		if (data_testUrl = extractData(el, "testUrl")) {
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

	
	$.fn.coda = function(cmd) {
	
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

				return this.each(function() {
					loadElement(this);
				});

			}
		} 
	};
	
})(window["jQuery"] || window["Zepto"], window);


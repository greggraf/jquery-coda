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

	var loadElement = function(element) {
		var self = this;

		var el, sz, url, adObj;

		var activateRefresh = function() {

			var rate;
			
			if(!el.data("refreshrate")) {
				return false;

			} else {
			
				rate = el.data("refreshrate");
			
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
			"size": el.data("sz") || el.data("adSizes") ,
			"keyValues": ""
		};

		
		// First: if we are replacing page level, set keyValues to replacekv
		if (el.data("replacekv") || el.data("adKeyvalues")) {
			// maybe make sure it starts with a !
			adObj.keyValues = ";";
			adObj.keyValues  += el.data("replacekv") || el.data("adKeyvalues");
		} else {
			if(btg && btg.config && btg.config.DoubleClick && btg.config.DoubleClick.keyValues) {
				adObj.keyValues = btg.config.DoubleClick.keyValues;
			}
		}
		
		if (el.data("addkv")) {
			adObj.keyValues += ";" + el.data("addkv");
		}

		if (el.data("zone") || el.data("adUnit")) {
			adObj.zoneOverride = el.data("zone")  || el.data("adUnit") ;
		}

	
		sz = adObj.size.split("x");
		url = btg.Controller.getAdUrl(adObj);

		if (el.data("testUrl")) {
			url = el.data("testUrl");
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


var fixtures = $("#qunit-fixtures").html()
var invoke, one;
var btg_holder;

if(window["jQuery"]) {
	invoke = function(sel, cmd) {

		if (cmd) {
			return $.fn.coda(cmd);
		} else {
			return $(sel).coda();
		}
	}
	
	one = function(sel, ev,  cb) {
		$(sel).one(ev, cb)
	}
	
} else {
	invoke = function(sel, cmd) {
		return window.fe.coda(cmd || document.querySelectorAll(sel))
	}

	one = function(sel, ev,  cb) {
		var listener = function(e) {

				this.removeEventListener(ev, listener, false);
				cb(e, e.data);
			}
			
		var els =  (typeof sel == "string")? document.querySelectorAll(sel): sel;
		if (els.length) {
			for (var i = 0; i < els.length; i++) {

				els[i].addEventListener(ev,listener )
			}
		} else {
				els.addEventListener(ev,listener )
		}
	}
	
}

module("CODA", {
	teardown: function() {
	},
	
	setup: function() {
		$("#qunit-fixtures").empty().html(fixtures);
	}
});


test("Basics",function(){
	expect(2);
	
	
	ok(
	
		($.isFunction($.fn.coda) || $.isFunction(window.fe.coda)), 
		"$.fn.coda exists and is a function"
	);

	equal( invoke('', 'info').version, "0.2.0", "$.fn.coda() version is 0.2.0"	);
	
});



test("btg dependency",function(){

	btg_holder = window.btg;
	window.btg = undefined;

	expect(2)

	equal(
		invoke("#test1"), 
		false,
		"return false if btg is not on the page"
	);

	equal(
		invoke("#test1", 'info').logMessage, 
		"CODA Plugin: This plugin depends on btg, CODA is not on the page.",
		"Log message if btg is not on the page"
	);

	window.btg = btg_holder;
	
});

test("refresh rate",function(){

	stop();
	
	expect(2);

	var el = $("#test_refreshrate");
	var val1, val2, val3;
	
	
	one("#test_refreshrate","coda:ad:load", function(e, data) {	

		val1 = data.url;

		one("#test_refreshrate", "coda:ad:load", function(e, data) {


			val2 = data.url;
			el.attr("data-refreshrate", "")
			
			one("#test_refreshrate", "coda:ad:load", function(e, data) {

	
	
				val3 = data.url;

				start();
		
				notEqual(
					val1, 
					val2,
					"on first reload, src changes"
				);

				notEqual(
					val2, 
					val3,
					"on second reload, src changes"
				);
				
			});

			
		});
	
	});
	
	invoke("#test_refreshrate");
	
	
});

test("refresh 2 ads at the same interval",function(){

	stop();
	
	expect(3);

	var els = $(".refresh2");
	var vals = [];
	var ordUtil = invoke("body", "info").ordUtil;

	
	one(".refresh2", "coda:ad:load", function(e, data) {	

		vals.push(ordUtil(data.url).ord);

		one(e.target, "coda:ad:load", function(e, data) {

			$(e.target).attr("data-refreshrate", "")

			vals.push(ordUtil(data.url).ord);
	
			if (vals.length == 4) {

				start();
		
				equal(
					vals[0], 
					vals[1],
					"two ads with the same refresh rate have the same ord"
				);
	
				equal(
					vals[2], 
					vals[3],
					"two ads have same ord on  refresh"
				);
	
				notEqual(
					vals[0], 
					vals[3],
					"ord on refresh is different from initial ord"
				);
			}			
		});
	
	});
	
	invoke(".refresh2");
	
	
});

test("refresh 2 sets of ads at different intervals",function(){

	stop();
	
	expect(8);

	var els = $(".refresh2, .refresh3");
	var vals = {
		"set1": [],
		"set2": []
	};
	var ordUtil = invoke("body", "info").ordUtil;

	
	one(".refresh2, .refresh3", "coda:ad:load", function(e, data) {	
		var $el = $(e.target);
		var set = ""
		
		if ($el.hasClass("refresh2")) {
			set = "set1";
		} else {
			if ($el.hasClass("refresh3")) {
				set = "set2";
			}
		}
		
		vals[set].push(ordUtil(data.url).ord);
		
		one(e.target, "coda:ad:load", function(e, data) {

			$el.attr("data-refreshrate", "")

			vals[set].push(ordUtil(data.url).ord);
	
			if ((vals["set2"].length == 4) && (vals["set1"].length == 4)) {

				start();
		
				equal(
					vals["set1"][0], 
					vals["set1"][1],
					"set1 initial ords match"
				);

				equal(
					vals["set2"][0], 
					vals["set2"][1],
					"set2 initial ords match"
				);
				
				equal(
					vals["set1"][2], 
					vals["set1"][3],
					"set1 refresh ords match"
				);

				equal(
					vals["set2"][2], 
					vals["set2"][3],
					"set2 refresh ords match"
				);	
				
				notEqual(
					vals["set1"][0], 
					vals["set1"][3],
					"set1 initial and refresh ords do not match"
				);

				notEqual(
					vals["set2"][0], 
					vals["set2"][3],
					"set2 initial and refresh ords do not match"
				);
				
				equal(
					vals["set1"][0], 
					vals["set2"][0],
					"set2 and set1 initial  ords  match"
				);				
				
				notEqual(
					vals["set1"][2], 
					vals["set2"][2],
					"set2 and set1 refresh  ords do not match"
				);				
			}			
		});
	
	});
	
	invoke(".refresh2, .refresh3");
	
	
});

test("ord utilities",function(){
	
	expect(4);
	
	var ordUtil = invoke("#test_refreshrate", "info").ordUtil;
	var sampleUrl = "http://ad.doubleclick.net/adi/nick.nol/unk_i_s/mtvn/dev/jquery-coda/docs/_0_1/test/qunit;sec0=mtvn;sec1=dev;sec2=jquery-coda;sec3=docs;sec4=_0_1;sec5=test;sec6=qunit;u=a0171b8b-0e9b-eef2-3dbc-edea52ae7dfe;pos=unk;tag=adi;mtype=standard;sz=300x250;tile=1;ord=590898784273304000?"

	var resultObj = {
		"ord": 590898784273304000,
		"new_ord": 590898784273314000,
		"new_url": "http://ad.doubleclick.net/adi/nick.nol/unk_i_s/mtvn/dev/jquery-coda/docs/_0_1/test/qunit;sec0=mtvn;sec1=dev;sec2=jquery-coda;sec3=docs;sec4=_0_1;sec5=test;sec6=qunit;u=a0171b8b-0e9b-eef2-3dbc-edea52ae7dfe;pos=unk;tag=adi;mtype=standard;sz=300x250;tile=1;ord=590898784273314000?",
		"new_ord_5": 590898784273354100
	}
	
	equal(
		ordUtil(sampleUrl).ord,
		resultObj.ord,
		"extract ord"
	);

	equal(
		ordUtil(sampleUrl).new_ord,
		resultObj.new_ord,
		"increment ord"
	);

	equal(
		ordUtil(sampleUrl).new_url,
		resultObj.new_url,
		"return new url with updated ord"
	);

	equal(
		ordUtil(sampleUrl, 5).new_ord,
		resultObj.new_ord_5,
		"return new url with custom increment"
	);
	
	
});

test("zone override",function(){

	stop();
	
	expect(2);

	var getZone = function(str) {
		return str.substr(7, str.indexOf(";") - 7).split("/").slice(4).join("/")
	}

	var el = $("#test_zone");
	var el2 = $("#test1");
	var data_att_val = "nickmom/more_lols/_mn";
	var default_val, override_val;
	
	one("#test1", "coda:ad:load", function(e, data) {	

		default_val = getZone(data.url);
		invoke("#test_zone");

	});
	
	one("#test_zone", "coda:ad:load", function(e, data) {	

		override_val = getZone(data.url);
		start();

		notEqual(
			override_val, 
			default_val,
			"zone is overriden"
		);

		equal(
			override_val, 
			data_att_val,
			"zone is what was in the data- attribute"
		);

	
	});
	
	invoke("#test1");
	
});

module("placeholder hidden")

test("no ad if placeholder element is display: none",function(){
	
	expect(2);
	invoke('','info').debug(true);
	var el = $("#test_display_none");
	invoke("#test_display_none"); 

	equal(invoke('','info').logMessage, "CODA Plugin: error: hidden", "logged message 'hidden' error");
	equal("", el.html(), "The placeholder is empty");
	invoke('','info').debug(false);

});



module("data attributes", {
	"setup": function() {
		btg.config.DoubleClick.keyValues="pagelevel=here;";

		this.attrs = {
			"addkv": "key1=val1;key2=val2",
			"excludekv": "!category=exclude1;!category=exclude2",
			"replacekv": "kv=replaced"
		};
		
		this.testslug = ["addkv", "excludekv", "replacekv"]
		
		
	}
});

var testslug = ["addkv", "replacekv", "addkv_replacekv"]

var testfn = function(slug, self) {

		btg.config.DoubleClick.keyValues="pagelevel=here;";

	stop();

	var	slugs = slug.split("_");


	expect(slugs.length /* + 1 */);
	
	var el = $("#test_" + slug);
	var attrs = self.attrs
	
	one("#test_" + slug, "coda:ad:load", function(e, data) {	
		start();		

		for (var i = 0; i < slugs.length; i++) {
			ok(data.url.indexOf(attrs[slugs[i]]) > 1, "values from the " + slugs[i] + " data attribute(s) are in the dart call");
		}

/*
		if (slug.indexOf("replacekv") < 0) {
			ok(data.url.indexOf("pagelevel=here") >= 0, "values from the page level are in the dart call");		
		} else {
			ok(data.url.indexOf("pagelevel=here") < 0, "values from the page level are not in the dart call");
		}
*/

	});

	invoke("#test_" + slug);
}


	test(testslug[0] + " attribute", function() {
		testfn(testslug[0], this)
	})

	test(testslug[1] + " attribute", function() {
		testfn(testslug[1], this)
	})

	test(testslug[2] + " attribute", function() {
		testfn(testslug[2], this)
	})

module("DFP data attributes", {
	"setup": function() {
		btg.config.DoubleClick.keyValues="pagelevel=here;";

		this.attrs = {
			"addkv": "key1=val1;key2=val2",
			"excludekv": "!category=exclude1;!category=exclude2",
			"replacekv": "kv=replaced"
		};
		
		this.testslug = ["addkv", "excludekv", "replacekv"]
		
		
	}
});

test("DFP data attributes make it into the ad call",function(){

	expect(3);
	stop();

	var adSizes="300x250";
	var adUnit="/nickmom/more_lols/_mn";
	var adKeyvalues="key1=val1;key2=val2";


	var el = $("#test_dfp");

	
	one("#test_dfp", "coda:ad:load", function(e, data) {	
		start();		

		ok(data.url.indexOf(adSizes) > 1, "values from the data-ad-sizes data attribute is in the dart call");
		ok(data.url.indexOf(adUnit) > 1, "values from the data-ad-unit data attribute is in the dart call");
		ok(data.url.indexOf(adKeyvalues) > 1, "values from the data-ad-keyvalues data attribute is in the dart call");

	});

	
	invoke("#test_dfp");
	
	
});


var fixtures = $("#qunit-fixtures").html()

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
		$.isFunction($.fn.coda), 
		"$.fn.coda exists and is a function"
	);

	equal( $.fn.coda('info').version, "0.1", "$.fn.coda() version is 0.1"	);
	
});

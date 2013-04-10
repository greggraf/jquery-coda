var fs = require('fs');

var md = require('markdown');

var infile = ["README.md", "history.md"];

var styles = [
	"b > i:after { content:\\a }",
	"body { \
		font-family: Arial, sans-serif;\
		line-height: 1.2em;}",
	"code { margin: 0 2px;\
		padding: 0px 5px;\
		border: 1px solid #dddddd;\
		background-color: #f5f5f5;\
		-webkit-border-radius: 3px;\
		-moz-border-radius: 3px;\
		font-family: monospace;\
		border-radius: 3px;}",
	"pre code {\
		display: block;\
		line-height: 1.2em;\
		overflow: auto;\
		padding: 6px 10px;\
		-webkit-border-radius: 3px;\
		-moz-border-radius: 3px;\
		border-radius: 3px;	\
	}"		
];


var prologue = "<html><head><title></title><style>" + styles.join(" ") + "</style></head>";
var epilogue = "</body></html>";


var doit = function() {

	var x = prologue;

	for (i = 0; i < infile.length; i++) {
		  console.log('OK: ' + infile[i]);
		  x += md.markdown.toHTML(fs.readFileSync(infile[i], 'utf8'))
	}
	
	x += epilogue;

	fs.writeFileSync('index.html', x);	
	console.log(x);
	
}()

fs.watchFile(infile, function(curr,prev) {
    console.log("current mtime: " +curr.mtime);
    console.log("previous mtime: "+prev.mtime);
    if (curr.mtime == prev.mtime) {
        console.log("mtime equal");
    } else {
        console.log("mtime not equal");

		doit()

    }   
});

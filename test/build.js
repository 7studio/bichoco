
var fs = require("vinyl-fs");
var map = require("map-stream");

var postcss = require("postcss");
var atImport = require("postcss-import");
var customProperties = require("postcss-custom-properties");
var calc = require("postcss-calc");

var stripCssComments = require("strip-css-comments");

var bichoco = function(file, cb) {
  var css = file.contents.toString();
  var result;
  var output;

  result = postcss()
    .use(atImport({path: ["src/css"]}))
    .use(customProperties())
    .use(calc({precision: 2, preserve: true}))
    .process(css, {from: file.path});

  output = result.css;
  output = stripCssComments(output);

  file.contents = new Buffer(output);

  cb(null, file);
};

fs.src("build/test/**/*.css")
  .pipe(map(bichoco))
  .pipe(fs.dest("build/test"));

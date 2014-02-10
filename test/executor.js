var path = require('path');
var fs = require('fs');
var jsdom = require('jsdom').jsdom;
var xmldom = require('xmldom');
var canvas = require('canvas');
var assert = require('chai').assert;


var VENDOR_CODE =
  fs.readFileSync(path.join(__dirname, '../build/package/js/en_us/vendor.js'));

var initBlockly = function(window_) {
  /* jshint -W054 */
  var fn = new Function(VENDOR_CODE + '; return Blockly;');
  return fn.call(window_);
};

var setGlobals = function () {
  // Initialize virtual browser environment.
  var html = '<html><head></head><body><div id="app"></div></body></html>';
  var document_ = global.document = jsdom(html);
  var window_ = global.window = document_.parentWindow;
  window_.DOMParser = global.DOMParser = xmldom.DOMParser;
  window_.XMLSerializer = global.XMLSerializer = xmldom.XMLSerializer;
  window_.Blockly = global.Blockly = initBlockly(window_);
  global.Image = canvas.Image;
}

// Asynchronously test a level inside a virtual browser environment.
var runLevel = function(app, level, onAttempt) {
  var window_ = window;
  require('../build/js/' + app + '/main');

  // app specific hacks
  switch (app.toLowerCase()) {
    case 'turtle':
      global.Turtle = window.Turtle;
      // hack drawTurtle to be a noop, as it's not needed to verify solutions,
      // and drawImage was having issues in a node environment
      global.Turtle.drawTurtle = function () {};
      break;
    case 'maze':
      break;
  }

  var main = window_[app + 'Main'];
  main({
    skinId: 'farmer', // XXX Doesn't apply to Turtle, should come from level.
    level: level,
    baseUrl: '/', // XXX Doesn't matter
    containerId: 'app',
    onInitialize: function() {
      // Click the run button!
      window_.BlocklyApps.runButtonClick();
    },
    onAttempt: onAttempt
  });
};

var runTestFromCollection = function (collection, index) {
  var testCollection = require('./' + collection);
  var app = testCollection.app;

  var levels = require('../build/js/' + app + '/' + testCollection.levelFile);
  var level = levels[testCollection.levelId];
  var exceptions;

  // Warp Speed!
  if (!level.scale) {
    level.scale = {};
  }
  level.scale.stepSpeed = 0;
  level.sliderSpeed = 1;

  console.log("index = " + index);
  var testData = testCollection.tests[index];

  // Override start blocks to load the solution;
  level.startBlocks = testData.xml;
  runLevel(app, level, function (report) {
    exceptions = [];

    // Validate successful solution.
    assert(Object.keys(testData.expected).length > 0);
    Object.keys(testData.expected).forEach(function (key) {
      if (report[key] !== testData.expected[key]) {
        process.stderr.write('Failure for key: ' + key);
        process.stderr.write('. Expected: ' + testData.expected[key]);
        process.stderr.write('. Got: ' + report[key] + '\n');
      }
    });
  });
};

setGlobals();
runTestFromCollection(process.argv[2], process.argv[3]);

var path = require('path');
var fs = require('fs');
var jsdom = require('jsdom').jsdom;
var xmldom = require('xmldom');
var canvas = require('canvas');
var assert = require('chai').assert;

var buildDir = '../../build';

var VENDOR_CODE =
  fs.readFileSync(path.join(__dirname, buildDir + '/package/js/en_us/vendor.js'));

setGlobals();

console.log("done");
process.exit(0);


runTestFromCollection(process.argv[2], process.argv[3]);

function setGlobals () {
  // Initialize virtual browser environment.
  var html = '<html><head></head><body><div id="app"></div></body></html>';
  global.document = jsdom(html);
  global.window = global.document.parentWindow;
  global.DOMParser = xmldom.DOMParser;
  global.XMLSerializer = xmldom.XMLSerializer;
  global.Blockly = initBlockly(window);
  global.Image = canvas.Image;
}

function initBlockly () {
  /* jshint -W054 */
  var fn = new Function(VENDOR_CODE + '; return Blockly;');
  return fn.call(window);
}

function runTestFromCollection (collection, index) {
  var testCollection = require('../' + collection);
  var app = testCollection.app;

  var levels = require(buildDir + '/js/' + app + '/' + testCollection.levelFile);
  var level = levels[testCollection.levelId];
  var testData = testCollection.tests[index];

  // Override speed
  if (!level.scale) {
    level.scale = {};
  }
  level.scale.stepSpeed = 0;
  level.sliderSpeed = 1;

  // Override start blocks to load the solution;
  level.startBlocks = testData.xml;

  // Validate successful solution.
  var validateResult = function (report) {
    assert(Object.keys(testData.expected).length > 0);
    Object.keys(testData.expected).forEach(function (key) {
      if (report[key] !== testData.expected[key]) {
        process.stderr.write('Failure for key: ' + key);
        process.stderr.write('. Expected: ' + testData.expected[key]);
        process.stderr.write('. Got: ' + report[key] + '\n');
      }
    });
  };

  runLevel(app, level, validateResult);
}

function runLevel (app, level, onAttempt) {
  require(buildDir + '/js/' + app + '/main');

  setAppSpecificGlobals(app);

  var main = window[app + 'Main'];
  main({
    skinId: 'farmer', // XXX Doesn't apply to Turtle, should come from level.
    level: level,
    baseUrl: '/', // XXX Doesn't matter
    containerId: 'app',
    onInitialize: function() {
      // Click the run button!
      window.BlocklyApps.runButtonClick();
    },
    onAttempt: onAttempt
  });
}

function setAppSpecificGlobals (app) {
  // app specific hacks
  switch (app.toLowerCase()) {
    case 'turtle':
      global.Turtle = window.Turtle;
      // hack drawTurtle to be a noop, as it's not needed to verify solutions,
      // and drawImage was having issues in a node environment
      global.Turtle.drawTurtle = function () {};
      break;
  }
}




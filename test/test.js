/**
 * The level test driver.
 * Tests collections are specified in .json files in this directory.
 * To extract the xml for a test from a workspace, run the following code in
 * your console:
 * JSON.stringify(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)));
 */

var path = require('path');
var fs = require('fs');
var assert = require('chai').assert;
var jsdom = require('jsdom').jsdom;
var xmldom = require('xmldom');
var wrench = require('wrench');

var VENDOR_CODE =
  fs.readFileSync(path.join(__dirname, '../build/package/js/en_us/vendor.js'));

var initBlockly = function(window_) {
  /* jshint -W054 */
  var fn = new Function(VENDOR_CODE + '; return Blockly;');
  return fn.call(window_);
};

// Initialize virtual browser environment.
var html = '<html><head></head><body><div id="app"></div></body></html>';
var document_ = global.document = jsdom(html);
var window_ = global.window = document_.parentWindow;
window_.DOMParser = global.DOMParser = xmldom.DOMParser;
window_.XMLSerializer = global.XMLSerializer = xmldom.XMLSerializer;
window_.Blockly = global.Blockly = initBlockly(window_);

// Asynchronously test a level inside a virtual browser environment.
var runLevel = function(app, level, onAttempt) {
  require('../build/js/' + app + '/main');
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

// Loads a test collection at path an runs all the tests specified in it.
var runTestCollection = function (path) {
  var testCollection = require('./' + path);
  var app = testCollection.app;

  // TODO: do i want a way to run this against src file as well so that we dont
  // require a build to run tests?
  var levels = require('../build/js/' + app + '/' + testCollection.levelFile);
  var level = levels[testCollection.levelId];

  testCollection.tests. forEach(function (testData) {
    it(testData.description, function (done) {
      // Warp Speed!
        if (!level.scale) {
          level.scale = {};
        }
        level.scale.stepSpeed = 0;

        // Override start blocks to load the solution;      
        level.startBlocks = testData.xml;

        runLevel(app, level, function (report) {          
          // todo - see what happens with empty/bad expected

          // Validate successful solution.
          Object.keys(testData.expected).forEach(function (key) {
            assert.equal(report[key], testData.expected[key],
              "Failure for key: " + key);
          });
          done();
        });
    });
  });
};

// Get all json files under directory path
var getTestCollections = function (directory) {  
  var files = wrench.readdirSyncRecursive(directory);
  var testCollections = [];
  files.forEach(function (file) {
    if (/\.json$/.test(file)) {
      testCollections.push(file);
    }
  });
  return testCollections;
};

describe('level tests', function () {    
  getTestCollections('./test').forEach(function (path) {
    runTestCollection(path);
  });  
});
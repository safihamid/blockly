/**
 * The level test driver.
 * Tests collections are specified in .json files in this directory.
 * To extract the xml for a test from a workspace, run the following code in
 * your console:
 * JSON.stringify(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)));
 */

// todo - There's some sort of leak here, where as we run tests, they take
// longer and longer (even if we run the same test a bunch of times).  I've
// tracked it down to Blockly.BlockSvg.prototype.render somwhere.  I've
// validated that we call this function the same number of times from test
// to test, but that the calls in later tests take longer.

// todo - should we also have tests around which blocks to show as part of the
// feedback when a user gets the puzzle wrong?

var path = require('path');
var fs = require('fs');
var assert = require('chai').assert;
var jsdom = require('jsdom').jsdom;
var xmldom = require('xmldom');
var wrench = require('wrench');
var canvas = require('canvas');

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
global.Image = canvas.Image;

// Asynchronously test a level inside a virtual browser environment.
var runLevel = function(app, level, onAttempt) {
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
      // disable animations, otherwise these continue to run after our test is
      // finished, which gets us into trouble if we switch to another app.
      // long term, better fix would be to have each app run in its own context
      global.Maze.animate = function () {};
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

// Clone's an answer, which means a two-level deep clone
var cloneAnswer = function (answer) {
  if (answer === undefined) {
    return answer;
  }
  var clone = [];
  answer.forEach(function (item) {
    clone.push(item.slice());
  });
  return clone;
};

// Loads a test collection at path an runs all the tests specified in it.
var runTestCollection = function (path) {
  var testCollection = require('./' + path);
  var app = testCollection.app;

  var levels = require('../build/js/' + app + '/' + testCollection.levelFile);
  var level = levels[testCollection.levelId]; 

  var exceptions, messages;

  // Warp Speed!
  if (!level.scale) {
    level.scale = {};
  }
  level.scale.stepSpeed = 0;
  level.sliderSpeed = 1;

  // clone answer and requiredBlocks as blockly modifies these as it draws
  // the answer
  var answer = cloneAnswer(level.answer);
  var requiredBlocks = level.requiredBlocks ? level.requiredBlocks.slice() : [];

  describe(path, function () {
    testCollection.tests.forEach(function (testData) {
      it(testData.description, function (done) {
        // can specify a test specific timeout in json file.
        if (testData.timeout !== undefined) {
          this.timeout(testData.timeout);
        }
        if (process.execArgv.indexOf('--debug') !== -1 ||
          process.execArgv.indexOf('--debug-brk') !== -1) {
          // Don't timeout while we're debugging
          this.timeout(0);
        }

        // Override start blocks to load the solution;      
        level.startBlocks = testData.xml;

        // reset answer/requiredBlocks to previously cloned value
        level.requiredBlocks = requiredBlocks.slice();
        level.answer = cloneAnswer(answer);

        runLevel(app, level, function (report) {
          exceptions = [];

          // Validate successful solution.
          assert(Object.keys(testData.expected).length > 0);
          Object.keys(testData.expected).forEach(function (key) {
            try {
              assert.equal(report[key], testData.expected[key],
                'Failure for key: ' + key);
            } catch (e) {
              // swallow exception to start so that if there are multiple  we
              // can catch them all
              exceptions.push(e);
            }               
          });
          if (exceptions.length === 1) {
            throw exceptions[0];
          } else if (exceptions.length > 1) {
            messages = 'Multiple exceptions\n---';
            exceptions.forEach(function (e) {
              messages += '\n' + e.message;
            });
            assert.ok(false, messages + '\n---\nEnd of combined exceptions');
          }
          done();
        });
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

getTestCollections('./test').forEach(function (path) {
  runTestCollection(path);
});

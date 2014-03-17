/**
 * The level test driver.
 * Tests collections are specified in .json files in this directory.
 * To extract the xml for a test from a workspace, run the following code in
 * your console:
 * JSON.stringify(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)));
 */

// todo - should we also have tests around which blocks to show as part of the
// feedback when a user gets the puzzle wrong?

var path = require('path');
var assert = require('chai').assert;
var wrench = require('wrench');

var child_process = require('child_process');

getTestCollections('./test').forEach(function (path) {
  runTestCollection(path);
});

// Get all json files under directory path
function getTestCollections (directory) {
  var files = wrench.readdirSyncRecursive(directory);
  var testCollections = [];
  files.forEach(function (file) {
    if (/\.json$/.test(file)) {
      testCollections.push(file);
    }
  });
  return testCollections;
}

// Loads a test collection at path an runs all the tests specified in it.
function runTestCollection (path) {
  var testCollection = require('./' + path);
  var app = testCollection.app;

  var levels = require('../build/js/' + app + '/' + testCollection.levelFile);
  var level = levels[testCollection.levelId];

  describe(path, function () {
    testCollection.tests.forEach(function (testData, index) {
      // todo - maybe change the name of expected to make it clear what type of
      // test is being run, since we're using the same JSON files for these
      // and our getMissingRequiredBlocks tests (and likely also other things
      // in the future)
      if (testData.expected) {
        runTest(path, testData, index);
      }
    });
  });
}

function runTest (path, testData, index) {
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

    // run executor in it's own node process
    child_process.exec('node test/util/executor ' + path + ' ' +  index,
      {}, function (error, stdout, stderr) {
        assert.equal(error, null);
        assert(stderr === "", '\n' + stderr);
        done();
    });
  });
}

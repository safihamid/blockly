var chai = require('chai');
chai.Assertion.includeStack = true;
var assert = chai.assert;
var wrench = require('wrench');

var SRC = '../src/';

// todo - somewhere (possibly somewhere in here) we should test for feedback
// results as well, particular for cases where there are no missing blocks
// but we still dont have the right result
// also the case where you have two options

// load some utils

// todo: GlobalDiff lets me track additions into the global namespace.  Might
// there be a better way to more completely track what sorts of things are
// changing globally?  In particular, we want as fresh a global state between
// tests as possible
var GlobalDiff = require('./util/globalDiff');
var globalDiff = new GlobalDiff();

var Overloader = require('./util/overloader');
// this mapping may belong somwhere common
var mapping = [
  {
    search: /\.\.\/locale\/current\//,
    replace: '../build/locale/en_us/'
  },
  {
    search: /^\.\/templates\//,
    replace: '../build/js/templates/'
  }
];
var overloader = new Overloader(mapping, module);

// overloader.verbose = true;

/**
 * Wrapper around require, potentially also using our overloader, that also
 * validates that any additions to our global namespace are expected.
 */
function requireWithGlobalsCheck(path, allowedChanges, useOverloader) {
  allowedChanges = allowedChanges || [];
  if (useOverloader === undefined) {
    useOverloader = true;
  }

  globalDiff.cache();
  var result = useOverloader ? overloader.require(path) : require(path);
  var diff = globalDiff.diff(true);
  diff.forEach(function (key) {
    assert.notEqual(allowedChanges.indexOf(key), -1, "unexpected global change\n" +
      "key: " + key + "\n" +
      "require: " + path + "\n");
  });
  return result;
}

/**
 * Loads options.startBlocks into the workspace, then calls
 * getMissingRequiredBlocks and validates that the result matches the
 * options.expectedResult
 */
describe("getMissingRequiredBlocks tests", function () {
  var feedback;
  function validateBlocks(options) {
    assert.notEqual(options.requiredBlocks, undefined);
    assert.notEqual(options.numToFlag, undefined);
    assert.notEqual(options.userBlockXml, undefined);
    assert.notEqual(options.expectedResult, undefined);

    // Should probably have these as inputs to getMissingRequiredBlocks instead
    // of fields on BlocklyApps as it's the only place they're used
    // In fact, may want to get rid of NUM_REQUIRED_BLOCKS_TO_FLAG as it's only
    // ever set to 1, or perhaps make it customizable per level
    BlocklyApps.REQUIRED_BLOCKS = options.requiredBlocks;
    BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = options.numToFlag;

    BlocklyApps.loadBlocks(options.userBlockXml);
    var missing = feedback.__testonly__.getMissingRequiredBlocks();
    debugger;
    assert.deepEqual(missing, options.expectedResult);
  }

  // create our environment
  before(function () {
    requireWithGlobalsCheck('./util/frame',
      ['document', 'window', 'DOMParser', 'Blockly'], false);
    assert(global.Blockly, 'Frame loaded Blockly into global namespace');

    // c, n, v, p, s get added to global namespace by messageformat module, which
    // is loaded when we require our locale msg files
    global.BlocklyApps = requireWithGlobalsCheck(SRC + '/base',
      ['c', 'n', 'v', 'p', 's']);
    globalDiff.cache(); // recache since we added global BlocklyApps

    feedback = requireWithGlobalsCheck(SRC + '/feedback');

    var div = document.getElementById('app');
    assert(div);

    var options = {
      assetUrl: function (path) {
        return '../lib/blockly/' + path;
      }
    };
    Blockly.inject(div, options);

    // use a couple of core blocks, rather than adding a dependency on app
    // specific block code
    assert(Blockly.Blocks.text_print, "text_print block exists");
    assert(Blockly.Blocks.text, "text block exists");
    assert(Blockly.Blocks.math_number, "math_number block exists");
  });

  beforeEach(function () {
    Blockly.mainWorkspace.clear();
  });

  // missing multiple blocks

  describe("required blocks look for existence of string in code", function () {
    var testBlocks = [
      {
        'test': 'window.alert',
        'type': 'text_print'
      },
      {
        'test': 'TextContent',
        'type': 'text'
      },
      {
        'test': '10;',
        'type': 'math_number'
      }
    ];

    var testBlockXml = [
      '<block type="text_print"></block>',
      '<block type="text"><title name="TEXT">TextContent</title></block>',
      '<block type="math_number"><title name="NUM">10</title></block>'
    ];
    runTests(testBlocks, testBlockXml);
  });

  describe("required blocks use function to check for existence", function () {
    var testBlocks = [
      {
        'test': function (block) {
          return block.type === 'text_print';
        },
        'type': 'text_print'
      },
      {
        'test': function (block) {
          return block.type === 'text';
        },
        'type': 'text'
      },
      {
        'test': function (block) {
          return block.type === 'math_number';
        },
        'type': 'math_number'
      }
    ];

    var testBlockXml = [
      '<block type="text_print"></block>',
      '<block type="text"><title name="TEXT">TextContent</title></block>',
      '<block type="math_number"><title name="NUM">10</title></block>'
    ];

    runTests(testBlocks, testBlockXml);
  });

  function runTests(testBlocks, testBlockXml) {
    it ("expect 1 block, empty workspace, told block missing", function () {
      validateBlocks({
        requiredBlocks: [
          [testBlocks[0]]
        ],
        numToFlag: 1,
        userBlockXml: "",
        expectedResult: [testBlocks[0]],
      });
    });

    it ("expect 1 block, wrong block present, told block missing", function () {
      validateBlocks({
        requiredBlocks: [
          [testBlocks[0]]
        ],
        numToFlag: 1,
        userBlockXml: "<xml>" + testBlockXml[1] + '</xml>',
        expectedResult: [testBlocks[0]]
      });
    });

    it ("expect 1 block, block is there, told no blocks missing", function () {
      validateBlocks({
        requiredBlocks: [
          [testBlocks[0]]
        ],
        numToFlag: 1,
        userBlockXml: "<xml>" + testBlockXml[0] + '</xml>',
        expectedResult: []
      });
    });

    it ("expect 2 blocks, numToFlag = 1, both missing, told first block missing", function () {
      validateBlocks({
        requiredBlocks: [
          [testBlocks[0]],
          [testBlocks[1]]
        ],
        numToFlag: 1,
        userBlockXml: "",
        expectedResult: [testBlocks[0]]
      });
    });
    it ("expect 2 blocks, numToFlag = 2, both missing, told both missing", function () {
      validateBlocks({
        requiredBlocks: [
          [testBlocks[0]],
          [testBlocks[1]]
        ],
        numToFlag: 2,
        userBlockXml: "",
        expectedResult: [testBlocks[0], testBlocks[1]]
      });
    });
    it ("expect 2 blocks, numToFlag = 2, first block missing, told second block missing", function () {
      validateBlocks({
        requiredBlocks: [
          [testBlocks[0]],
          [testBlocks[1]]
        ],
        numToFlag: 2,
        userBlockXml: "<xml>" + testBlockXml[0] + '</xml>',
        expectedResult: [testBlocks[1]]
      });
    });
    it ("expect 2 blocks, numToFlag = 2, second block missing, told first block missing", function () {
      validateBlocks({
        requiredBlocks: [
          [testBlocks[0]],
          [testBlocks[1]]
        ],
        numToFlag: 2,
        userBlockXml: "<xml>" + testBlockXml[0] + testBlockXml[1] + '</xml>',
        expectedResult: [],
        assertMessage: "no blocks missing"
      });
    });

    // todo - maybe also do a combo of both a single a double missing

    it ("expect 1 of 2 blocks, empty workspace, told of both missing blocks", function () {
      // empty workspace
      validateBlocks({
        requiredBlocks: [
          [testBlocks[1], testBlocks[2]] // allow text or number
        ],
        numToFlag: 1,
        userBlockXml: "",
        expectedResult: [testBlocks[1], testBlocks[2]]
      });
    });

    it ("expect 1 of 2 blocks, first block there, told none missing", function () {
      // should work with either block
      validateBlocks({
        requiredBlocks: [
          [testBlocks[1], testBlocks[2]] // allow text or number
        ],
        numToFlag: 1,
        userBlockXml: "<xml>" + testBlockXml[1] + "</xml>",
        expectedResult: []
      });
    });

    it ("expect 1 of 2 blocks, second block there, told none missing", function () {
      validateBlocks({
        requiredBlocks: [
          [testBlocks[1], testBlocks[2]] // allow text or number
        ],
        numToFlag: 1,
        userBlockXml: "<xml>" + testBlockXml[2] + "</xml>",
        expectedResult: []
      });
    });
  }

  // todo - move this into shared dir
  // Get all json files under directory path
  function getTestCollections (directory) {
    var files = wrench.readdirSyncRecursive(directory);
    var testCollections = [];
    files.forEach(function (file) {
      if (/\.js$/.test(file)) {
        testCollections.push(file);
      }
    });
    return testCollections;
  }

  function validateMissingBlocksFromLevelTest(collection, levelTest) {
    it (levelTest.description, function () {
      assert(global.Blockly, "Blockly is in global namespace");
      var levels = requireWithGlobalsCheck(SRC + collection.app + '/' +
        collection.levelFile, []);
      var blocks = requireWithGlobalsCheck(SRC + collection.app + '/blocks');
      blocks.install(Blockly, "maze");

      validateBlocks({
        requiredBlocks: levels[collection.levelId].requiredBlocks,
        numToFlag: 1,
        userBlockXml: levelTest.xml,
        expectedResult: levelTest.missingBlocks,
      });
    });
  }

  describe("required blocks for specific levels", function () {
    var collections = getTestCollections('./test/solutions');
    collections.forEach(function (path) {
      describe(path, function () {
        var collection = require('./solutions/' + path);
        collection.tests.forEach(function (levelTest) {
          if (levelTest.missingBlocks) {
            validateMissingBlocksFromLevelTest(collection, levelTest);
          }
        });
      });
    });
  });
});




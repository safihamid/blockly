var chai = require('chai');
chai.Assertion.includeStack = true;
var assert = chai.assert;
// load some utils

// todo: might there be a good way to save and restore global state? (better than below)
var GlobalDiff = require('./util/globalDiff');
var globalDiff = new GlobalDiff();

var Overloader = require('./util/overloader');
// this mapping may belong somwhere common
var mapping = [
  {
    search: '../locale/current/common',
    replace: '../i18n/common/en_us.json' // todo: probably wrong
  },
  {
    search: '../../locale/current/flappy',
    replace: '../build/locale/en_us/flappy'
  },
  {
    search: /^\.\/templates\//,
    replace: '../build/js/templates/'
  }
];
var overloader = new Overloader(__dirname + "/../src/", mapping, module);

// todo - can i make overloader smart enough to take care of this mapping itself?
overloader.addMapping('./constants', './flappy/constants');
overloader.verbose = true;

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

describe("requiredBlocks tests", function () {
  var feedback;

  // create our environment
  before(function () {
    requireWithGlobalsCheck('./util/frame', ['document', 'window', 'DOMParser', 'Blockly'], false);
    assert(global.Blockly, 'Frame loaded Blockly into global namespace');

    global.BlocklyApps = requireWithGlobalsCheck('./base');
    globalDiff.cache(); // recache since we added global BlocklyApps

    feedback = requireWithGlobalsCheck('./feedback');

    var div = document.getElementById('app');
    assert(div);

    var options = {
      assetUrl: function (path) {
        return '../lib/blockly/' + path;
      }
    };
    Blockly.inject(div, options);
  });

  beforeEach(function () {
    Blockly.mainWorkspace.clear();
  });

  /**
   * Loads options.startBlocks into the workspace, then calls
   * getMissingRequiredBlocks and validates that the result matches the
   * options.expectedResult
   */
  function validateBlocks(options) {
    assert.notEqual(options.requiredBlocks, undefined);
    assert.notEqual(options.numToFlag, undefined);
    assert.notEqual(options.userBlockXml, undefined);
    assert.notEqual(options.expectedResult, undefined);

    BlocklyApps.REQUIRED_BLOCKS = options.requiredBlocks;
    BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = options.numToFlag;

    BlocklyApps.loadBlocks(options.userBlockXml);
    var missing = feedback.__testonly__.getMissingRequiredBlocks();
    assert.deepEqual(missing, options.expectedResult);
  }

  // given: empty workspace, expect 1 block, numToFlag 1, 1 block missing
  // given: empty workspace, expect 2 blocks, numToFlag 1, 1 block missing
  // given: empty workspace, expect 2 blocks, numToFlag 2, 2 block missing
  // given: workspace with 1 block, expect that block, numtoFlag 1, 0 missing
  // given: workspace with 1 block, expect different block, numToFlag 1, 1 missing
  // case where required block contains 2+ options
  // test is string vs. test is function
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
      }
    ];

    var testBlockXml = [
      '<block type="text_print"></block>',
      '<block type="text"><title name="TEXT">TextContent</title></block>'
    ];

    before(function () {
      assert(Blockly.Blocks.text_print, "text_print block exists"); // a core Block
    });

    it ("expect 1 block, block is missing", function () {
      validateBlocks({
        requiredBlocks: [testBlocks.slice(0, 1)],
        numToFlag: 1,
        userBlockXml: "",
        expectedResult: testBlocks.slice(0, 1)
      });
    });

    it ("expect 1 block, block is there", function () {
      validateBlocks({
        requiredBlocks: [testBlocks.slice(0, 1)],
        numToFlag: 1,
        userBlockXml: "<xml>" + testBlockXml[0] + '</xml>',
        expectedResult: []
      });
    });
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
      }
    ];

    var testBlockXml = [
      '<block type="text_print"></block>',
      '<block type="text"><title name="TEXT">TextContent</title></block>'
    ];

    it ("expect 1 block, block is missing", function () {
      validateBlocks({
        requiredBlocks: [testBlocks.slice(0, 1)],
        numToFlag: 1,
        userBlockXml: "",
        expectedResult: testBlocks.slice(0, 1)
      });
    });

    it ("expect 1 block, block is there", function () {
      validateBlocks({
        requiredBlocks: [testBlocks.slice(0, 1)],
        numToFlag: 1,
        userBlockXml: "<xml>" + testBlockXml[0] + '</xml>',
        expectedResult: []
      });
    });
  });


  it("missing block if no blocks are added", function () {
    // todo - separate beforeEach?
    var flappyLevels = requireWithGlobalsCheck('./flappy/levels');
    var flappyBlocks = requireWithGlobalsCheck('./flappy/blocks', ["c", "n", "v", "p", "s"]);
    flappyBlocks.install(Blockly);
    assert.deepEqual(globalDiff.diff(true), [], "install doesnt pollute globals");

    validateBlocks({
      requiredBlocks: flappyLevels['1'].requiredBlocks,
      numToFlag: 1,
      userBlockXml: flappyLevels['1'].startBlocks,
      expectedResult: flappyLevels['1'].requiredBlocks[0]
    });
  });

  it("no missing blocks for correct solution", function () {
    var flappyLevels = requireWithGlobalsCheck('./flappy/levels');
    var flappyBlocks = requireWithGlobalsCheck('./flappy/blocks', ["c", "n", "v", "p", "s"]);
    flappyBlocks.install(Blockly);
    assert.deepEqual(globalDiff.diff(true), [], "install doesnt pollute globals");

    validateBlocks({
      requiredBlocks: flappyLevels['1'].requiredBlocks,
      numToFlag: 1,
      userBlockXml: "<xml><block type=\"flappy_whenClick\" deletable=\"false\"><next><block type=\"flappy_flap\"></block></next></block></xml>",
      expectedResult: []
    });
  });
});




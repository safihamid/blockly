require('./util/frame');
var assert = require('chai').assert;

// todo: might there be a good way to save and restore global state? (better than below)
var GlobalDiff = require('./util/globalDiff');
var globalDiff = new GlobalDiff();

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

var Overloader = require('./util/overloader');
var overloader = new Overloader(__dirname + "/../src/", mapping, module);

// todo - shouldnt need to do this. overloader should be smart enough to
// realize we're not in basedir
overloader.addMapping('./constants', './flappy/constants');
overloader.verbose = true;

/**
 *  Require path and validate changes to global namespace
 */
function requireAndValidate(path, changes) {
  changes = changes || [];
  globalDiff.cache();
  var result = overloader.require(path);
  var diff = globalDiff.diff(true);
  assert.deepEqual(diff, changes, "unexpected global changes requiring " + path + "\n");
  return result;
}

global.BlocklyApps = requireAndValidate('./base');
globalDiff.cache(); // recache since we added global BlocklyApps

var feedback = requireAndValidate('./feedback');
var flappyLevels = requireAndValidate('./flappy/levels');
// todo: requiring the messageformat module pollutes the global namespace with the following items.
// it's not clear to that it should/needs to
var flappyBlocks = requireAndValidate('./flappy/blocks', ["c", "n", "v", "p", "s"]);

flappyBlocks.install(Blockly);
assert.deepEqual(globalDiff.diff(true), [], "install doesnt pollute globals");

assert(Blockly);

BlocklyApps.REQUIRED_BLOCKS = flappyLevels['1'].requiredBlocks;
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = 1;

var div = document.getElementById('app');
assert(div);

var options = {
  assetUrl: function (path) {
    return '../lib/blockly/' + path;
  }
};
Blockly.inject(div, options);

function validateBlocks(start, expected) {
  Blockly.mainWorkspace.clear();
  BlocklyApps.loadBlocks(start);
  var missing = feedback.__testonly__.getMissingRequiredBlocks();
  console.log(missing);
  // todo - expected
}

var startBlocks = flappyLevels['1'].startBlocks;
var correctSolve = "<xml><block type=\"flappy_whenClick\" deletable=\"false\"><next><block type=\"flappy_flap\"></block></next></block></xml>";

validateBlocks(startBlocks, []);

validateBlocks(correctSolve, []);


console.log('finished');




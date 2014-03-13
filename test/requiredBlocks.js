require('./util/frame');
var assert = require('chai').assert;

require('messageformat'); // todo - this is a pre-require hack

// todo: might there be a good way to save and restore global state?

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

BlocklyApps = overloader.require('./base');
var feedback = overloader.require('./feedback');

var flappyLevels = overloader.require('./flappy/levels');
var flappyBlocks = overloader.require('./flappy/blocks');

flappyBlocks.install(Blockly);

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





/*
// todo: might there be a good way to save and restore global state?

var overloader = require('./util/overloader');
// todo - shouldnt need to do this. overloader should be smart enough to
// realize we're not in basedir
overloader.addMapping('./constants', './flappy/constants');
overloader.verbose = true;

BlocklyApps = overloader.require('./base');
var feedback = overloader.require('./feedback');

var flappyLevels = overloader.require('./flappy/levels');
//var flappyBlocks = overloader.require('./flappy/blocks');

//flappyBlocks.install(Blockly);

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

var startBlocks = flappyLevels['1'].startBlocks;

Blockly.mainWorkspace.clear();
// todo - do without using BlocklyApps?
//BlocklyApps.loadBlocks(startBlocks);

var missing = feedback.__testonly__.getMissingRequiredBlocks();
console.log(missing);
*/

var xml = require('../xml');
var utils = require('../utils');

var MOVE_FORWARD = {'test': 'moveForward', 'type': 'maze_moveForward'};
var TURN_LEFT = {'test': 'turnLeft', 'type': 'maze_turn', 'titles': {'DIR': 'turnLeft'}};
var TURN_RIGHT = {'test': 'turnRight', 'type': 'maze_turn', 'titles': {'DIR': 'turnRight'}};
var WHILE_LOOP = {'test': 'while', 'type': 'maze_forever'};
var IS_PATH_LEFT = {'test': 'isPathLeft', 'type': 'maze_if', 'titles': {'DIR': 'isPathLeft'}};
var IS_PATH_RIGHT = {'test': 'isPathRight', 'type': 'maze_if', 'titles': {'DIR': 'isPathRight'}};
var IS_PATH_FORWARD = {'test': 'isPathForward', 'type': 'maze_ifElse', 'titles': {'DIR': 'isPathForward'}};
var FOR_LOOP = {'test': 'for', 'type': 'controls_repeat', titles: {TIMES: '???'}};

var blockList = {
  MOVE_FORWARD: MOVE_FORWARD,
  TURN_LEFT: TURN_LEFT,
  TURN_RIGHT: TURN_RIGHT,
  WHILE_LOOP: WHILE_LOOP,
  IS_PATH_LEFT: IS_PATH_LEFT,
  IS_PATH_RIGHT: IS_PATH_RIGHT,
  IS_PATH_FORWARD: IS_PATH_FORWARD,
  FOR_LOOP: FOR_LOOP
};

module.exports = blockList;

// blocks: a string representation of the required blocks.
// TODO: Currently returns the first matching test, so both turn right and turn left
// will return turn left because it comes first in the blockList.
module.exports.parseBlocks = function(blocks) {
  var blocksXml = xml.parseElement(blocks);

  var parsedBlocks = [];
  for (var i = 0; i < blocksXml.children.length; i++) {
    var block = blocksXml.children[i];
    for (var blockTest in blockList) {
      if (blockList[blockTest].type === block.getAttribute('type')) {
        parsedBlocks.push([blockList[blockTest]]);  // Test blocks get wrapped in an array.
      }
    };
  };

  return parsedBlocks;
};

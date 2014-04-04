/*jshint multistr: true */

// todo - i think our prepoluated code counts as LOCs

var constants = require('./constants');

var tb = function(blocks) {
  return '<xml id="toolbox" style="displastartY: none;">' + blocks + '</xml>';
};

var category = function (name, blocks) {
  return '<category id="' + name + '" name="' + name + '">' + blocks + '</category>';
};

var flapBlock = '<block type="Jigsaw_flap"></block>';
var flapHeightBlock = '<block type="Jigsaw_flap_height"></block>';
var endGameBlock = '<block type="Jigsaw_endGame"></block>';
var playSoundBlock =  '<block type="Jigsaw_playSound"></block>';
var incrementScoreBlock = '<block type="Jigsaw_incrementPlayerScore"></block>';

var setSpeedBlock = '<block type="Jigsaw_setSpeed"></block>';
var setBackgroundBlock = '<block type="Jigsaw_setBackground"></block>';
var setGapHeightBlock = '<block type="Jigsaw_setGapHeight"></block>';
var setPlayerBlock = '<block type="Jigsaw_setPlayer"></block>';
var setObstacleBlock = '<block type="Jigsaw_setObstacle"></block>';
var setGroundBlock = '<block type="Jigsaw_setGround"></block>';
var setGravityBlock = '<block type="Jigsaw_setGravity"></block>';
var setScoreBlock = '<block type="Jigsaw_setScore"></block>';

var COL_WIDTH = constants.WORKSPACE_COL_WIDTH;
var COL1 = constants.WORKSPACE_BUFFER;
var COL2 = COL1 + COL_WIDTH;

var ROW_HEIGHT = constants.WORKSPACE_ROW_HEIGHT;
var ROW1 = constants.WORKSPACE_BUFFER;
var ROW2 = ROW1 + ROW_HEIGHT;
var ROW3 = ROW2 + ROW_HEIGHT;

var AVATAR_HEIGHT = constants.AVATAR_HEIGHT;
var AVATAR_WIDTH = constants.AVATAR_WIDTH;
var AVATAR_Y_OFFSET = constants.AVATAR_Y_OFFSET;

var eventBlock = function (type, x, y, child) {
  return '<block type="' + type + '" deletable="false"' +
    ' x="' + x + '"' +
    ' y="' + y + '">' +
    (child ? '<next>' + child + '</next>' : '') +
    '</block>';
};

/*
 * Configuration for all levels.
 */

 /**
  * Explanation of options:
  * goal.startX/startY
  * - start location of flag image
  * goal.moving
  * - whether the goal stays in one spot or moves at level's speed
  * goal.successCondition
  * - condition(s), which if true at any point, indicate user has successfully
  *   completed the puzzle
  * goal.failureCondition
  * - condition(s), which if true at any point, indicates the puzzle is
      complete (indicating failure if success condition not met)
  */

module.exports = {
  '1': {
    'requiredBlocks': [
      [{'test': 'flap', 'type': 'Jigsaw_flap'}]
    ],
    'obstacles': false,
    'ground': false,
    'score': false,
    'freePlay': false,
    'goal': {
      startX  : 100,
      startY: 0,
      successCondition: function () {
        return (Jigsaw.avatarY  <= 40);
      },
      failureCondition: function () {
        return Jigsaw.avatarY > Jigsaw.MAZE_HEIGHT;
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'startBlocks':
      eventBlock('Jigsaw_whenClick', COL1, ROW1) +
      eventBlock('jigsaw_test', COL2, ROW2) +
      eventBlock('jigsaw_test2', COL1, ROW2 + 50) +
      eventBlock('jigsaw_test3', COL2, ROW2 + 50)
  }


};

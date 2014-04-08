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

// todo (brent) : can i get rid of constants?

var COL_WIDTH = constants.WORKSPACE_COL_WIDTH + 30;
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

/**
 * Deep equality check for two lists.  Returns true if and only if lists have
 * the same items, in the same order.
 */
var listsEquivalent = function (list1, list2) {
  if (list1.length !== list2.length) {
    return false;
  }

  for (var i = 0; i < list1.length; i++) {
    if (list1[i] !== list2[i]) {
      return false;
    }
  }
  return true;
};


/**
 * Validates whether puzzle has been successfully put together.
 *
 * @param {string} root The type of the top level piece
 * @Param {Object} children Maps each block type to expected children types.
 */
var validatePuzzle = function (root, children) {
  var roots = Blockly.mainWorkspace.getTopBlocks();
  if (roots.length !== 1 && roots[0].type !== root) {
    return false;
  }

  var all = Blockly.mainWorkspace.getAllBlocks();
  var childKeys = Object.keys(children);
  if (all.length !== childKeys.length) {
    throw new Error('Unexpected number of blocks in workspace');
  }
  for (var i = 0; i < all.length; i++) {
    var block = all[i];
    var childTypes = block.getChildren().map(function (block) {
      return block.type;
    });
    var expectedTypes = children[childKeys[i]];
    if (!listsEquivalent(childTypes, expectedTypes)) {
      return false;
    }
  };
  return true;

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
    'image': 'smiley',
    'requiredBlocks': [
    ],
    'freePlay': false,
    'goal': {
      successCondition: function () {
        var root = "jigsaw_1A";
        var children = {
          "jigsaw_1A": ["jigsaw_1B"],
          "jigsaw_2B": []
        };
        return validatePuzzle(root, children);
      },
    },
    'scale': {
      'snapRadius': 2
    },
    'startBlocks':
      eventBlock('jigsaw_1A', 20, 20) +
      eventBlock('jigsaw_1B', 245, 65)
  },

  '2': {
    'image': 'smiley',
    'requiredBlocks': [
    ],
    'freePlay': false,
    'goal': {
      successCondition: function () {
        var root = "jigsaw_2A";
        var children = {
          "jigsaw_2A": ["jigsaw_2B"],
          "jigsaw_2B": ["jigsaw_2C"],
          "jigsaw_2C": []
        };
        return validatePuzzle(root, children);
      },
    },
    'scale': {
      'snapRadius': 2
    },
    'startBlocks':
      eventBlock('jigsaw_2A', COL2, ROW1) +
      eventBlock('jigsaw_2B', COL1, ROW2 + 50) +
      eventBlock('jigsaw_2C', COL1, ROW1 + 50)
  }


};

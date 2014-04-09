/*jshint multistr: true */

var tb = function(blocks) {
  return '<xml id="toolbox" style="displastartY: none;">' + blocks + '</xml>';
};

var jigsawBlock = function (type, x, y, child) {
  var x = x || 0;
  var y = y || 0;
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
 * @param {number} options.level Level number
 * @Param {number} options.numBlocks How many blocks there are in the level
 */
var validateSimplePuzzle = function (options) {
  var level = options.level;
  var numBlocks = options.numBlocks;

  var letters = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var types = [];
  for (var i = 1; i <= numBlocks; i++) {
    types.push('jigsaw_' + level + letters[i]);
  }

  var roots = Blockly.mainWorkspace.getTopBlocks();
  if (roots.length !== 1) {
    return false;
  }

  var depth = 1;
  var block = roots[0];
  while (depth <= numBlocks) {
    if (!block || block.type !== types[depth - 1]) {
      return false;
    }
    var children = block.getChildren();
    if (children.length > 1) {
      return false;
    }
    var block = children[0];
    depth++;
  }

  // last block shouldnt have children
  if (block !== undefined) {
    return false;
  }

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
        return validateSimplePuzzle({level: 1, numBlocks: 2});
      },
    },
    'scale': {
      'snapRadius': 2
    },
    'startBlocks':
      jigsawBlock('jigsaw_1A', 20, 20) +
      jigsawBlock('jigsaw_1B', 245, 65)
  },

  '2': {
    'image': 'smiley',
    'requiredBlocks': [
    ],
    'freePlay': false,
    'goal': {
      successCondition: function () {
        return validateSimplePuzzle({level: 2, numBlocks: 3});
      },
    },
    'scale': {
      'snapRadius': 2
    },
    'startBlocks':
      jigsawBlock('jigsaw_2A', 260, 20) +
      jigsawBlock('jigsaw_2B', 120, 190) +
      jigsawBlock('jigsaw_2C', 20, 70)
  },

  '3': {
    'image': 'smiley',
    'requiredBlocks': [
    ],
    'freePlay': false,
    'goal': {
      successCondition: function () {
        return validateSimplePuzzle({level: 3, numBlocks: 2});
      },
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(
        jigsawBlock('jigsaw_3B') +
        jigsawBlock('jigsaw_3A')
      ),
    'startBlocks': ''

  },

  '4': {
    'image': 'smiley',
    'requiredBlocks': [
    ],
    'freePlay': false,
    'goal': {
      successCondition: function () {
        return validateSimplePuzzle({level: 4, numBlocks: 5});
      },
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(
        jigsawBlock('jigsaw_4B') +
        jigsawBlock('jigsaw_4A') +
        jigsawBlock('jigsaw_4D') +
        jigsawBlock('jigsaw_4C') +
        jigsawBlock('jigsaw_4E')
      ),
    'startBlocks': ''

  }


};

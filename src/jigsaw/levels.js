/*jshint multistr: true */

var tb = function(blocks) {
  return '<xml id="toolbox" style="displastartY: none;">' + blocks + '</xml>';
};

var jigsawBlock = function (type, x, y, child) {
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
  if (roots.length !== 1 || roots[0].type !== root) {
    return false;
  }

  var all = Blockly.mainWorkspace.getAllBlocks();
  var childKeys = Object.keys(children);
  if (all.length !== childKeys.length) {
    throw new Error('Unexpected number of blocks in workspace');
  }
  for (var i = 0; i < all.length; i++) {
    var block = all[i];
    if (!children[block.type]) {
      throw new Error('Unexpected block ' + block.type);
    }
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
          "jigsaw_1B": []
        };
        return validatePuzzle(root, children);
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
        var root = "jigsaw_3A";
        var children = {
          "jigsaw_3A": ["jigsaw_3B"],
          "jigsaw_3B": []
        };
        return validatePuzzle(root, children);
      },
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(
        jigsawBlock('jigsaw_3B', 245, 65) +
        jigsawBlock('jigsaw_3A', 20, 20)
      ),
    'startBlocks': ''

  }


};

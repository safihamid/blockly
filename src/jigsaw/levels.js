/*jshint multistr: true */

var createToolbox = function(blocks) {
  return '<xml id="toolbox" style="displastartY: none;">' + blocks + '</xml>';
};

var jigsawBlock = function (type, x, y, child) {
  x = x || 0;
  y = y || 0;
  return '<block type="' + type + '" deletable="false"' +
    ' x="' + x + '"' +
    ' y="' + y + '">' +
    (child ? '<next>' + child + '</next>' : '') +
    '</block>';
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
    block = children[0];
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

module.exports = {
  '1': {
    'requiredBlocks': [],
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
    'requiredBlocks': [],
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
    'requiredBlocks': [],
    'freePlay': false,
    'goal': {
      successCondition: function () {
        return validateSimplePuzzle({level: 3, numBlocks: 3});
      },
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      createToolbox(
        jigsawBlock('jigsaw_3C') +
        jigsawBlock('jigsaw_3B') +
        jigsawBlock('jigsaw_3A')
      ),
    'startBlocks': ''

  },

  '4': {
    'image': 'smiley',
    'requiredBlocks': [],
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
      createToolbox(
        jigsawBlock('jigsaw_4B') +
        jigsawBlock('jigsaw_4A') +
        jigsawBlock('jigsaw_4D') +
        jigsawBlock('jigsaw_4C') +
        jigsawBlock('jigsaw_4E')
      ),
    'startBlocks': ''

  }
};

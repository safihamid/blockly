/*jshint multistr: true */

var createToolbox = require('../block_utils').createToolbox;

var jigsawBlock = function (type, x, y, child, childType) {
  var childAttr = '';
  x = x || 0;
  y = y || 0;
  childType = childType || "next";
  if (childType === 'statement') {
    childAttr = " name='child'";
  }
  return '<block type="' + type + '" deletable="true"' +
    ' x="' + x + '"' +
    ' y="' + y + '">' +
    (child ? '<' + childType + childAttr + '>' + child + '</' + childType + '>' : '') +
    '</block>';
};

/**
 * Validates whether puzzle has been successfully put together.
 *
 * @param {string[]} list of types
 * @param {number} options.level Level number
 * @Param {number} options.numBlocks How many blocks there are in the level
 */
var validateSimplePuzzle = function (types, options) {
  var numBlocks;
  if (types) {
    numBlocks = types.length;
  } else {
    var letters = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var level = options.level;
    numBlocks = options.numBlocks;

    types = [];
    for (var i = 1; i <= numBlocks; i++) {
      types.push('jigsaw_' + level + letters[i]);
    }
  }

  var roots = Blockly.mainWorkspace.getTopBlocks();
  if (roots.length !== 1) {
    return false;
  }

  var depth = 0;
  var block = roots[0];
  while (depth < numBlocks) {
    if (!block || block.type !== types[depth]) {
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
    instructionsIcon: 'smiley',
    image: {
      name: 'smiley',
      width: 200,
      height: 200
    },
    numBlocks: 1,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return Jigsaw.BLOCK1_CLICKED;
      }
    },
    startBlocks:
      jigsawBlock('jigsaw_1A', 20, 20)
  },
  '2': {
    instructionsIcon: 'smiley',
    image: {
      name: 'smiley',
      width: 200,
      height: 200
    },
    ghost: {
      x: 400,
      y: 100
    },
    numBlocks: 1,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        // need to be finished drag
        if (Blockly.mainWorkspace.dragMode) {
          return false;
        }
        var pos = Blockly.mainWorkspace.getAllBlocks()[0].getRelativeToSurfaceXY();
        // how close to ghost?
        var dx = Math.abs(400 - pos.x);
        var dy = Math.abs(100 - pos.y);
        console.log(dx + dy);
        return dx + dy < 80;
      }
    },
    startBlocks:
      jigsawBlock('jigsaw_2A', 20, 20)
  },
  '3': {
    instructionsIcon: 'smiley',
    image: {
      name: 'smiley',
      width: 200,
      height: 200
    },
    ghost: {
      x: 400,
      y: 100
    },
    numBlocks: 2,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 3, numBlocks: 2});
      },
    },
    startBlocks:
      jigsawBlock('jigsaw_3A', 400, 100) +
      jigsawBlock('jigsaw_3B', 100, 220)
  },

  '4': {
    instructionsIcon: 'smiley',
    image: {
      name: 'smiley',
      width: 200,
      height: 200
    },
    ghost: {
      x: 400,
      y: 100
    },
    numBlocks: 2,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 4, numBlocks: 2});
      },
    },
    startBlocks:
      jigsawBlock('jigsaw_4A', 100, 140) +
      jigsawBlock('jigsaw_4B', 400, 200)
  },

  '5': {
    instructionsIcon: 'smiley',
    image: {
      name: 'smiley',
      width: 200,
      height: 200
    },
    ghost: {
      x: 400,
      y: 100
    },
    numBlocks: 3,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 5, numBlocks: 3});
      },
    },
    startBlocks:
      jigsawBlock('jigsaw_5A', 100, 20) +
      jigsawBlock('jigsaw_5B', 100, 140) +
      jigsawBlock('jigsaw_5C', 100, 280)
  },

  '6': {
    instructionsIcon: 'smiley',
    image: {
      name: 'smiley',
      width: 200,
      height: 200
    },
    ghost: {
      x: 400,
      y: 100
    },
    numBlocks: 3,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 6, numBlocks: 3});
      },
    },
    startBlocks:
      jigsawBlock('jigsaw_6B', 100, 20) +
      jigsawBlock('jigsaw_6A', 100, 140) +
      jigsawBlock('jigsaw_6C', 100, 280)
  },

  '7': {
    instructionsIcon: 'artist',
    image: {
      name: 'artist',
      width: 200,
      height: 200
    },
    ghost: {
      x: 400,
      y: 100
    },
    numBlocks: 3,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 7, numBlocks: 3});
      },
    },
    startBlocks:
      jigsawBlock('jigsaw_7B', 100, 20) +
      jigsawBlock('jigsaw_7A', 100, 140) +
      jigsawBlock('jigsaw_7C', 100, 280)
  },

  '8': {
    instructionsIcon: 'artist',
    image: {
      name: 'artist',
      width: 200,
      height: 200
    },
    ghost: {
      x: 400,
      y: 100
    },
    numBlocks: 3,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 8, numBlocks: 3});
      },
    },
    startBlocks:
      jigsawBlock('jigsaw_8C', 100, 20) +
      jigsawBlock('jigsaw_8B', 100, 140) +
      jigsawBlock('jigsaw_8A', 100, 280)
  },

  '9': {
    instructionsIcon: 'artist',
    image: {
      name: 'artist',
      width: 200,
      height: 200
    },
    ghost: {
      x: 400,
      y: 100
    },
    numBlocks: 3,
    requiredBlocks: [],
    freePlay: false,
    notchedEnds: true,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 9, numBlocks: 3});
      },
    },
    startBlocks:
      jigsawBlock('jigsaw_9B', 100, 20, jigsawBlock('jigsaw_9C', 0, 0, jigsawBlock('jigsaw_9A', 0, 0)))
  },

  '10': {
    instructionsIcon: 'artist',
    image: {
      name: 'artist',
      width: 200,
      height: 200
    },
    ghost: {
      x: 400,
      y: 100
    },
    numBlocks: 3,
    requiredBlocks: [],
    freePlay: false,
    notchedEnds: true,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 10, numBlocks: 3});
      },
    },
    startBlocks:
      jigsawBlock('jigsaw_10A', 100, 20, jigsawBlock('jigsaw_10C', 0, 0, jigsawBlock('jigsaw_10B', 0, 0)))
  },

  '11': {
    instructionsIcon: 'blocks',
    image: {
      name: 'blocks',
      width: 140,
      height: 140
    },
    ghost: {
      x: 200,
      y: 12
    },
    numBlocks: 0,
    requiredBlocks: [],
    freePlay: false,
    notchedEnds: true,
    largeNotches: false,
    snapRadius: 30,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(['jigsaw_repeat', 'jigsaw_purple',
          'jigsaw_blue', 'jigsaw_green'], {});
      },
    },
    startBlocks: jigsawBlock('jigsaw_repeat', 20, 20,
      jigsawBlock('jigsaw_purple', 0, 0, jigsawBlock('jigsaw_blue')), 'statement'),
    toolbox: createToolbox(
      jigsawBlock('jigsaw_green')
    )
  },

  '12': {
    instructionsIcon: 'blocks',
    image: {
      name: 'blocks',
      width: 140,
      height: 140
    },
    ghost: {
      x: 200,
      y: 12
    },
    numBlocks: 0,
    requiredBlocks: [],
    freePlay: false,
    notchedEnds: true,
    largeNotches: false,
    snapRadius: 30,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(['jigsaw_repeat', 'jigsaw_purple',
          'jigsaw_blue', 'jigsaw_green'], {});
      },
    },
    startBlocks: jigsawBlock('jigsaw_repeat', 20, 20),
    toolbox: createToolbox(
      jigsawBlock('jigsaw_green') +
      jigsawBlock('jigsaw_purple') +
      jigsawBlock('jigsaw_blue')
    )
  },

  '21': {
    instructionsIcon: 'smiley',
    image: {
      name: 'smiley',
      width: 300,
      height: 300,
    },
    ghost: {
      x: 700,
      y: 50
    },
    numBlocks: 3,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 2, numBlocks: 3});
      },
    },
    startBlocks:
      jigsawBlock('jigsaw_21A', 260, 20) +
      jigsawBlock('jigsaw_21B', 120, 190) +
      jigsawBlock('jigsaw_21C', 20, 70)
  },

  '22': {
    instructionsIcon: 'artist',
    image: {
      name: 'artist',
      width: 200,
      height: 200
    },
    numBlocks: 3,
    notchedEnds: true,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 3, numBlocks: 3});
      },
    },
    ghost: {
      x: 100,
      y: 50
    },
    toolbox: createToolbox(
      jigsawBlock('jigsaw_22C') +
      jigsawBlock('jigsaw_22B') +
      jigsawBlock('jigsaw_22A')
    ),
    startBlocks: ''
  },

  '23': {
    instructionsIcon: 'smiley',
    image: {
      name: 'smiley',
      width: 400,
      height: 400
    },
    ghost: {
      x: 100,
      y: 50
    },
    numBlocks: 5,
    requiredBlocks: [],
    freePlay: false,
    largeNotches: true,
    goal: {
      successCondition: function () {
        return validateSimplePuzzle(null, {level: 4, numBlocks: 5});
      },
    },
    toolbox: createToolbox(
      jigsawBlock('jigsaw_23B') +
      jigsawBlock('jigsaw_23A') +
      jigsawBlock('jigsaw_23D') +
      jigsawBlock('jigsaw_23C') +
      jigsawBlock('jigsaw_23E')
    ),
    startBlocks: ''
  }
};

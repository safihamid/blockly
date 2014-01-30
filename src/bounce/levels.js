var Direction = require('./tiles').Direction;

//TODO: Fix hacky level-number-dependent toolbox.
var toolbox = function(page, level) {
  return require('./toolbox.xml')({
    page: page,
    level: level
  });
};

//TODO: Fix hacky level-number-dependent startBlocks.
var startBlocks = function(page, level) {
  return require('./startBlocks.xml')({
    page: page,
    level: level
  });
};


/*
 * Configuration for all levels.
 */
module.exports = {

  '1_1': {
    'toolbox': toolbox(1, 1),
    'ideal': 3,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'bounce_moveForward'}]
    ],
    'scale': {
      'snapRadius': 2,
      'stepSpeed': 12
    },
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 1, 1, 1, 1, 1, 1, 3],
      [0, 0, 0, 0, 0, 6, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'startBlocks': startBlocks(1, 1)
  }
};

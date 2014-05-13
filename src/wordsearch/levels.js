var Direction = require('./tiles').Direction;
var karelLevels = require('./karelLevels');
var reqBlocks = require('./requiredBlocks');
var blockUtils = require('../block_utils');

//TODO: Fix hacky level-number-dependent toolbox.
var toolbox = function (page, level) {
    return blockUtils.createToolbox(
    blockUtils.blockOfType('maze_moveNorth') +
    blockUtils.blockOfType('maze_moveSouth') +
    blockUtils.blockOfType('maze_moveEast') +
    blockUtils.blockOfType('maze_moveWest'));

    //return require('./toolboxes/wordsearch.xml')({
    //    page: page,
    //    level: level
    //});
};

//TODO: Fix hacky level-number-dependent startBlocks.
var startBlocks = function (page, level) {
    return require('./startBlocks.xml')({
        page: page,
        level: level
    });
};

/*
 * Configuration for all levels.
 */
module.exports = {

    // Formerly Page 2

    'k_1': {
        'toolbox': toolbox('k', 1),
        'ideal': 3,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST],
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 27, 30, 53, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        'startBlocks': startBlocks('k', 1)
    },
    'k_2': {
        'toolbox': toolbox('k', 2),
        'ideal': 3,
        'requiredBlocks': [
          [reqBlocks.MOVE_SOUTH],
        ],
        'startDirection': Direction.SOUTH,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 2, 0, 0, 0, 0],
          [0, 0, 0, 28, 0, 0, 0, 0],
          [0, 0, 0, 14, 0, 0, 0, 0],
          [0, 0, 0, 59, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        'startBlocks': startBlocks('k', 2)
    },
    'k_3': {
        'toolbox': toolbox('k', 3),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 22, 24, 31, 44, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        'startBlocks': startBlocks('k', 3)
    },
    'k_4': {
        'toolbox': toolbox('k', 4),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_SOUTH]
        ],
        'startDirection': Direction.SOUTH,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 0, 0, 0, 0, 0],
          [0, 0, 12, 0, 0, 0, 0, 0],
          [0, 0, 24, 0, 0, 0, 0, 0],
          [0, 0, 13, 0, 0, 0, 0, 0],
          [0, 0, 44, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_5': {
        'toolbox': toolbox('k', 5),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_NORTH],
        ],
        'startDirection': Direction.NORTH,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 62, 0, 0, 0, 0, 0, 0],
          [0, 10, 0, 0, 0, 0, 0, 0],
          [0, 27, 0, 0, 0, 0, 0, 0],
          [0, 13, 0, 0, 0, 0, 0, 0],
          [0, 2, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_6': {
        'toolbox': toolbox('k', 6),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 19, 30, 22, 0, 0],
          [0, 0, 0, 0, 0, 55, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_7': {
        'toolbox': toolbox('k', 7),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 59, 0, 0, 0],
          [0, 0, 0, 0, 33, 0, 0, 0],
          [0, 0, 2, 23, 14, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_8': {
        'toolbox': toolbox('k', 8),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 32, 0, 0, 0, 0],
          [0, 0, 0, 14, 28, 59, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_9': {
        'toolbox': toolbox('k', 9),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 28, 59, 0, 0, 0],
          [0, 2, 14, 10, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_10': {
        'toolbox': toolbox('k', 10),
        'ideal': 5,
        'requiredBlocks': [
          [reqBlocks.MOVE_SOUTH],
        ],
        'startDirection': Direction.SOUTH,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 0, 0, 0, 0, 0],
          [0, 0, 23, 0, 0, 0, 0, 0],
          [0, 0, 24, 0, 0, 0, 0, 0],
          [0, 0, 27, 0, 0, 0, 0, 0],
          [0, 0, 29, 0, 0, 0, 0],
          [0, 0, 47, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_11': {
        'toolbox': toolbox('k', 11),
        'ideal': 5,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 28, 24, 0, 0, 0],
          [0, 0, 0, 0, 30, 0, 0, 0],
          [0, 0, 0, 0, 29, 0, 0, 0],
          [0, 0, 0, 0, 47, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_12': {
        'toolbox': toolbox('k', 12),
        'ideal': 5,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.NORTH,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 24, 21, 24, 57, 0, 0, 0],
          [0, 12, 0, 0, 0, 0, 0, 0],
          [0, 2, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_13': {
        'toolbox': toolbox('k', 13),
        'ideal': 5,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 2, 13, 14, 0, 0, 0, 0],
          [0, 0, 0, 11, 0, 0, 0, 0],
          [0, 0, 0, 30, 46, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_14': {
        'toolbox': toolbox('k', 14),
        'ideal': 5,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST],
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 28, 14, 59, 0, 0],
          [0, 0, 0, 14, 0, 0, 0, 0],
          [0, 0, 2, 27, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_15': {
        'toolbox': toolbox('k', 15),
        'ideal': 5,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.SOUTH,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 0, 0, 0, 0, 0],
          [0, 0, 10, 0, 0, 0, 0, 0],
          [0, 0, 11, 24, 0, 0, 0, 0],
          [0, 0, 0, 31, 44, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_16': {
        'toolbox': toolbox('k', 16),
        'ideal': 5,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 62, 0, 0, 0],
          [0, 0, 0, 0, 24, 0, 0, 0],
          [0, 0, 0, 14, 21, 0, 0, 0],
          [0, 0, 2, 11, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_17': {
        'toolbox': toolbox('k', 17),
        'ideal': 6,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.SOUTH,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 0, 0, 0, 0, 0],
          [0, 0, 28, 26, 0, 0, 0, 0],
          [0, 0, 0, 30, 10, 0, 0, 0],
          [0, 0, 0, 0, 27, 0, 0, 0],
          [0, 0, 0, 0, 44, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    'k_18': {
        'toolbox': toolbox('k', 18),
        'ideal': 7,
        'requiredBlocks': [
          [reqBlocks.MOVE_EAST]
        ],
        'startDirection': Direction.EAST,
        'map': [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 10, 52, 0],
          [0, 0, 0, 0, 0, 27, 0, 0],
          [0, 0, 0, 27, 24, 16, 0, 0],
          [0, 0, 2, 25, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    }
};



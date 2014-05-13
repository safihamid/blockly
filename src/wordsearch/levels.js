var Direction = require('./tiles').Direction;
var karelLevels = require('./karelLevels');
var reqBlocks = require('./requiredBlocks');
var blockUtils = require('../block_utils');

//TODO: Fix hacky level-number-dependent toolbox.
var toolbox = function (page, level) {
    return require('./toolboxes/wordsearch.xml')({
        page: page,
        level: level
    });
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

    '2_1': {
        'toolbox': toolbox(2, 1),
        'ideal': 3,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
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
        'startBlocks': startBlocks(2, 1)
    },
    '2_2': {
        'toolbox': toolbox(2, 2),
        'ideal': 2,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
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
        'startBlocks': startBlocks(2, 2)
    },
    '2_3': {
        'toolbox': toolbox(2, 3),
        'ideal': 5,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD]
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
        'startBlocks': startBlocks(2, 3)
    },
    '2_4': {
        'toolbox': toolbox(2, 4),
        'ideal': 8,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD]
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
    '2_5': {
        'toolbox': toolbox(2, 5),
        'ideal': 2,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.FOR_LOOP]
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
    '2_6': {
        'toolbox': toolbox(2, 6),
        'ideal': 3,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.FOR_LOOP],
          [reqBlocks.TURN_RIGHT]
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
    '2_7': {
        'toolbox': toolbox(2, 7),
        'ideal': 5,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.FOR_LOOP],
          [reqBlocks.TURN_LEFT]
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
    '2_8': {
        'toolbox': toolbox(2, 8),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.FOR_LOOP],
          [reqBlocks.TURN_RIGHT]
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
        ],
        'startBlocks': startBlocks(2, 8)
    },
    '2_9': {
        'toolbox': toolbox(2, 9),
        'ideal': 2,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP],
          [reqBlocks.TURN_LEFT]
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
    '2_10': {
        'toolbox': toolbox(2, 10),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP]
        ],
        'startDirection': Direction.NORTH,
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
    '2_11': {
        'toolbox': toolbox(2, 11),
        'ideal': 5,
        'scale': {
            'stepSpeed': 3
        },
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP],
          [reqBlocks.TURN_RIGHT]
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
    '2_12': {
        'toolbox': toolbox(2, 12),
        'ideal': 5,
        'scale': {
            'stepSpeed': 3
        },
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP],
          [reqBlocks.TURN_RIGHT]
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
    '2_13': {
        'toolbox': toolbox(2, 13),
        'ideal': 4,
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP],
          [reqBlocks.TURN_RIGHT],
          [reqBlocks.TURN_LEFT]
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
        ],
        'startBlocks': startBlocks(2, 13)
    },
    '2_14': {
        'toolbox': toolbox(2, 14),
        'ideal': 4,
        'scale': {
            'stepSpeed': 2
        },
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP],
          [reqBlocks.TURN_RIGHT],
          [reqBlocks.TURN_LEFT]          
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
        ],
        'failForOther1Star': true,
        'showPreviousLevelButton': true
    },
    '2_15': {
        'toolbox': toolbox(2, 15),
        'ideal': 4,
        'scale': {
            'stepSpeed': 2
        },
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP],
          [reqBlocks.TURN_RIGHT],
          [reqBlocks.TURN_LEFT]
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
    '2_16': {
        'toolbox': toolbox(2, 16),
        'ideal': 4,
        'scale': {
            'stepSpeed': 2
        },
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP],
          [reqBlocks.TURN_RIGHT],
          [reqBlocks.TURN_LEFT]
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
    '2_17': {
        'toolbox': toolbox(2, 17),
        'ideal': 4,
        'scale': {
            'stepSpeed': 2
        },
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP],
          [reqBlocks.TURN_RIGHT],
          [reqBlocks.TURN_LEFT]
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
    '2_18': {
        'toolbox': toolbox(2, 18),
        'ideal': 4,
        'scale': {
            'stepSpeed': 2
        },
        'requiredBlocks': [
          [reqBlocks.MOVE_FORWARD],
          [reqBlocks.WHILE_LOOP],
          [reqBlocks.TURN_RIGHT],
          [reqBlocks.TURN_LEFT]
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

// Merge in Karel levels.
for (var levelId in karelLevels) {
    module.exports['karel_' + levelId] = karelLevels[levelId];
}


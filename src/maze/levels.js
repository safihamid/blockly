var Direction = require('./tiles').Direction;
var karelLevels = require('./karelLevels');

//TODO: Fix hacky level-number-dependent toolbox.
var toolbox = function(page, level) {
  return require('./toolboxes/maze.xml')({
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

  // Formerly page 1

  '1_1': {
    'toolbox': toolbox(1, 1),
    'ideal': 2,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}]
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
      [0, 0, 2, 1, 3, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'singleTopBlock': true
  },
  '1_2': {
    'toolbox': toolbox(1, 2),
    'ideal': 5,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnLeft', 'type': 'maze_turn', 'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'turnRight', 'type': 'maze_turn', 'titles': {'DIR': 'turnRight'}}]
    ],
    'scale': {
      'stepSpeed': 10
    },
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 3, 0, 0, 0],
      [0, 0, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'singleTopBlock': true
  },
  '1_3': {
    'toolbox': toolbox(1, 3),
    'ideal': 2,
    'requiredBlocks': [
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'moveForward', 'type': 'maze_moveForward'}]
    ],
    'scale': {
      'stepSpeed': 8
    },
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 1, 1, 1, 1, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '1_4': {
    'toolbox': toolbox(1, 4),
    'ideal': 5,
    'requiredBlocks': [
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'turnLeft', 'type': 'maze_turn', 'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'turnRight', 'type': 'maze_turn', 'titles': {'DIR': 'turnRight'}}],
      [{'test': 'moveForward', 'type': 'maze_moveForward'}]
    ],
    'scale': {
      'stepSpeed': 6
    },
    'startDirection': Direction.EAST,
    /**
     *  Note, the path continues past the start and the goal in both directions.
     *  This is intentional so kids see the maze is about getting from the start
     *  to the finish and not necessarily about moving over every part of the maze,
     *  'mowing the lawn' as Neil calls it.
     */
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 3, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 2, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0]
    ]
  },
  '1_5': {
    'toolbox': toolbox(1, 5),
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'isPathLeft', 'type': 'maze_if', 'titles': {'DIR': 'isPathLeft'}}],
      [{'test': 'turnLeft', 'type': 'maze_turn', 'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'moveForward', 'type': 'maze_moveForward'}]
    ],
    'scale': {
      'stepSpeed': 6
    },
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 2, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '1_6': {
    'toolbox': toolbox(1, 6),
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'isPathLeft', 'type': 'maze_if', 'titles': {'DIR': 'isPathLeft'}}],
      [{'test': 'turnLeft', 'type': 'maze_turn', 'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'moveForward', 'type': 'maze_moveForward'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 1, 1, 3, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 2, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '1_7': {
    'toolbox': toolbox(1, 7),
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'isPathRight', 'type': 'maze_if', 'titles': {'DIR': 'isPathRight'}}],
      [{'test': 'moveForward', 'type': 'maze_moveForward'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 1, 3, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '1_8': {
    'toolbox': toolbox(1, 8),
    'ideal': 6,
    'requiredBlocks': [
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'isPathRight', 'type': 'maze_if', 'titles': {'DIR': 'isPathRight'}}],
      [{'test': 'isPathLeft', 'type': 'maze_if', 'titles': {'DIR': 'isPathLeft'}}],
      [{'test': 'turnLeft', 'type': 'maze_turn', 'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'turnRight', 'type': 'maze_turn', 'titles': {'DIR': 'turnRight'}}],
      [{'test': 'moveForward', 'type': 'maze_moveForward'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 0, 0],
      [0, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 2, 1, 1, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '1_9': {
    'toolbox': toolbox(1, 9),
    'ideal': 6,
    'requiredBlocks': [
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'isPathForward', 'type': 'maze_ifElse',
                                'titles': {'DIR': 'isPathForward'}}],
      [{'test': 'turnLeft', 'type': 'maze_turn', 'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'moveForward', 'type': 'maze_moveForward'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [3, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 2, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '1_10': {
    'toolbox': toolbox(1, 10),
    'ideal': 5,
    'requiredBlocks': [
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'isPathForward', 'type': 'maze_ifElse',
                                'titles': {'DIR': 'isPathForward'}}],
      [{'test': 'turnRight', 'type': 'maze_turn', 'titles': {'DIR': 'turnRight'}}],
      [{'test': 'moveForward', 'type': 'maze_moveForward'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 1, 3, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },

  // Formerly Page 2

  '2_1': {
    'toolbox': toolbox(2, 1),
    'ideal': 3,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 1, 1, 3, 0, 0],
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
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
    ],
    'startDirection': Direction.SOUTH,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 3, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'startBlocks': startBlocks(2, 2)
  },
  '2_2_5': {
    'toolbox': toolbox(2, 3),
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0],
      [0, 0, 2, 1, 1, 0, 0, 0],
      [0, 0, 4, 0, 3, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'startBlocks': startBlocks(2, 3)
  },
  '2_3': {
    'toolbox': toolbox(2, 3),
    'ideal': 5,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 4, 1, 3, 0, 0, 0],
      [0, 0, 2, 1, 0, 0, 0, 0],
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
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnLeft',
       'type': 'maze_turn',
       'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 4, 0, 3, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '2_5': {
    'toolbox': toolbox(2, 5),
    'ideal': 2,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'for', 'type': 'controls_repeat', titles: {TIMES: '???'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 1, 1, 1, 1, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '2_6': {
    'toolbox': toolbox(2, 6),
    'ideal': 3,
    'requiredBlocks': [
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}],
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'for', 'type': 'controls_repeat', titles: {TIMES: '???'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 3, 0, 0, 0]
    ]
  },
  '2_7': {
    'toolbox': toolbox(2, 7),
    'ideal': 5,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'for', 'type': 'controls_repeat', titles: {TIMES: '???'}}],
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 2, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '2_8': {
    'toolbox': toolbox(2, 8),
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'for', 'type': 'controls_repeat', titles: {TIMES: '???'}}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 3, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'startBlocks': startBlocks(2, 8)
  },
  '2_9': {
    'toolbox': toolbox(2, 9),
    'ideal': 2,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'while', 'type': 'maze_forever'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 1, 1, 1, 1, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '2_10': {
    'toolbox': toolbox(2, 10),
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'while', 'type': 'maze_forever'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 2, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
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
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 3, 1],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0],
      [2, 1, 0, 0, 0, 0, 0, 0]
    ]
  },
  '2_12': {
    'toolbox': toolbox(2, 12),
    'ideal': 5,
    'scale': {
      'stepSpeed': 3
    },
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'while', 'type': 'maze_forever'}],
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [1, 0, 0, 0, 0, 0, 0, 0],
      [1, 2, 4, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 3, 0],
      [0, 0, 0, 0, 0, 0, 1, 1]
    ]
  },
  '2_13': {
    'toolbox': toolbox(2, 13),
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 2, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 4, 0, 0]
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
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}],
      [{'test': 'isPathRight',
        'type': 'maze_if',
        'titles': {'DIR': 'isPathRight'}}],
      [{'test': 'while', 'type': 'maze_forever'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 4, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 2, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 4],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 3, 1, 1, 1, 1, 0, 0],
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
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'isPathLeft',
        'type': 'maze_if',
        'titles': {'DIR': 'isPathLeft'}}],
      [{'test': 'while', 'type': 'maze_forever'}]
    ],
    'startDirection': Direction.NORTH,
    'map': [
      [0, 0, 0, 4, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 3, 0, 1, 0, 0],
      [0, 1, 0, 1, 0, 1, 1, 4],
      [0, 1, 1, 1, 0, 2, 0, 0],
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
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}],
      [{'test': 'isPathRight',
        'type': 'maze_if',
        'titles': {'DIR': 'isPathRight'}}],
      [{'test': 'while', 'type': 'maze_forever'}]
    ],
    'startDirection': Direction.SOUTH,
    'map': [
      [0, 0, 0, 4, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 2, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 4],
      [0, 1, 1, 3, 0, 1, 0, 4],
      [0, 1, 0, 0, 0, 1, 0, 1],
      [0, 1, 1, 1, 1, 1, 1, 1],
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
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'isPathForward',
        'type': 'maze_ifElse',
        'titles': {'DIR': 'isPathForward'}}],
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'while', 'type': 'maze_forever'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 4, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [3, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 1, 0, 0, 1, 0],
      [1, 1, 1, 4, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 2, 1, 0],
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
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'isPathForward',
        'type': 'maze_ifElse',
        'titles': {'DIR': 'isPathForward'}}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}],
      [{'test': 'while', 'type': 'maze_forever'}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 4, 0, 4, 0, 4, 0],
      [0, 0, 1, 0, 1, 0, 1, 0],
      [0, 2, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 0],
      [0, 1, 3, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '2_19': {
    'toolbox': toolbox(2, 19),
    'ideal': 6,
    'scale': {
      'stepSpeed': 2
    },
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}]
    ],
    'startDirection': Direction.NORTH,
    'map': [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 1, 1, 1],
      [1, 0, 1, 0, 3, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1],
      [2, 0, 1, 1, 1, 1, 1, 1]
     ],
    'startBlocks': startBlocks(2, 19)
   },

  // Copied levels with editCode enabled
  '3_1': {
    'toolbox': toolbox(3, 1),
    'ideal': 2,
    'editCode': true,
    'codeFunctions': [
      {'func': 'move', 'alias': 'Maze.moveForward();'},
      {'func': 'turnleft', 'alias': 'Maze.turnLeft();'},
      {'func': 'turnright', 'alias': 'Maze.turnRight();'},
    ],
    'requiredBlocks': [
       [{'test': 'moveForward', 'type': 'maze_moveForward'}],
     ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 1, 3, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '3_2': {
    'toolbox': toolbox(3, 2),
    'ideal': 3,
    'editCode': true,
    'codeFunctions': [
      {'func': 'move', 'alias': 'Maze.moveForward();'},
      {'func': 'turnleft', 'alias': 'Maze.turnLeft();'},
      {'func': 'turnright', 'alias': 'Maze.turnRight();'},
    ],
    'requiredBlocks': [
       [{'test': 'moveForward', 'type': 'maze_moveForward'}],
     ],
    'startDirection': Direction.SOUTH,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 3, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '3_3': {
    'toolbox': toolbox(3, 3),
    'ideal': 5,
    'editCode': true,
    'codeFunctions': [
      {'func': 'move', 'alias': 'Maze.moveForward();'},
      {'func': 'turnleft', 'alias': 'Maze.turnLeft();'},
      {'func': 'turnright', 'alias': 'Maze.turnRight();'},
    ],
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnLeft',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnLeft'}}],
      [{'test': 'turnRight',
        'type': 'maze_turn',
        'titles': {'DIR': 'turnRight'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 4, 1, 3, 0, 0, 0],
      [0, 0, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  '3_4': {
    'toolbox': toolbox(3, 4),
    'ideal': 7,
    'editCode': true,
    'codeFunctions': [
      {'func': 'move', 'alias': 'Maze.moveForward();'},
      {'func': 'turnleft', 'alias': 'Maze.turnLeft();'},
      {'func': 'turnright', 'alias': 'Maze.turnRight();'},
    ],
    'requiredBlocks': [
      [{'test': 'moveForward', 'type': 'maze_moveForward'}],
      [{'test': 'turnLeft',
       'type': 'maze_turn',
       'titles': {'DIR': 'turnLeft'}}]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 4, 3, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  }
};

// Merge in Karel levels.
for (var levelId in karelLevels) {
  module.exports['karel_' + levelId] = karelLevels[levelId];
}

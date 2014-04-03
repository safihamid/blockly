/*jshint multistr: true */

var Direction = require('./tiles').Direction;

var tb = function(blocks) {
  return '<xml id="toolbox" style="display: none;">' + blocks + '</xml>';
};

/*
 * Configuration for all levels.
 */
module.exports = {

  '1': {
    'requiredBlocks': [
      [{'test': 'move', 'type': 'studio_move'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton'
    ],
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [8, 0, 0,16, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="studio_move"></block>'),
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"></block>'
  },
  '2': {
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'move', 'type': 'studio_move'}],
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton'
    ],
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [8, 0, 0,16, 0, 0, 0, 8],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="studio_move"></block>'),
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenRight" deletable="false" x="180" y="20"></block>'
  },
  '3': {
    'requiredBlocks': [
      [{'test': 'moveUp', 'type': 'studio_moveUp'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'upButton'
    ],
    'map': [
      [0, 0, 0, 8, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0,16, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="studio_move"></block>'),
    'startBlocks':
     '<block type="studio_whenUp" deletable="false" x="20" y="20"></block>'
  },
  '4': {
    'requiredBlocks': [
      [{'test': 'move', 'type': 'studio_move'}],
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton',
      'downButton',
      'upButton'
    ],
    'map': [
      [0, 0, 8, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 8],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [8, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0,16, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 8, 0, 0]
    ],
    'toolbox':
      tb('<block type="studio_move"></block>'),
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenRight" deletable="false" x="180" y="20"></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="120"></block> \
      <block type="studio_whenDown" deletable="false" x="180" y="120"></block>'
  },
  '99': {
    'requiredBlocks': [
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton',
      'downButton',
      'upButton'
    ],
    'freePlay': true,
    'map': [
      [1, 1, 2, 2, 2, 2, 1, 1],
      [1, 0,16, 0, 0,16, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0,16, 0, 0,16, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0,16, 0, 0,16, 0, 1]
    ],
    'toolbox':
      tb('<block type="studio_whenSpriteClicked"></block> \
          <block type="studio_whenSpriteCollided"></block> \
          <block type="studio_move"></block> \
          <block type="studio_playSound"></block> \
          <block type="studio_incrementScore"></block> \
          <block type="studio_setSpriteSpeed"></block> \
          <block type="studio_setBackground"></block> \
          <block type="studio_setSprite"></block>'),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenLeft" deletable="false" x="20" y="120"></block> \
      <block type="studio_whenRight" deletable="false" x="180" y="120"></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="220"></block> \
      <block type="studio_whenDown" deletable="false" x="180" y="220"></block> \
      <block type="studio_whenPaddleCollided" deletable="false" x="20" y="320"></block> \
      <block type="studio_whenWallCollided" deletable="false" x="180" y="320"></block>'
  },
};

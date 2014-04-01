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
      [{'test': 'moveLeft', 'type': 'studio_moveLeft'}]
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
      tb('<block type="studio_moveLeft"></block> \
          <block type="studio_moveRight"></block>'),
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"></block>'
  },
  '2': {
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'studio_moveRight'}],
      [{'test': 'moveLeft', 'type': 'studio_moveLeft'}]
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
      tb('<block type="studio_moveLeft"></block> \
          <block type="studio_moveRight"></block>'),
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
      tb('<block type="studio_moveLeft"></block> \
          <block type="studio_moveRight"></block> \
          <block type="studio_moveUp"></block> \
          <block type="studio_moveDown"></block>'),
    'startBlocks':
     '<block type="studio_whenUp" deletable="false" x="20" y="20"></block>'
  },
  '4': {
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'studio_moveRight'}],
      [{'test': 'moveLeft', 'type': 'studio_moveLeft'}],
      [{'test': 'moveUp', 'type': 'studio_moveUp'}],
      [{'test': 'moveDown', 'type': 'studio_moveDown'}]
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
      tb('<block type="studio_moveLeft"></block> \
          <block type="studio_moveRight"></block> \
          <block type="studio_moveUp"></block> \
          <block type="studio_moveDown"></block>'),
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenRight" deletable="false" x="180" y="20"></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="120"></block> \
      <block type="studio_whenDown" deletable="false" x="180" y="120"></block>'
  },
};

var Direction = require('./tiles').Direction;

var tb = function(blocks) {
  return '<xml id="toolbox" style="display: none;">' + blocks + '</xml>';
};

/*
 * Configuration for all levels.
 */
module.exports = {

  '1': {
    'ideal': 2,
    'requiredBlocks': [
      [{'test': 'moveLeft', 'type': 'bounce_moveLeft'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [3, 0, 0, 7, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" x="20" y="20"></block>'
  },
  '2': {
    'ideal': 4,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}],
      [{'test': 'moveLeft', 'type': 'bounce_moveLeft'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [3, 0, 0, 7, 0, 0, 0, 3]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" x="20" y="20"></block> \
      <block type="bounce_whenRight" x="180" y="20"></block>'
  },
  '5': {
    'ideal': 8,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 6, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" x="20" y="20"></block> \
      <block type="bounce_whenRight" x="20" y="120"></block> \
      <block type="bounce_whenWallCollided" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" x="180" y="120"></block>'
  },
  '6': {
    'ideal': 8,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 6, 0, 0, 0],
      [0, 0, 6, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 6, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 6, 0],
      [0, 6, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" x="20" y="20"></block> \
      <block type="bounce_whenRight" x="20" y="120"></block> \
      <block type="bounce_whenWallCollided" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" x="180" y="120"></block>'
  },
  '7': {
    'ideal': 8,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 6, 0, 6, 0, 6, 0, 6],
      [6, 0, 6, 0, 6, 0, 6, 0],
      [0, 6, 0, 6, 0, 6, 0, 6],
      [6, 0, 6, 0, 6, 0, 6, 0],
      [0, 6, 0, 6, 0, 6, 0, 6],
      [6, 0, 6, 0, 6, 0, 6, 0],
      [0, 6, 0, 6, 0, 6, 0, 6],
      [0, 0, 0, 7, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" x="20" y="20"></block> \
      <block type="bounce_whenRight" x="20" y="120"></block> \
      <block type="bounce_whenWallCollided" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" x="180" y="120"></block>'
  },
};

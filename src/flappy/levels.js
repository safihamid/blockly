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
    'ideal': 2,
    'requiredBlocks': [
      [{'test': 'moveLeft', 'type': 'bounce_moveLeft'}]
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
      [3, 0, 0, 7, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" movable="false" x="20" y="20"></block>'
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
      [3, 0, 0, 7, 0, 0, 0, 3],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" movable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" movable="false" x="180" y="20"></block>'
  },
  '3': {
    'ideal': 2,
    'requiredBlocks': [
      [{'test': 'moveUp', 'type': 'bounce_moveUp'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'upButton'
    ],
    'map': [
      [0, 0, 0, 3, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_moveUp"></block> \
          <block type="bounce_moveDown"></block>'),
    'startBlocks':
     '<block type="bounce_whenUp" deletable="false" movable="false" x="20" y="20"></block>'
  },
  '4': {
    'ideal': 8,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}],
      [{'test': 'moveLeft', 'type': 'bounce_moveLeft'}],
      [{'test': 'moveUp', 'type': 'bounce_moveUp'}],
      [{'test': 'moveDown', 'type': 'bounce_moveDown'}]
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
      [0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 3],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [3, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_moveUp"></block> \
          <block type="bounce_moveDown"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" movable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" movable="false" x="180" y="20"></block> \
      <block type="bounce_whenUp" deletable="false" movable="false" x="20" y="120"></block> \
      <block type="bounce_whenDown" deletable="false" movable="false" x="180" y="120"></block>'
  },
  '5': {
    'ideal': 2,
    'timeoutFailureTick': 100,
    'requiredBlocks': [
      [{'test': 'bounceBall', 'type': 'bounce_bounceBall'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton'
    ],
    'ballDirection': (1.285 * Math.PI),
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0],
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
     '<block type="bounce_whenPaddleCollided" deletable="false" movable="false" x="20" y="20"></block>'
  },
  '6': {
    'ideal': 4,
    'timeoutFailureTick': 140,
    'requiredBlocks': [
      [{'test': 'bounceBall', 'type': 'bounce_bounceBall'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton'
    ],
    'ballDirection': (1.285 * Math.PI),
    'map': [
      [0, 0, 2, 0, 0, 0, 0, 0],
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
     '<block type="bounce_whenPaddleCollided" deletable="false" movable="false" x="20" y="20"></block> \
      <block type="bounce_whenWallCollided" deletable="false" movable="false" x="20" y="120"></block>'
  },
  '7': {
    'ideal': 8,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}]
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
      [0, 0, 0, 0, 0, 0, 6, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" movable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" movable="false" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" deletable="false" movable="false" x="20" y="120"></block> \
      <block type="bounce_whenWallCollided" deletable="false" movable="false" x="20" y="220"></block>'
  },
  '8': {
    'ideal': 8,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton'
    ],
    'map': [
      [0, 0, 0, 0, 6, 0, 0, 0],
      [0, 0, 6, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 6, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 6, 0],
      [0, 6, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" movable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" movable="false" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" deletable="false" movable="false" x="20" y="120"></block> \
      <block type="bounce_whenWallCollided" deletable="false" movable="false" x="20" y="220"></block>'
  },
  '9': {
    'ideal': 8,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton'
    ],
    'map': [
      [0, 6, 0, 6, 0, 6, 0, 6],
      [6, 0, 6, 0, 6, 0, 6, 0],
      [0, 6, 0, 6, 0, 6, 0, 6],
      [6, 0, 6, 0, 6, 0, 6, 0],
      [0, 6, 0, 6, 0, 6, 0, 6],
      [6, 0, 6, 0, 6, 0, 6, 0],
      [0, 6, 0, 6, 0, 6, 0, 6],
      [0, 0, 7, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" movable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" movable="false" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" deletable="false" movable="false" x="20" y="120"></block> \
      <block type="bounce_whenWallCollided" deletable="false" movable="false" x="20" y="220"></block>'
  },
  '10': {
    'ideal': 12,
    'requiredBlocks': [
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton'
    ],
    'respawnBalls' : true,
    'map': [
      [0, 0, 0, 5, 5, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 6, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block> \
          <block type="bounce_incrementPlayerScore"></block> \
          <block type="bounce_incrementOpponentScore"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" movable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" movable="false" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" deletable="false" movable="false" x="20" y="100"></block> \
      <block type="bounce_whenWallCollided" deletable="false" movable="false" x="20" y="180"></block> \
      <block type="bounce_whenBallInGoal" deletable="false" movable="false" x="20" y="260"></block> \
      <block type="bounce_whenBallMissesPaddle" deletable="false" movable="false" x="20" y="340"></block>'
  },
  '11': {
    'ideal': 12,
    'requiredBlocks': [
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="flappy_flap"></block> \
          <block type="flappy_playSound"></block> \
          <block type="flappy_incrementPlayerScore"></block>'),
    'startBlocks':
     '<block type="flappy_whenClick" deletable="false" movable="false" x="20" y="20"></block> \
      <block type="flappy_whenCollideGround" deletable="false" movable="false" x="240" y="20"></block> \
      <block type="flappy_whenCollidePipe" deletable="false" movable="false" x="20" y="140"></block> \
      <block type="flappy_whenEnterPipe" deletable="false" movable="false" x="240" y="140"></block> \
      <block type="flappy_whenRunButtonClick" deletable="false" movable="false" x="20" y="260"></block>'
  }
};

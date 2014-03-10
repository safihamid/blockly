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
      [8, 0, 0,16, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" x="20" y="20"></block>'
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
      [8, 0, 0,16, 0, 0, 0, 8],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" x="180" y="20"></block>'
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
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_moveUp"></block> \
          <block type="bounce_moveDown"></block>'),
    'startBlocks':
     '<block type="bounce_whenUp" deletable="false" x="20" y="20"></block>'
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
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_moveUp"></block> \
          <block type="bounce_moveDown"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" x="180" y="20"></block> \
      <block type="bounce_whenUp" deletable="false" x="20" y="120"></block> \
      <block type="bounce_whenDown" deletable="false" x="180" y="120"></block>'
  },
  '5': {
    'ideal': 3,
    'timeoutFailureTick': 100,
    'requiredBlocks': [
      [{'test': 'bounceBall', 'type': 'bounce_bounceBall'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'ballDirection': (1.285 * Math.PI),
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [32,0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 4, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0,16, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenPaddleCollided" deletable="false" x="20" y="20"></block>'
  },
  '6': {
    'ideal': 6,
    'timeoutFailureTick': 140,
    'requiredBlocks': [
      [{'test': 'bounceBall', 'type': 'bounce_bounceBall'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'ballDirection': (1.285 * Math.PI),
    'map': [
      [1, 1,33, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0,16, 0, 0, 0, 1]
    ],
    'toolbox':
      tb('<block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenPaddleCollided" deletable="false" x="20" y="20"></block> \
      <block type="bounce_whenWallCollided" deletable="false" x="20" y="120"></block>'
  },
  '7': {
    'ideal': 10,
    'timeoutFailureTick': 900,
    'requiredBlocks': [
      [{'test': 'moveLeft', 'type': 'bounce_moveLeft'}],
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}],
      [{'test': 'bounceBall', 'type': 'bounce_bounceBall'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton'
    ],
    'failOnBallExit' : true,
    'map': [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0,32, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0,16, 0, 0, 0, 0, 1]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" deletable="false" x="20" y="120"></block> \
      <block type="bounce_whenWallCollided" deletable="false" x="20" y="220"></block>'
  },
/*
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
      [1, 1, 1, 1, 5, 1, 1, 1],
      [1, 0, 4, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 4, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 4, 1],
      [1, 4, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0,16, 0, 0, 0, 0, 1]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" deletable="false" x="20" y="120"></block> \
      <block type="bounce_whenWallCollided" deletable="false" x="20" y="220"></block>'
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
      [1, 5, 1, 5, 1, 5, 1, 5],
      [5, 0, 4, 0, 4, 0, 4, 1],
      [1, 4, 0, 4, 0, 4, 0, 5],
      [5, 0, 4, 0, 4, 0, 4, 1],
      [1, 4, 0, 4, 0, 4, 0, 5],
      [5, 0, 4, 0, 4, 0, 4, 1],
      [1, 4, 0, 4, 0, 4, 0, 5],
      [1, 0,16, 0, 0, 0, 0, 1]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" deletable="false" x="20" y="120"></block> \
      <block type="bounce_whenWallCollided" deletable="false" x="20" y="220"></block>'
  },
*/
  '10': {
    'ideal': 16,
    'requiredBlocks': [
      [{'test': 'moveLeft', 'type': 'bounce_moveLeft'}],
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}],
      [{'test': 'bounceBall', 'type': 'bounce_bounceBall'}],
      [{'test': 'incrementPlayerScore', 'type': 'bounce_incrementPlayerScore'}],
      [{'test': 'incrementOpponentScore', 'type': 'bounce_incrementOpponentScore'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton'
    ],
    'goal': {
      successCondition: function () {
        return (Bounce.opponentScore >= 2);
      }
    },
    'respawnBalls' : true,
    'map': [
      [1, 1, 2, 2, 2, 2, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0,16, 0, 0, 0, 0, 1]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block> \
          <block type="bounce_incrementPlayerScore"></block> \
          <block type="bounce_incrementOpponentScore"></block>'),
    'startBlocks':
     '<block type="bounce_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="bounce_whenRight" deletable="false" x="180" y="20"></block> \
      <block type="bounce_whenPaddleCollided" deletable="false" x="20" y="100"></block> \
      <block type="bounce_whenWallCollided" deletable="false" x="20" y="180"></block> \
      <block type="bounce_whenBallInGoal" deletable="false" x="20" y="260"></block> \
      <block type="bounce_whenBallMissesPaddle" deletable="false" x="20" y="340"></block>'
  },
  '11': {
    'ideal': 19,
    'requiredBlocks': [
      [{'test': 'moveLeft', 'type': 'bounce_moveLeft'}],
      [{'test': 'moveRight', 'type': 'bounce_moveRight'}],
      [{'test': 'bounceBall', 'type': 'bounce_bounceBall'}],
      [{'test': 'incrementPlayerScore', 'type': 'bounce_incrementPlayerScore'}],
      [{'test': 'incrementOpponentScore', 'type': 'bounce_incrementOpponentScore'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton'
    ],
    'goal': {
      successCondition: function () {
        return (Bounce.opponentScore >= 2);
      }
    },
    'respawnBalls' : true,
    'map': [
      [1, 1, 2, 2, 2, 2, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0,16, 0, 0, 0, 0, 1]
    ],
    'toolbox':
      tb('<block type="bounce_moveLeft"></block> \
          <block type="bounce_moveRight"></block> \
          <block type="bounce_bounceBall"></block> \
          <block type="bounce_playSound"></block> \
          <block type="bounce_incrementPlayerScore"></block> \
          <block type="bounce_incrementOpponentScore"></block> \
          <block type="bounce_setPaddleSpeed"></block> \
          <block type="bounce_setBallSpeed"></block>'),
    'startBlocks':
     '<block type="bounce_whenGameStarts" deletable="false" x="20" y="20"></block> \
      <block type="bounce_whenLeft" deletable="false" x="20" y="110"></block> \
      <block type="bounce_whenRight" deletable="false" x="180" y="110"></block> \
      <block type="bounce_whenPaddleCollided" deletable="false" x="20" y="190"></block> \
      <block type="bounce_whenWallCollided" deletable="false" x="20" y="270"></block> \
      <block type="bounce_whenBallInGoal" deletable="false" x="20" y="350"></block> \
      <block type="bounce_whenBallMissesPaddle" deletable="false" x="20" y="430"></block>'
  },
};

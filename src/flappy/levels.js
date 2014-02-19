/*jshint multistr: true */

var Direction = require('./tiles').Direction;

var tb = function(blocks) {
  return '<xml id="toolbox" style="display: none;">' + blocks + '</xml>';
};

/*
 * Configuration for all levels.
 */

// todo - specifiy timeouts for 1 and 2
module.exports = {
  '1': {
    'ideal': 2,
    'requiredBlocks': [
      // todo - make sure this works as expected
      [{'test': 'flap', 'type': 'flappy_flap'}]
    ],
    'pipes': false,
    'ground': false,
    'score': false,
    'infoText': false,
    'freePlay': false,
    'goal': {
      x: 103,
      y: 0
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb('<block type="flappy_flap"></block> \
          <block type="flappy_playSound"></block>'),
    'startBlocks':
     '<block type="flappy_whenClick" deletable="false" x="20" y="20"></block>'
  },

  // todo - ideal numbers are inflated bc of room for noises. can i do this better?
  '2': {
    'ideal': 3,
    'requiredBlocks': [
      [{'test': 'endGame', 'type': 'flappy_endGame'}]
    ],
    'pipes': false,
    'ground': true,
    'score': false,
    'infoText': false,
    'freePlay': false,
    'goal': {
      x: 103,
      y: 320,
      validation: function () {
        return (Flappy.gameState === Flappy.GameStates.OVER);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb('<block type="flappy_flap"></block> \
          <block type="flappy_endGame"></block> \
          <block type="flappy_playSound"></block>'),
    'startBlocks':
     '<block type="flappy_whenClick" deletable="false"><next><block type="flappy_flap"></block></next></block> \
      <block type="flappy_whenCollideGround" deletable="false" x="240" y="20"></block>'
  },

  '3': {
    'ideal': 3,
    'requiredBlocks': [
      [{'test': 'endGame', 'type': 'flappy_endGame'}]
    ],
    'pipes': true,
    'ground': true,
    'score': false,
    'infoText': false,
    'freePlay': false,
    'tickLimit': 140,
    'goal': {
      validation: function () {
        var pipe0x = document.getElementById('pipe_top0').getAttribute('x');
        return (pipe0x === "144" && Flappy.gameState === Flappy.GameStates.OVER);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb('<block type="flappy_flap"></block> \
          <block type="flappy_endGame"></block> \
          <block type="flappy_playSound"></block>'),
    'startBlocks':
     '<block type="flappy_whenClick" deletable="false" x="20" y="20"> \
        <next><block type="flappy_flap"></block></next> \
      </block> \
      <block type="flappy_whenCollideGround" deletable="false" x="20" y="140"> \
        <next><block type="flappy_endGame"></block></next> \
      </block> \
      <block type="flappy_whenCollidePipe" deletable="false" x="240" y="140"></block>'
  },

  '11': {
    // 'ideal': 12,
    'requiredBlocks': [
    ],
    'pipes': true,
    'ground': true,
    'score': true,
    'infoText': true,
    'freePlay': true,
    'scale': {
      'snapRadius': 2
    },
    'freePlay': true,
    'toolbox':
      tb('<block type="flappy_flap"></block> \
          <block type="flappy_playSound"></block> \
          <block type="flappy_incrementPlayerScore"></block> \
          <block type="flappy_endGame"></block> \
          <block type="flappy_setSpeed"></block> \
          <block type="flappy_setFlapHeight"></block>'),
    'startBlocks':
     '<block type="flappy_whenClick" deletable="false" x="20" y="20"></block> \
      <block type="flappy_whenCollideGround" deletable="false" x="240" y="20"></block> \
      <block type="flappy_whenCollidePipe" deletable="false" x="20" y="140"></block> \
      <block type="flappy_whenEnterPipe" deletable="false" x="240" y="140"></block> \
      <block type="flappy_whenRunButtonClick" deletable="false" x="20" y="260"></block>'
  }
};

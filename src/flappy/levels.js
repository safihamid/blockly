/*jshint multistr: true */

var Direction = require('./tiles').Direction;

var tb = function(blocks) {
  return '<xml id="toolbox" style="display: none;">' + blocks + '</xml>';
};

var flapBlock = '<block type="flappy_flap"></block>';
var endGameBlock = '<block type="flappy_endGame"></block>';
var playSoundBlock =  '<block type="flappy_playSound"></block>';
var incrementScoreBlock = '<block type="flappy_incrementPlayerScore"></block>';

var setSpeedBlock = '<block type="flappy_setSpeed"></block>';
var setFlapHeightBlock = '<block type="flappy_setFlapHeight"></block>';

var eventBlock = function (type, x, y, child) {
  return '<block type="' + type + '" deletable="false"' +
    ' x="' + x + '"' +
    ' y="' + y + '">' +
    (child ? '<next>' + child + '</next>' : '') +
    '</block>';
};

// var eventBlock = function (type, x, y, child) {
//   return '<block type="' + type + '" deletable="false" x="' + x + '" y="' + y +
//     '"><next>' + child + '</next></block>';
// };

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
    'tickLimit': 120,
    'goal': {
      x: 103,
      y: 0
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapBlock + playSoundBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', 20, 20)
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
    'tickLimit': 120, // how long it takes to fly just past first pipe
    'goal': {
      x: 106,
      y: 320,
      validation: function () {
        return (Flappy.gameState === Flappy.GameStates.OVER);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapBlock + endGameBlock + playSoundBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', 20, 20, flapBlock) +
      eventBlock('flappy_whenCollideGround', 20, 140)
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
        // todo - right now we can also pass by crashing into ground in pipe
        // location without ever having attached to pipe collide event
        var pipe0x = document.getElementById('pipe_top0').getAttribute('x');
        return (parseInt(pipe0x, 10) <= 144 &&
          Flappy.gameState === Flappy.GameStates.OVER);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapBlock + endGameBlock + playSoundBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', 20, 20, flapBlock) +
      eventBlock('flappy_whenCollideGround', 20, 140, endGameBlock) +
      eventBlock('flappy_whenCollidePipe', 240, 140)
  },

  '4': {
    'ideal': 5,
    'requiredBlocks': [
      [{'test': 'incrementPlayerScore', 'type': 'flappy_incrementPlayerScore'}]
    ],
    'pipes': true,
    'ground': true,
    'score': true,
    'infoText': false,
    'freePlay': false,
    'tickLimit': 140,
    'goal': {
      validation: function () {
        // bird got into first pipe and has score of 1
        return (Flappy.tickCount - Flappy.firstActiveTick >= 114 &&
          Flappy.playerScore === 1);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapBlock + endGameBlock + incrementScoreBlock + playSoundBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', 20, 20, flapBlock) +
      eventBlock('flappy_whenCollideGround', 20, 140, endGameBlock) +
      eventBlock('flappy_whenCollidePipe', 240, 140, endGameBlock) +
      eventBlock('flappy_whenEnterPipe', 240, 20)
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
      tb(flapBlock + playSoundBlock + incrementScoreBlock + endGameBlock +
        setSpeedBlock + setFlapHeightBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', 20, 20) +
      eventBlock('flappy_whenCollideGround', 20, 140) +
      eventBlock('flappy_whenCollidePipe', 240, 140) +
      eventBlock('flappy_whenEnterPipe', 240, 20) +
      eventBlock('flappy_whenRunButtonClick', 20, 260)
  }
};

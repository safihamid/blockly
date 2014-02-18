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
    // 'ideal': 12,
    'requiredBlocks': [
      [{'test': 'flap', 'type': 'flappy_flap'}]
    ],
    'noPipes': true,
    'noGround': true,
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb('<block type="flappy_flap"></block>'),
    'startBlocks':
     '<block type="flappy_whenClick" deletable="false" x="20" y="20"></block>'
  },
  '11': {
    // 'ideal': 12,
    'requiredBlocks': [
    ],
    'scale': {
      'snapRadius': 2
    },
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

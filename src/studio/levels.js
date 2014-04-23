/*jshint multistr: true */

var Direction = require('./tiles').Direction;
var tb = require('../block_utils').createToolbox;

/*
 * Configuration for all levels.
 */
module.exports = {

  '1': {
    'requiredBlocks': [
      [{'test': 'saySprite', 'type': 'studio_saySprite'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 16,0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'goal': {
      successCondition: function () {
        return (Studio.sayComplete > 0);
      }
    },
    'timeoutFailureTick': 100,
    'toolbox':
      tb('<block type="studio_moveDistance"><title name="DIR">1</title></block> \
          <block type="studio_saySprite"></block>'),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block>'
  },
  '2': {
    'requiredBlocks': [
      [{'test': 'moveDistance', 'type': 'studio_moveDistance'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0,16, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'timeoutFailureTick': 100,
    'toolbox':
      tb('<block type="studio_moveDistance"><title name="DIR">1</title></block> \
          <block type="studio_saySprite"></block>'),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block>'
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
    'minWorkspaceHeight': 800,
    'freePlay': true,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb('<block type="studio_whenSpriteClicked"></block> \
          <block type="studio_whenSpriteCollided"></block> \
          <block type="studio_whenGameIsRunning"></block> \
          <block type="studio_move"></block> \
          <block type="studio_moveDistance"></block> \
          <block type="studio_playSound"></block> \
          <block type="studio_incrementScore"></block> \
          <block type="studio_saySprite"></block> \
          <block type="studio_setSpriteSpeed"></block> \
          <block type="studio_setBackground"></block> \
          <block type="studio_setSprite"></block>'),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenLeft" deletable="false" x="20" y="120"></block> \
      <block type="studio_whenRight" deletable="false" x="20" y="200"></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="280"></block> \
      <block type="studio_whenDown" deletable="false" x="20" y="360"></block>'
  },
};

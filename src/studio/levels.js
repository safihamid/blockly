/*jshint multistr: true */

var blockUtils = require('../block_utils');
var Direction = require('./tiles').Direction;
var tb = blockUtils.createToolbox;
var blockOfType = blockUtils.blockOfType;

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
      tb('<block type="studio_moveDistance"><title name="DIR">2</title></block>' +
         blockOfType('studio_saySprite')),
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
      tb('<block type="studio_moveDistance"><title name="DIR">2</title></block>' +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block>'
  },
  '3': {
    'requiredBlocks': [
      [{'test': 'moveDistance', 'type': 'studio_moveDistance'}],
      [{'test': 'saySprite', 'type': 'studio_saySprite'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0,16, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'goal': {
      successCondition: function () {
        return ((Studio.sayComplete > 0) &&
                (Studio.sprite[0].collisionMask & 2));
      }
    },
    'timeoutFailureTick': 200,
    'toolbox':
      tb('<block type="studio_moveDistance"><title name="DIR">2</title></block>' +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenSpriteCollided" deletable="false" x="20" y="120"></block>'
  },
  '4': {
    'requiredBlocks': [
      [{'test': 'move', 'type': 'studio_move'}]
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
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0,16, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb(blockOfType('studio_move') +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenRight" deletable="false" x="180" y="20"></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="120"></block> \
      <block type="studio_whenDown" deletable="false" x="180" y="120"></block>'
  },
  '5': {
    'requiredBlocks': [
      [{'test': 'moveDistance', 'type': 'studio_moveDistance'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0,16, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'spriteStartingImage': 1,
    'timeoutFailureTick': 200,
    'toolbox':
      tb(blockOfType('studio_moveDistance') +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_whenGameIsRunning" deletable="false" x="20" y="20"></block>'
  },
  '6': {
    'requiredBlocks': [
      [{'test': 'move', 'type': 'studio_move'}],
      [{'test': 'saySprite', 'type': 'studio_saySprite'}]
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
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [16,0, 0, 0,16, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb(blockOfType('studio_moveDistance') +
         blockOfType('studio_move') +
         blockOfType('studio_saySprite')),
    'minWorkspaceHeight': 600,
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"> \
        <next><block type="studio_move"> \
                <title name="DIR">8</title></block> \
        </next></block> \
      <block type="studio_whenRight" deletable="false" x="20" y="100"> \
        <next><block type="studio_move"> \
                <title name="DIR">2</title></block> \
        </next></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="180"> \
        <next><block type="studio_move"> \
                <title name="DIR">1</title></block> \
        </next></block> \
      <block type="studio_whenDown" deletable="false" x="20" y="260"> \
        <next><block type="studio_move"> \
                <title name="DIR">4</title></block> \
        </next></block> \
      <block type="studio_whenGameIsRunning" deletable="false" x="20" y="340"> \
        <next><block type="studio_moveDistance"> \
                <title name="SPRITE">1</title> \
                <title name="DISTANCE">400</title> \
          <next><block type="studio_moveDistance"> \
                  <title name="SPRITE">1</title> \
                  <title name="DISTANCE">400</title> \
                  <title name="DIR">4</title></block> \
          </next></block> \
      </next></block> \
      <block type="studio_whenSpriteCollided" deletable="false" x="20" y="440"></block>'
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
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb(blockOfType('studio_whenSpriteClicked') +
         blockOfType('studio_whenSpriteCollided') +
         blockOfType('studio_whenGameIsRunning') +
         blockOfType('studio_move') +
         blockOfType('studio_moveDistance') +
         blockOfType('studio_playSound') +
         blockOfType('studio_incrementScore') +
         blockOfType('studio_saySprite') +
         blockOfType('studio_setSpriteSpeed') +
         blockOfType('studio_setSpriteEmotion') +
         blockOfType('studio_setBackground') +
         blockOfType('studio_setSprite')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenLeft" deletable="false" x="20" y="120"></block> \
      <block type="studio_whenRight" deletable="false" x="20" y="200"></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="280"></block> \
      <block type="studio_whenDown" deletable="false" x="20" y="360"></block>'
  },
};

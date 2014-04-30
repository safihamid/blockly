/**
 * Blockly App: Studio
 *
 * Copyright 2014 Code.org
 *
 */
'use strict';

var msg = require('../../locale/current/studio');
var codegen = require('../codegen');
var tiles = require('./tiles');

var Direction = tiles.Direction;
var Emotions = tiles.Emotions;

var generateSetterCode = function (opts) {
  var value = opts.ctx.getTitleValue('VALUE');
  if (value === "random") {
    var randomIndex = opts.random || 0;
    // opts.random is the index of where the 'random' items is in beginning of
    // the VALUES table (defaults to 0).
    var allValues = opts.ctx.VALUES.slice(randomIndex + 1).map(function (item) {
      return item[1];
    });
    value = 'Studio.random([' + allValues + '])';
  }

  return 'Studio.' + opts.name + '(\'block_id_' + opts.ctx.id + '\', ' +
    (opts.extraParams ? opts.extraParams + ', ' : '') + value + ');\n';
};

exports.setSpriteCount = function(blockly, count) {
  blockly.Blocks.studio_spriteCount = count;
};

// Install extensions to Blockly's language and JavaScript generator.
exports.install = function(blockly, skin) {

  var generator = blockly.Generator.get('JavaScript');
  blockly.JavaScript = generator;
  
  generator.studio_eventHandlerPrologue = function() {
    return 'var executionCtx = Studio.acquireEventHandlerNum();\n\n';
  };

  blockly.Blocks.studio_spriteCount = 6;
  
  blockly.Blocks.studio_whenLeft = {
    // Block to handle event when the Left arrow button is pressed.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenLeft());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenLeftTooltip());
    }
  };
  
  generator.studio_whenLeft = generator.studio_eventHandlerPrologue;
  
  blockly.Blocks.studio_whenRight = {
    // Block to handle event when the Right arrow button is pressed.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenRight());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenRightTooltip());
    }
  };
  
  generator.studio_whenRight = generator.studio_eventHandlerPrologue;
  
  blockly.Blocks.studio_whenUp = {
    // Block to handle event when the Up arrow button is pressed.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenUp());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenUpTooltip());
    }
  };
  
  generator.studio_whenUp = generator.studio_eventHandlerPrologue;
  
  blockly.Blocks.studio_whenDown = {
    // Block to handle event when the Down arrow button is pressed.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenDown());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenDownTooltip());
    }
  };
  
  generator.studio_whenDown = generator.studio_eventHandlerPrologue;
  
  blockly.Blocks.studio_whenGameStarts = {
    // Block to handle event when the game starts
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenGameStarts());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenGameStartsTooltip());
    }
  };

  generator.studio_whenGameStarts = generator.studio_eventHandlerPrologue;

  blockly.Blocks.studio_whenGameIsRunning = {
    // Block to handle the repeating tick event while the game is running.
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenGameIsRunning());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenGameIsRunningTooltip());
    }
  };

  generator.studio_whenGameIsRunning = generator.studio_eventHandlerPrologue;

  blockly.Blocks.studio_whenSpriteClicked = {
    // Block to handle event when sprite is clicked.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      var dropdownArray =
          this.SPRITE.slice(0, blockly.Blocks.studio_spriteCount);
      if (blockly.Blocks.studio_spriteCount > 1) {
        this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(dropdownArray), 'SPRITE');
      } else {
        this.appendDummyInput()
          .appendTitle(msg.whenSpriteClicked());
      }
      this.setPreviousStatement(false);
      this.setInputsInline(true);
      this.setNextStatement(true);
      this.setTooltip(msg.whenSpriteClickedTooltip());
    },
  };

  blockly.Blocks.studio_whenSpriteClicked.SPRITE =
    [[msg.whenSpriteClicked1(), '0'],
     [msg.whenSpriteClicked2(), '1'],
     [msg.whenSpriteClicked3(), '2'],
     [msg.whenSpriteClicked4(), '3'],
     [msg.whenSpriteClicked5(), '4'],
     [msg.whenSpriteClicked6(), '5']];
  
  generator.studio_whenSpriteClicked = generator.studio_eventHandlerPrologue;

  blockly.Blocks.studio_whenSpriteCollided = {
    // Block to handle event when sprite collides with another sprite.
    helpUrl: '',
    init: function() {
      var dropdownArray1 =
          this.SPRITE1.slice(0, blockly.Blocks.studio_spriteCount);
      var dropdownArray2 =
          this.SPRITE2.slice(0, blockly.Blocks.studio_spriteCount);
      var dropdown2 = new blockly.FieldDropdown(dropdownArray2);
      if (blockly.Blocks.studio_spriteCount > 1) {
        dropdown2.setValue(dropdownArray2[1][1]); // default to 2
      }

      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(dropdownArray1), 'SPRITE1');
      this.appendDummyInput()
        .appendTitle(dropdown2, 'SPRITE2');
      this.setPreviousStatement(false);
      this.setInputsInline(true);
      this.setNextStatement(true);
      this.setTooltip(msg.whenSpriteCollidedTooltip());
    }
  };

  blockly.Blocks.studio_whenSpriteCollided.SPRITE1 =
      [[msg.whenSpriteCollided1(), '0'],
       [msg.whenSpriteCollided2(), '1'],
       [msg.whenSpriteCollided3(), '2'],
       [msg.whenSpriteCollided4(), '3'],
       [msg.whenSpriteCollided5(), '4'],
       [msg.whenSpriteCollided6(), '5']];

  blockly.Blocks.studio_whenSpriteCollided.SPRITE2 =
      [[msg.whenSpriteCollidedWith1(), '0'],
       [msg.whenSpriteCollidedWith2(), '1'],
       [msg.whenSpriteCollidedWith3(), '2'],
       [msg.whenSpriteCollidedWith4(), '3'],
       [msg.whenSpriteCollidedWith5(), '4'],
       [msg.whenSpriteCollidedWith6(), '5']];
  
  generator.studio_whenSpriteCollided = generator.studio_eventHandlerPrologue;

  blockly.Blocks.studio_stop = {
    // Block for stopping the movement of a sprite.
    helpUrl: '',
    init: function() {
      var dropdownArray =
          this.SPRITE.slice(0, blockly.Blocks.studio_spriteCount);
      this.setHSV(184, 1.00, 0.74);
      if (blockly.Blocks.studio_spriteCount > 1) {
        this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(dropdownArray), 'SPRITE');
      } else {
        this.appendDummyInput()
          .appendTitle(msg.stopSprite());
      }
      this.setPreviousStatement(true);
      this.setInputsInline(true);
      this.setNextStatement(true);
      this.setTooltip(msg.stopTooltip());
    }
  };

  blockly.Blocks.studio_stop.SPRITE =
      [[msg.stopSprite1(), '0'],
       [msg.stopSprite2(), '1'],
       [msg.stopSprite3(), '2'],
       [msg.stopSprite4(), '3'],
       [msg.stopSprite5(), '4'],
       [msg.stopSprite6(), '5']];
  
  generator.studio_stop = function() {
    // Generate JavaScript for stopping the movement of a sprite.
    return 'Studio.stop(\'block_id_' + this.id + '\', ' +
        (this.getTitleValue('SPRITE') || '0') + ');\n';
  };

  blockly.Blocks.studio_move = {
    // Block for moving one frame a time.
    helpUrl: '',
    init: function() {
      var dropdownArray =
          this.SPRITE.slice(0, blockly.Blocks.studio_spriteCount);
      this.setHSV(184, 1.00, 0.74);
      if (blockly.Blocks.studio_spriteCount > 1) {
        this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(dropdownArray), 'SPRITE');
        this.appendDummyInput()
          .appendTitle('\t');
      } else {
        this.appendDummyInput()
          .appendTitle(msg.moveSprite());
      }
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.DIR), 'DIR');
      this.setPreviousStatement(true);
      this.setInputsInline(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveTooltip());
    }
  };

  blockly.Blocks.studio_move.SPRITE =
      [[msg.moveSprite1(), '0'],
       [msg.moveSprite2(), '1'],
       [msg.moveSprite3(), '2'],
       [msg.moveSprite4(), '3'],
       [msg.moveSprite5(), '4'],
       [msg.moveSprite6(), '5']];
  
  blockly.Blocks.studio_move.DIR =
      [[msg.moveDirectionUp(), Direction.NORTH.toString()],
       [msg.moveDirectionDown(), Direction.SOUTH.toString()],
       [msg.moveDirectionLeft(), Direction.WEST.toString()],
       [msg.moveDirectionRight(), Direction.EAST.toString()]];

  generator.studio_move = function() {
    // Generate JavaScript for moving.
    return 'Studio.move(\'block_id_' + this.id + '\', ' +
        (this.getTitleValue('SPRITE') || '0') + ', ' +
        this.getTitleValue('DIR') + ');\n';
  };

  blockly.Blocks.studio_moveDistance = {
    // Block for moving/gliding a specific distance.
    helpUrl: '',
    init: function() {
      var dropdownArray =
          this.SPRITE.slice(0, blockly.Blocks.studio_spriteCount);
      this.setHSV(184, 1.00, 0.74);
      if (blockly.Blocks.studio_spriteCount > 1) {
        this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(dropdownArray), 'SPRITE');
        this.appendDummyInput()
          .appendTitle('\t');
      } else {
        this.appendDummyInput()
          .appendTitle(msg.moveSprite());
      }
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.DIR), 'DIR');
      this.appendDummyInput()
        .appendTitle('\t');
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.DISTANCE), 'DISTANCE');
      this.setPreviousStatement(true);
      this.setInputsInline(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveDistanceTooltip());
    }
  };

  blockly.Blocks.studio_moveDistance.SPRITE =
    [[msg.moveSprite1(), '0'],
     [msg.moveSprite2(), '1'],
     [msg.moveSprite3(), '2'],
     [msg.moveSprite4(), '3'],
     [msg.moveSprite5(), '4'],
     [msg.moveSprite6(), '5']];

  blockly.Blocks.studio_moveDistance.DIR =
      [[msg.moveDirectionUp(), Direction.NORTH.toString()],
       [msg.moveDirectionDown(), Direction.SOUTH.toString()],
       [msg.moveDirectionLeft(), Direction.WEST.toString()],
       [msg.moveDirectionRight(), Direction.EAST.toString()],
       [msg.moveDirectionRandom(), 'random']];

  blockly.Blocks.studio_moveDistance.DISTANCE =
      [[msg.moveDistance25(), '25'],
       [msg.moveDistance50(), '50'],
       [msg.moveDistance100(), '100'],
       [msg.moveDistance200(), '200'],
       [msg.moveDistance400(), '400'],
       [msg.moveDistanceRandom(), 'random']];

  generator.studio_moveDistance = function() {
    // Generate JavaScript for moving.

    var allDistances = this.DISTANCE.slice(0, -1).map(function (item) {
      return item[1];
    });
    var distParam = this.getTitleValue('DISTANCE');
    if (distParam === 'random') {
      distParam = 'Studio.random([' + allDistances + '])';
    }
    var allDirections = this.DIR.slice(0, -1).map(function (item) {
      return item[1];
    });
    var dirParam = this.getTitleValue('DIR');
    if (dirParam === 'random') {
      dirParam = 'Studio.random([' + allDirections + '])';
    }

    return 'Studio.moveDistance(\'block_id_' + this.id +
        '\', executionCtx || 0, ' +
        (this.getTitleValue('SPRITE') || '0') + ', ' +
        dirParam + ', ' +
        distParam + ');\n';
  };

  blockly.Blocks.studio_playSound = {
    // Block for playing sound.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.SOUNDS), 'SOUND');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.playSoundTooltip());
    }
  };

  blockly.Blocks.studio_playSound.SOUNDS =
      [[msg.playSoundHit(), 'hit'],
       [msg.playSoundWood(), 'wood'],
       [msg.playSoundRetro(), 'retro'],
       [msg.playSoundSlap(), 'slap'],
       [msg.playSoundRubber(), 'rubber'],
       [msg.playSoundCrunch(), 'crunch'],
       [msg.playSoundWinPoint(), 'winpoint'],
       [msg.playSoundWinPoint2(), 'winpoint2'],
       [msg.playSoundLosePoint(), 'losepoint'],
       [msg.playSoundLosePoint2(), 'losepoint2'],
       [msg.playSoundGoal1(), 'goal1'],
       [msg.playSoundGoal2(), 'goal2']];
  
  generator.studio_playSound = function() {
    // Generate JavaScript for playing a sound.
    return 'Studio.playSound(\'block_id_' + this.id + '\', \'' +
               this.getTitleValue('SOUND') + '\');\n';
  };
  
  blockly.Blocks.studio_incrementScore = {
    // Block for incrementing the score.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.PLAYERS), 'PLAYER');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.incrementScoreTooltip());
    }
  };
  
  blockly.Blocks.studio_incrementScore.PLAYERS =
      [[msg.incrementPlayerScore(), 'player'],
       [msg.incrementOpponentScore(), 'opponent']];
  
  generator.studio_incrementScore = function() {
    // Generate JavaScript for incrementing the score.
    return 'Studio.incrementScore(\'block_id_' + this.id + '\', \'' +
                this.getTitleValue('PLAYER') + '\');\n';
  };
  
  blockly.Blocks.studio_setSpriteSpeed = {
    // Block for setting sprite speed
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[3][1]); // default to normal

      var dropdownArray =
          this.SPRITE.slice(0, blockly.Blocks.studio_spriteCount);

      this.setHSV(184, 1.00, 0.74);
      if (blockly.Blocks.studio_spriteCount > 1) {
        this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(dropdownArray), 'SPRITE');
      } else {
        this.appendDummyInput()
          .appendTitle(msg.setSprite());
      }
      this.appendDummyInput()
        .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setSpriteSpeedTooltip());
    }
  };

  blockly.Blocks.studio_setSpriteSpeed.VALUES =
      [[msg.setSpriteSpeedRandom(), 'random'],
       [msg.setSpriteSpeedVerySlow(), 'Studio.SpriteSpeed.VERY_SLOW'],
       [msg.setSpriteSpeedSlow(), 'Studio.SpriteSpeed.SLOW'],
       [msg.setSpriteSpeedNormal(), 'Studio.SpriteSpeed.NORMAL'],
       [msg.setSpriteSpeedFast(), 'Studio.SpriteSpeed.FAST'],
       [msg.setSpriteSpeedVeryFast(), 'Studio.SpriteSpeed.VERY_FAST']];

  blockly.Blocks.studio_setSpriteSpeed.SPRITE =
      [[msg.setSprite1(), '0'],
       [msg.setSprite2(), '1'],
       [msg.setSprite3(), '2'],
       [msg.setSprite4(), '3'],
       [msg.setSprite5(), '4'],
       [msg.setSprite6(), '5']];

  generator.studio_setSpriteSpeed = function () {
    return generateSetterCode({
      ctx: this,
      extraParams: (this.getTitleValue('SPRITE') || '0'),
      name: 'setSpriteSpeed'});
  };

  /**
   * setBackground
   */
  blockly.Blocks.studio_setBackground = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);  // default to cave

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setBackgroundTooltip());
    }
  };

  blockly.Blocks.studio_setBackground.VALUES =
      [[msg.setBackgroundRandom(), 'random'],
       [msg.setBackgroundCave(), '"cave"'],
       [msg.setBackgroundNight(), '"night"'],
       [msg.setBackgroundCloudy(), '"cloudy"'],
       [msg.setBackgroundUnderwater(), '"underwater"'],
       [msg.setBackgroundHardcourt(), '"hardcourt"'],
       [msg.setBackgroundBlack(), '"black"']];

  generator.studio_setBackground = function() {
    return generateSetterCode({ctx: this, name: 'setBackground'});
  };

  /**
   * setSprite
   */
  blockly.Blocks.studio_setSprite = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[2][1]);  // default to witch

      var dropdownArray =
          this.SPRITE.slice(0, blockly.Blocks.studio_spriteCount);

      this.setHSV(312, 0.32, 0.62);
      if (blockly.Blocks.studio_spriteCount > 1) {
        this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(dropdownArray), 'SPRITE');
      } else {
        this.appendDummyInput()
          .appendTitle(msg.setSprite());
      }
      this.appendDummyInput()
        .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setSpriteTooltip());
    }
  };

  blockly.Blocks.studio_setSprite.SPRITE =
      [[msg.setSprite1(), '0'],
       [msg.setSprite2(), '1'],
       [msg.setSprite3(), '2'],
       [msg.setSprite4(), '3'],
       [msg.setSprite5(), '4'],
       [msg.setSprite6(), '5']];

  blockly.Blocks.studio_setSprite.VALUES =
      [[msg.setSpriteHidden(), '"hidden"'],
       [msg.setSpriteRandom(), 'random'],
       [msg.setSpriteWitch(), '"witch"'],
       [msg.setSpriteGreen(), '"green"'],
       [msg.setSpritePurple(), '"purple"'],
       [msg.setSpritePink(), '"pink"'],
       [msg.setSpriteOrange(), '"orange"']];

  generator.studio_setSprite = function() {
    return generateSetterCode({
      ctx: this,
      random: 2,
      extraParams: (this.getTitleValue('SPRITE') || '0'),
      name: 'setSprite'});
  };

  blockly.Blocks.studio_setSpriteEmotion = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);  // default to normal

      var dropdownArray =
          this.SPRITE.slice(0, blockly.Blocks.studio_spriteCount);

      this.setHSV(184, 1.00, 0.74);
      if (blockly.Blocks.studio_spriteCount > 1) {
        this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(dropdownArray), 'SPRITE');
      } else {
        this.appendDummyInput()
          .appendTitle(msg.setSprite());
      }
      this.appendDummyInput()
        .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setSpriteEmotionTooltip());
    }
  };

  blockly.Blocks.studio_setSpriteEmotion.SPRITE =
      [[msg.setSprite1(), '0'],
       [msg.setSprite2(), '1'],
       [msg.setSprite3(), '2'],
       [msg.setSprite4(), '3'],
       [msg.setSprite5(), '4'],
       [msg.setSprite6(), '5']];

  blockly.Blocks.studio_setSpriteEmotion.VALUES =
      [[msg.setSpriteEmotionRandom(), 'random'],
       [msg.setSpriteEmotionNormal(), Emotions.NORMAL.toString()],
       [msg.setSpriteEmotionHappy(), Emotions.HAPPY.toString()],
       [msg.setSpriteEmotionAngry(), Emotions.ANGRY.toString()],
       [msg.setSpriteEmotionSad(), Emotions.SAD.toString()]];

  generator.studio_setSpriteEmotion = function() {
    return generateSetterCode({
      ctx: this,
      extraParams: (this.getTitleValue('SPRITE') || '0'),
      name: 'setSpriteEmotion'});
  };

  blockly.Blocks.studio_saySprite = {
    helpUrl: '',
    init: function() {
      var dropdownArray =
          this.SPRITE.slice(0, blockly.Blocks.studio_spriteCount);
      this.setHSV(184, 1.00, 0.74);
      if (blockly.Blocks.studio_spriteCount > 1) {
        this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(dropdownArray), 'SPRITE');
      } else {
        this.appendDummyInput()
          .appendTitle(msg.saySprite());
      }
      this.appendDummyInput()
        .appendTitle(new Blockly.FieldImage(
                Blockly.assetUrl('media/quote0.png'), 12, 12))
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
        .appendTitle(new Blockly.FieldImage(
                Blockly.assetUrl('media/quote1.png'), 12, 12));
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.saySpriteTooltip());
    }
  };

  blockly.Blocks.studio_saySprite.SPRITE =
      [[msg.saySprite1(), '0'],
       [msg.saySprite2(), '1'],
       [msg.saySprite3(), '2'],
       [msg.saySprite4(), '3'],
       [msg.saySprite5(), '4'],
       [msg.saySprite6(), '5']];

  generator.studio_saySprite = function() {
    // Generate JavaScript for saying.
    return 'Studio.saySprite(\'block_id_' + this.id +
               '\', executionCtx || 0, ' +
               (this.getTitleValue('SPRITE') || '0') + ', ' +
               blockly.JavaScript.quote_(this.getTitleValue('TEXT')) + ');\n';
  };
  
  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

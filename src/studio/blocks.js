/**
 * Blockly App: Studio
 *
 * Copyright 2014 Code.org
 *
 */
'use strict';

var msg = require('../../locale/current/studio');
var codegen = require('../codegen');

var generateSetterCode = function (opts) {
  var value = opts.ctx.getTitleValue('VALUE');
  if (value === "random") {
    var allValues = opts.ctx.VALUES.slice(1).map(function (item) {
      return item[1];
    });
    value = 'Studio.random([' + allValues + '])';
  }

  if (opts.index) {
    return 'Studio.' + opts.name + '(\'block_id_' + opts.ctx.id + '\', ' +
      opts.ctx[opts.index + 'S'][opts.ctx.getTitleValue(opts.index)][1] +
      ', ' + value + ');\n';
  }
  else {
    return 'Studio.' + opts.name + '(\'block_id_' + opts.ctx.id + '\', ' +
      value + ');\n';
  }
};

// Install extensions to Blockly's language and JavaScript generator.
exports.install = function(blockly, skin) {

  var generator = blockly.Generator.get('JavaScript');
  blockly.JavaScript = generator;

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
  
  generator.studio_whenLeft = function() {
    // Generate JavaScript for handling Left arrow button event.
    return '\n';
  };
  
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
  
  generator.studio_whenRight = function() {
    // Generate JavaScript for handling Right arrow button event.
    return '\n';
  };
  
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
  
  generator.studio_whenUp = function() {
    // Generate JavaScript for handling Up arrow button event.
    return '\n';
  };
  
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
  
  generator.studio_whenDown = function() {
    // Generate JavaScript for handling Down arrow button event.
    return '\n';
  };
  
  blockly.Blocks.studio_whenWallCollided = {
    // Block to handle event when a wall/ball collision occurs.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenWallCollided());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenWallCollidedTooltip());
    }
  };
  
  generator.studio_whenWallCollided = function() {
    // Generate JavaScript for handling when a wall/ball collision occurs.
    return '\n';
  };
  
  blockly.Blocks.studio_whenPaddleCollided = {
    // Block to handle event when a paddle/ball collision occurs.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenPaddleCollided());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenPaddleCollidedTooltip());
    }
  };
  
  generator.studio_whenPaddleCollided = function() {
    // Generate JavaScript for handling when a paddle/ball collision occurs.
    return '\n';
  };
  
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

  generator.studio_whenGameStarts = function () {
    // Generate JavaScript for handling run button click
    return '\n';
  };

  blockly.Blocks.studio_whenSpriteClicked = {
    // Block to handle event when sprite is clicked.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.SPRITE), 'SPRITE');
      this.setPreviousStatement(false);
      this.setInputsInline(true);
      this.setNextStatement(true);
      this.setTooltip(msg.whenSpriteClickedTooltip());
    }
  };

  blockly.Blocks.studio_whenSpriteClicked.SPRITE =
      [[msg.whenSpriteClicked1(), '0'],
       [msg.whenSpriteClicked2(), '1'],
       [msg.whenSpriteClicked3(), '2'],
       [msg.whenSpriteClicked4(), '3'],
       [msg.whenSpriteClicked5(), '4'],
       [msg.whenSpriteClicked6(), '5']];
  
  generator.studio_whenSpriteClicked = function() {
    // Generate JavaScript for handle when a sprite is clicked event.
    return '\n';
  };

  blockly.Blocks.studio_whenSpriteCollided = {
    // Block to handle event when sprite collides with another sprite.
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.SPRITE2);
      dropdown.setValue(this.SPRITE2[1][1]); // default to 2

      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.SPRITE1), 'SPRITE1');
      this.appendDummyInput()
        .appendTitle(dropdown, 'SPRITE2');
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
  
  generator.studio_whenSpriteCollided = function() {
    // Generate JavaScript for handle when a sprite collision event.
    return '\n';
  };

  blockly.Blocks.studio_move = {
    // Block for moving left.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.SPRITE), 'SPRITE');
      this.appendDummyInput()
        .appendTitle(msg.moveSeparator());
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
      [[msg.up(), 'moveUp'],
       [msg.down(), 'moveDown'],
       [msg.left(), 'moveLeft'],
       [msg.right(), 'moveRight']];

  generator.studio_move = function() {
    // Generate JavaScript for moving.
    return 'Studio.' + this.getTitleValue('DIR') +
      '(\'block_id_' + this.id + '\', ' + this.getTitleValue('SPRITE') + ');\n';
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

      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.SPRITES), 'SPRITE');
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

  blockly.Blocks.studio_setSpriteSpeed.SPRITES =
      [[msg.setSprite1(), '0'],
       [msg.setSprite2(), '1'],
       [msg.setSprite3(), '2'],
       [msg.setSprite4(), '3'],
       [msg.setSprite5(), '4'],
       [msg.setSprite6(), '5']];

  generator.studio_setSpriteSpeed = function () {
    return generateSetterCode({
      ctx: this,
      index: 'SPRITE',
      name: 'setSpriteSpeed'});
  };

  /**
   * setBackground
   */
  blockly.Blocks.studio_setBackground = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);  // default to hardcourt

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
       [msg.setBackgroundHardcourt(), '"hardcourt"'],
       [msg.setBackgroundRetro(), '"retro"']];

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
      dropdown.setValue(this.VALUES[1][1]);  // default to hardcourt

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.SPRITES), 'SPRITE');
      this.appendDummyInput()
        .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setSpriteTooltip());
    }
  };

  blockly.Blocks.studio_setSprite.SPRITES =
      [[msg.setSprite1(), '0'],
       [msg.setSprite2(), '1'],
       [msg.setSprite3(), '2'],
       [msg.setSprite4(), '3'],
       [msg.setSprite5(), '4'],
       [msg.setSprite6(), '5']];

  blockly.Blocks.studio_setSprite.VALUES =
      [[msg.setSpriteRandom(), 'random'],
       [msg.setSpriteHardcourt(), '"hardcourt"'],
       [msg.setSpriteRetro(), '"retro"']];

  generator.studio_setSprite = function(i) {
    return generateSetterCode({ctx: this, index: 'SPRITE', name: 'setSprite'});
  };
  
  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

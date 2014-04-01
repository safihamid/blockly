/**
 * Blockly App: Studio
 *
 * Copyright 2014 Code.org
 *
 */
'use strict';

var msg = require('../../locale/current/studio');
var codegen = require('../codegen');

var generateSetterCode = function (ctx, name) {
  var value = ctx.getTitleValue('VALUE');
  if (value === "random") {
    var allValues = ctx.VALUES.slice(1).map(function (item) {
      return item[1];
    });
    value = 'Studio.random([' + allValues + '])';
  }

  return 'Studio.' + name + '(\'block_id_' + ctx.id + '\', ' +
    value + ');\n';
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

  blockly.Blocks.studio_moveLeft = {
    // Block for moving left.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.moveLeft());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveLeftTooltip());
    }
  };
  
  generator.studio_moveLeft = function() {
    // Generate JavaScript for moving left.
    return 'Studio.moveLeft(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.studio_moveRight = {
    // Block for moving right.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.moveRight());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveRightTooltip());
    }
  };
  
  generator.studio_moveRight = function() {
    // Generate JavaScript for moving right.
    return 'Studio.moveRight(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.studio_moveUp = {
    // Block for moving up.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.moveUp());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveUpTooltip());
    }
  };
  
  generator.studio_moveUp = function() {
    // Generate JavaScript for moving up.
    return 'Studio.moveUp(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.studio_moveDown = {
    // Block for moving down.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.moveDown());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveDownTooltip());
    }
  };
  
  generator.studio_moveDown = function() {
    // Generate JavaScript for moving down.
    return 'Studio.moveDown(\'block_id_' + this.id + '\');\n';
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
  
  blockly.Blocks.studio_incrementPlayerScore = {
    // Block for incrementing the player's score.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.incrementPlayerScore());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.incrementPlayerScoreTooltip());
    }
  };
  
  generator.studio_incrementPlayerScore = function() {
    // Generate JavaScript for incrementing the player's score.
    return 'Studio.incrementPlayerScore(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.studio_incrementOpponentScore = {
    // Block for incrementing the opponent's score.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.incrementOpponentScore());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.incrementOpponentScoreTooltip());
    }
  };
  
  generator.studio_incrementOpponentScore = function() {
    // Generate JavaScript for incrementing the opponent's score.
    return 'Studio.incrementOpponentScore(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.studio_setPaddleSpeed = {
    // Block for setting paddle speed
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[3][1]); // default to normal

      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setPaddleSpeedTooltip());
    }
  };

  blockly.Blocks.studio_setPaddleSpeed.VALUES =
      [[msg.setPaddleSpeedRandom(), 'random'],
       [msg.setPaddleSpeedVerySlow(), 'Studio.PaddleSpeed.VERY_SLOW'],
       [msg.setPaddleSpeedSlow(), 'Studio.PaddleSpeed.SLOW'],
       [msg.setPaddleSpeedNormal(), 'Studio.PaddleSpeed.NORMAL'],
       [msg.setPaddleSpeedFast(), 'Studio.PaddleSpeed.FAST'],
       [msg.setPaddleSpeedVeryFast(), 'Studio.PaddleSpeed.VERY_FAST']];

  generator.studio_setPaddleSpeed = function (velocity) {
    return generateSetterCode(this, 'setPaddleSpeed');
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
    return generateSetterCode(this, 'setBackground');
  };

  /**
   * setPaddle
   */
  blockly.Blocks.studio_setPaddle = {
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
      this.setTooltip(msg.setPaddleTooltip());
    }
  };

  blockly.Blocks.studio_setPaddle.VALUES =
      [[msg.setPaddleRandom(), 'random'],
       [msg.setPaddleHardcourt(), '"hardcourt"'],
       [msg.setPaddleRetro(), '"retro"']];

  generator.studio_setPaddle = function() {
    return generateSetterCode(this, 'setPaddle');
  };
  
  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

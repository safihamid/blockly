/**
 * Blockly App: Bounce
 *
 * Copyright 2013 Code.org
 *
 */
'use strict';

var msg = require('../../locale/current/flappy');
var codegen = require('../codegen');

// Install extensions to Blockly's language and JavaScript generator.
exports.install = function(blockly, skin) {

  var generator = blockly.Generator.get('JavaScript');
  blockly.JavaScript = generator;

  blockly.Blocks.flappy_whenClick = {
    // Block to handle event where mouse is clicked
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenClick());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenClickTooltip());
    }
  };

  generator.flappy_whenClick = function () {
    // Generate JavaScript for handling click event.
    return '\n';
  };

  blockly.Blocks.flappy_flap = {
    // Block for flapping (flying upwards)
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.flap());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.flapTooltip());
    }
  };

  generator.flappy_flap = function (velocity) {
    // Generate JavaScript for moving left.
    // todo - dont hardcode velocity
    return 'Flappy.flap(\'block_id_' + this.id + '\', -0.15);\n';
  };







  blockly.Blocks.bounce_whenLeft = {
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

  generator.bounce_whenLeft = function() {
    // Generate JavaScript for handling Left arrow button event.
    return '\n';
  };

  blockly.Blocks.bounce_whenRight = {
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

  generator.bounce_whenRight = function() {
    // Generate JavaScript for handling Right arrow button event.
    return '\n';
  };
  
  blockly.Blocks.bounce_whenUp = {
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
  
  generator.bounce_whenUp = function() {
    // Generate JavaScript for handling Up arrow button event.
    return '\n';
  };
  
  blockly.Blocks.bounce_whenDown = {
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
  
  generator.bounce_whenDown = function() {
    // Generate JavaScript for handling Down arrow button event.
    return '\n';
  };
  
  blockly.Blocks.bounce_whenWallCollided = {
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
  
  generator.bounce_whenWallCollided = function() {
    // Generate JavaScript for handling when a wall/ball collision occurs.
    return '\n';
  };
  
  blockly.Blocks.bounce_whenBallInGoal = {
    // Block to handle event when a ball enters a goal.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenBallInGoal());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenBallInGoalTooltip());
    }
  };
  
  generator.bounce_whenBallInGoal = function() {
    // Generate JavaScript for handling when a ball in goal event occurs.
    return '\n';
  };
  
  blockly.Blocks.bounce_whenBallMissesPaddle = {
    // Block to handle event when a ball misses the paddle.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenBallMissesPaddle());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenBallMissesPaddleTooltip());
    }
  };
  
  generator.bounce_whenBallMissesPaddle = function() {
    // Generate JavaScript for handling when a ball misses the paddle.
    return '\n';
  };
  
  blockly.Blocks.bounce_whenPaddleCollided = {
    // Block to handle event when a wall collision occurs.
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
  
  generator.bounce_whenPaddleCollided = function() {
    // Generate JavaScript for handling when a paddle/ball collision occurs.
    return '\n';
  };
  
  blockly.Blocks.bounce_moveLeft = {
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
  
  generator.bounce_moveLeft = function() {
    // Generate JavaScript for moving left.
    return 'Flappy.moveLeft(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.bounce_moveRight = {
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
  
  generator.bounce_moveRight = function() {
    // Generate JavaScript for moving right.
    return 'Flappy.moveRight(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.bounce_moveUp = {
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
  
  generator.bounce_moveUp = function() {
    // Generate JavaScript for moving up.
    return 'Flappy.moveUp(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.bounce_moveDown = {
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
  
  generator.bounce_moveDown = function() {
    // Generate JavaScript for moving down.
    return 'Flappy.moveDown(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.bounce_playSound = {
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

  blockly.Blocks.bounce_playSound.SOUNDS =
      [[msg.playSoundBounce(), 'wall'],
       [msg.playSoundCrunch(), 'wall0']];
  
  generator.bounce_playSound = function() {
    // Generate JavaScript for playing a sound.
    return 'Flappy.playSound(\'block_id_' + this.id + '\', \'' +
               this.getTitleValue('SOUND') + '\');\n';
  };
  
  blockly.Blocks.bounce_incrementPlayerScore = {
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
  
  generator.bounce_incrementPlayerScore = function() {
    // Generate JavaScript for incrementing the player's score.
    return 'Flappy.incrementPlayerScore(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.bounce_incrementOpponentScore = {
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
  
  generator.bounce_incrementOpponentScore = function() {
    // Generate JavaScript for incrementing the opponent's score.
    return 'Flappy.incrementOpponentScore(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.bounce_bounceBall = {
    // Block for bouncing the ball.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.bounceBall());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.bounceBallTooltip());
    }
  };
  
  generator.bounce_bounceBall = function() {
    // Generate JavaScript for moving forward.
    return 'Flappy.bounceBall(\'block_id_' + this.id + '\');\n';
  };

  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

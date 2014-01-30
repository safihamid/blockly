/**
 * Blockly App: Bounce
 *
 * Copyright 2013 Code.org
 *
 */
'use strict';

var msg = require('../../locale/current/bounce');
var codegen = require('../codegen');

// Install extensions to Blockly's language and JavaScript generator.
exports.install = function(blockly, skin) {

  var generator = blockly.Generator.get('JavaScript');
  blockly.JavaScript = generator;

  blockly.Blocks.bounce_whenRun = {
    // Block to handle event when Run button is pressed.
    helpUrl: '',
    init: function() {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenRun());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenRunTooltip());
    }
  };
  
  generator.bounce_whenRun = function() {
    // Generate JavaScript for handling Run button event.
    return '\n';
  };
  
  blockly.Blocks.bounce_whenWallCollided = {
    // Block to handle event when a wall collision occurs.
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
    // Generate JavaScript for handling when a wall collision occurs.
    return '\n';
  };
  
  blockly.Blocks.bounce_moveForward = {
    // Block for moving forward.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.moveForward());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveForwardTooltip());
    }
  };
  
  generator.bounce_moveForward = function() {
    // Generate JavaScript for moving forward.
    return 'Bounce.moveForward(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.bounce_playSound = {
    // Block for playing sound.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.playSound());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.playSoundTooltip());
    }
  };
  
  generator.bounce_playSound = function() {
    // Generate JavaScript for moving forward.
    return 'Bounce.playSound(\'block_id_' + this.id + '\');\n';
  };
  
  blockly.Blocks.bounce_isWall = {
    // Block for checking if this is a wall.
    helpUrl: '',
    init: function() {
      this.setHSV(196, 1.0, 0.79);
      this.setOutput(true, 'Boolean');
      this.appendDummyInput()
        .appendTitle(msg.isWall());
      this.setTooltip(msg.isWallTooltip());
    }
  };

  generator.bounce_isWall = function() {
    // Generate JavaScript for checking if there is a wall.
    var code = 'Bounce.isWall()';
    return [code, generator.ORDER_FUNCTION_CALL];
  };

  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

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

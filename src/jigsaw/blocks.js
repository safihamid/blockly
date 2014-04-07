/**
 * Blockly App: Bounce
 *
 * Copyright 2013 Code.org
 *
 */
'use strict';

var msg = require('../../locale/current/Jigsaw');

var generateSetterCode = function (ctx, name) {
  var value = ctx.getTitleValue('VALUE');
  if (value === "random") {
    var allValues = ctx.VALUES.slice(1).map(function (item) {
      return item[1];
    });
    value = 'Jigsaw.random([' + allValues + '])';
  }

  return 'Jigsaw.' + name + '(\'block_id_' + ctx.id + '\', ' +
    value + ');\n';
};

// Install extensions to Blockly's language and JavaScript generator.
exports.install = function(blockly, skin) {

  var generator = blockly.Generator.get('JavaScript');
  blockly.JavaScript = generator;


  blockly.Blocks.jigsaw_one = {
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle("                               ");
      this.appendDummyInput();
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setFillPattern('backgroundImage1');
    }
  };

  blockly.Blocks.jigsaw_two = {
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendValueInput();
      this.appendDummyInput()
        .appendTitle("                               ");
      this.appendDummyInput()
      this.appendDummyInput();
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setFillPattern('backgroundImage2');
    }
  };

  blockly.Blocks.jigsaw_three = {
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.setOutput(true);
      this.appendValueInput();
      this.appendDummyInput()
        .appendTitle("                               ");
      this.appendDummyInput()
      this.appendDummyInput();
      // this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setFillPattern('backgroundImage3');
    }
  };

  blockly.Blocks.jigsaw_four = {
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle("                               ");
      this.appendDummyInput();
      this.setPreviousStatement(true);
      this.setNextStatement(false);
      this.setFillPattern('backgroundImage4');
    }
  };









  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

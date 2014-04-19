/**
 * Blockly Demo: Turtle Graphics
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Demonstration of Blockly: Turtle Graphics.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

var Colours = require('./core').Colours;
var msg = require('../../locale/current/turtle');

// Install extensions to Blockly's language and JavaScript generator.
exports.install = function(blockly, skin) {

  var generator = blockly.Generator.get('JavaScript');
  blockly.JavaScript = generator;

  var gensym = function(name) {
    var NAME_TYPE = blockly.Variables.NAME_TYPE;
    return generator.variableDB_.getDistinctName(name, NAME_TYPE);
  };

  // Create a smaller palette.
  blockly.FieldColour.COLOURS = [
    // Row 1.
    Colours.BLACK, Colours.GREY,
    Colours.KHAKI, Colours.WHITE,
    // Row 2.
    Colours.RED, Colours.PINK,
    Colours.ORANGE, Colours.YELLOW,
    // Row 3.
    Colours.GREEN, Colours.BLUE,
    Colours.AQUAMARINE, Colours.PLUM];
  blockly.FieldColour.COLUMNS = 4;

  // Block definitions.
  blockly.Blocks.draw_move_by_constant = {
    // Block for moving forward or backward the internal number of pixels.
    helpUrl: 'http://www.example.com/',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(
              blockly.Blocks.draw_move.DIRECTIONS), 'DIR');
      this.appendDummyInput()
          .appendTitle(new blockly.FieldTextInput('100',
            blockly.FieldTextInput.numberValidator), 'VALUE')
          .appendTitle(msg.dots());
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveForwardTooltip());
    }
  };

  generator.draw_move_by_constant = function() {
    // Generate JavaScript for moving forward or backward the internal number of
    // pixels.
    var value = window.parseFloat(this.getTitleValue('VALUE'));
    return 'Turtle.' + this.getTitleValue('DIR') +
        '(' + value + ', \'block_id_' + this.id + '\');\n';
  };


  blockly.Blocks.draw_turn_by_constant_restricted = {
    // Block for turning either left or right from among a fixed set of angles.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(
              blockly.Blocks.draw_turn.DIRECTIONS), 'DIR');
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.VALUE), 'VALUE')
          .appendTitle(msg.degrees());
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.turnTooltip());
    }
  };

  blockly.Blocks.draw_turn_by_constant_restricted.VALUE =
      [30, 45, 60, 90, 120, 135, 150, 180].
      map(function(t) {return [String(t), String(t)];});

  generator.draw_turn_by_constant_restricted = function() {
    // Generate JavaScript for turning either left or right from among a fixed
    // set of angles.
    var value = window.parseFloat(this.getTitleValue('VALUE'));
    return 'Turtle.' + this.getTitleValue('DIR') +
        '(' + value + ', \'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.draw_turn_by_constant = {
    // Block for turning left or right any number of degrees.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(
              blockly.Blocks.draw_turn.DIRECTIONS), 'DIR');
      this.appendDummyInput()
          .appendTitle(new blockly.FieldTextInput('90',
              blockly.FieldTextInput.numberValidator), 'VALUE')
          .appendTitle(msg.degrees());
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.turnTooltip());
    }
  };

  generator.draw_turn_by_constant = function() {
    // Generate JavaScript for turning left or right.
    var value = window.parseFloat(this.getTitleValue('VALUE'));
    return 'Turtle.' + this.getTitleValue('DIR') +
        '(' + value + ', \'block_id_' + this.id + '\');\n';
  };

  generator.draw_move_inline = function() {
    // Generate JavaScript for moving forward or backward the internal number of
    // pixels.
    var value = window.parseFloat(this.getTitleValue('VALUE'));
    return 'Turtle.' + this.getTitleValue('DIR') +
        '(' + value + ', \'block_id_' + this.id + '\');\n';
  };


  blockly.Blocks.draw_turn_inline_restricted = {
    // Block for turning either left or right from among a fixed set of angles.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(
              blockly.Blocks.draw_turn.DIRECTIONS), 'DIR');
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.VALUE), 'VALUE')
          .appendTitle(msg.degrees());
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.turnTooltip());
    }
  };

  blockly.Blocks.draw_turn_inline_restricted.VALUE =
      [30, 45, 60, 90, 120, 135, 150, 180].
      map(function(t) {return [String(t), String(t)];});

  generator.draw_turn_inline_restricted = function() {
    // Generate JavaScript for turning either left or right from among a fixed
    // set of angles.
    var value = window.parseFloat(this.getTitleValue('VALUE'));
    return 'Turtle.' + this.getTitleValue('DIR') +
        '(' + value + ', \'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.draw_turn_inline = {
    // Block for turning left or right any number of degrees.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(
              blockly.Blocks.draw_turn.DIRECTIONS), 'DIR');
      this.appendDummyInput()
          .appendTitle(new blockly.FieldTextInput('90',
              blockly.FieldTextInput.numberValidator), 'VALUE')
          .appendTitle(msg.degrees());
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.turnTooltip());
    }
  };

  generator.draw_turn_inline = function() {
    // Generate JavaScript for turning left or right.
    var value = window.parseFloat(this.getTitleValue('VALUE'));
    return 'Turtle.' + this.getTitleValue('DIR') +
        '(' + value + ', \'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.variables_get_counter = {
    // Variable getter.
    category: null,  // Variables are handled specially.
    helpUrl: blockly.Msg.VARIABLES_GET_HELPURL,
    init: function() {
      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(blockly.Msg.VARIABLES_GET_TITLE)
          .appendTitle(new blockly.FieldLabel(msg.loopVariable()), 'VAR');
      this.setOutput(true);
      this.setTooltip(blockly.Msg.VARIABLES_GET_TOOLTIP);
    },
    getVars: function() {
      return [this.getTitleValue('VAR')];
    }
  };

  generator.variables_get_counter = generator.variables_get;

  blockly.Blocks.variables_get_length = {
    // Variable getter.
    category: null,  // Variables are handled specially.
    helpUrl: blockly.Msg.VARIABLES_GET_HELPURL,
    init: function() {
      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(blockly.Msg.VARIABLES_GET_TITLE)
          .appendTitle(new blockly.FieldLabel(msg.lengthParameter()), 'VAR');
      this.setOutput(true);
      this.setTooltip(blockly.Msg.VARIABLES_GET_TOOLTIP);
    },
    getVars: function() {
      return [this.getTitleValue('VAR')];
    }
  };

  generator.variables_get_length = generator.variables_get;

  blockly.Blocks.variables_get_sides = {
    // Variable getter.
    category: null,  // Variables are handled specially.
    helpUrl: blockly.Msg.VARIABLES_GET_HELPURL,
    init: function() {
      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(blockly.Msg.VARIABLES_GET_TITLE)
          .appendTitle(new blockly.FieldLabel('sides'), 'VAR');
      this.setOutput(true);
      this.setTooltip(blockly.Msg.VARIABLES_GET_TOOLTIP);
    },
    getVars: function() {
      return [this.getTitleValue('VAR')];
    }
  };

  generator.variables_get_sides = generator.variables_get;

  // Create a fake "draw a square" function so it can be made available to users
  // without being shown in the workspace.
  blockly.Blocks.draw_a_square = {
    // Draw a square.
    init: function() {
      this.setHSV(94, 0.84, 0.60);
      this.appendDummyInput()
          .appendTitle(msg.drawASquare());
      this.appendValueInput('VALUE')
          .setAlign(blockly.ALIGN_RIGHT)
          .setCheck('Number')
              .appendTitle(msg.lengthParameter() + ':');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      this.setTooltip('');
    }
  };

  generator.draw_a_square = function() {
    // Generate JavaScript for drawing a square.
    var value_length = generator.valueToCode(
        this, 'VALUE', generator.ORDER_ATOMIC);
    var loopVar = gensym('count');
    return [
        // The generated comment helps detect required blocks.
        // Don't change it without changing REQUIRED_BLOCKS.
        '// draw_a_square',
        'for (var ' + loopVar + ' = 0; ' + loopVar + ' < 4; ' +
              loopVar + '++) {',
        '  Turtle.moveForward(' + value_length + ');',
        '  Turtle.turnRight(90);',
        '}\n'].join('\n');
  };

  // Create a fake "draw a snowman" function so it can be made available to
  // users without being shown in the workspace.
  blockly.Blocks.draw_a_snowman = {
    // Draw a circle in front of the turtle, ending up on the opposite side.
    init: function() {
      this.setHSV(94, 0.84, 0.60);
      this.appendDummyInput()
          .appendTitle(msg.drawASnowman());
      this.appendValueInput('VALUE')
          .setAlign(blockly.ALIGN_RIGHT)
          .setCheck('Number')
          .appendTitle(msg.lengthParameter() + ':');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip('');
    }
  };

  generator.draw_a_snowman = function() {
    // Generate JavaScript for drawing a snowman in front of the turtle.
    var value = generator.valueToCode(
        this, 'VALUE', generator.ORDER_ATOMIC);
    var distancesVar = gensym('distances');
    var loopVar = gensym('counter');
    var degreeVar = gensym('degree');
    var distanceVar = gensym('distance');
    return [
      // The generated comment helps detect required blocks.
      // Don't change it without changing REQUIRED_BLOCKS.
      '// draw_a_snowman',
      'Turtle.turnLeft(90);',
      'var ' + distancesVar + ' = [' + value + ' * 0.5, ' + value + ' * 0.3,' +
          value + ' * 0.2];',
      'for (var ' + loopVar + ' = 0; ' + loopVar + ' < 6; ' +
          loopVar + '++) {\n',
      '  var ' + distanceVar + ' = ' + distancesVar + '[' + loopVar +
          ' < 3 ? ' + loopVar + ': 5 - ' + loopVar + '] / 57.5;',
      '  for (var ' + degreeVar + ' = 0; ' + degreeVar + ' < 90; ' +
          degreeVar + '++) {',
      '    Turtle.moveForward(' + distanceVar + ');',
      '    Turtle.turnRight(2);',
      '  }',
      '  if (' + loopVar + ' != 2) {',
      '    Turtle.turnLeft(180);',
      '  }',
      '}',
      'Turtle.turnLeft(90);\n'].join('\n');
  };

  // This is a modified copy of blockly.Blocks.controls_for with the
  // variable named "counter" hardcoded.
  blockly.Blocks.controls_for_counter = {
    // For loop with hardcoded loop variable.
    helpUrl: blockly.Msg.CONTROLS_FOR_HELPURL,
    init: function() {
      this.setHSV(322, 0.90, 0.95);
      this.appendDummyInput()
          .appendTitle(blockly.Msg.CONTROLS_FOR_INPUT_WITH)
          .appendTitle(new blockly.FieldLabel(msg.loopVariable()),
                       'VAR');
      this.interpolateMsg(blockly.Msg.CONTROLS_FOR_INPUT_FROM_TO_BY,
                        ['FROM', 'Number', blockly.ALIGN_RIGHT],
                        ['TO', 'Number', blockly.ALIGN_RIGHT],
                        ['BY', 'Number', blockly.ALIGN_RIGHT],
                        blockly.ALIGN_RIGHT);
      this.appendStatementInput('DO')
          .appendTitle(Blockly.Msg.CONTROLS_FOR_INPUT_DO);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      this.setTooltip(blockly.Msg.CONTROLS_FOR_TOOLTIP.replace(
          '%1', this.getTitleValue('VAR')));
    },
    getVars: function() {
      return [this.getTitleValue('VAR')];
    },
    customContextMenu: function(options) {
      var option = {enabled: true};
      var name = this.getTitleValue('VAR');
      option.text = blockly.Msg.VARIABLES_SET_CREATE_GET.replace('%1', name);
      var xmlTitle = document.createElement('title');
      xmlTitle.appendChild(document.createTextNode(name));
      xmlTitle.setAttribute('name', 'VAR');
      var xmlBlock = document.createElement('block');
      xmlBlock.appendChild(xmlTitle);
      xmlBlock.setAttribute('type', 'variables_get_counter');
      option.callback = blockly.ContextMenu.callbackFactory(this, xmlBlock);
      options.push(option);
    }
  };

  generator.controls_for_counter = generator.controls_for;

  // Delete these standard blocks.
  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;

  // General blocks.

  blockly.Blocks.draw_move = {
    // Block for moving forward or backwards.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendValueInput('VALUE')
          .setCheck('Number')
          .appendTitle(new blockly.FieldDropdown(
              blockly.Blocks.draw_move.DIRECTIONS), 'DIR');
      this.appendDummyInput()
          .appendTitle(msg.dots());
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveTooltip());
    }
  };

  blockly.Blocks.draw_move.DIRECTIONS =
      [[msg.moveForward(), 'moveForward'],
       [msg.moveBackward(), 'moveBackward']];

  generator.draw_move = function() {
    // Generate JavaScript for moving forward or backwards.
    var value = generator.valueToCode(this, 'VALUE',
        generator.ORDER_NONE) || '0';
    return 'Turtle.' + this.getTitleValue('DIR') +
        '(' + value + ', \'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.jump = {
    // Block for moving forward or backwards.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendValueInput('VALUE')
          .setCheck('Number')
          .appendTitle(new blockly.FieldDropdown(
              blockly.Blocks.jump.DIRECTIONS), 'DIR');
      this.appendDummyInput()
          .appendTitle(msg.dots());
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.jumpTooltip());
    }
  };

  var SimpleMove = {
    DEFAULT_MOVE_LENGTH: 50,
    SHORT_MOVE_LENGTH: 25,
    LONG_MOVE_LENGTH: 100,
    DIRECTION_CONFIGS: {
      left: { letter: 'W', moveFunction: 'moveLeft', image: skin.leftArrow, image_width: 42, image_height: 42 },
      right: { letter: 'E', moveFunction: 'moveRight', image: skin.rightArrow, image_width: 42, image_height: 42 },
      up: { letter: 'N', moveFunction: 'moveUp', image: skin.upArrow, image_width: 42, image_height: 42 },
      down: { letter: 'S', moveFunction: 'moveDown', image: skin.downArrow, image_width: 42, image_height: 42 },
      jump_left: { letter: 'W', moveFunction: 'jumpLeft', image: skin.leftJumpArrow, image_width: 42, image_height: 42 },
      jump_right: { letter: 'E', moveFunction: 'jumpRight', image: skin.rightJumpArrow, image_width: 42, image_height: 42 },
      jump_up: { letter: 'N', moveFunction: 'jumpUp', image: skin.upJumpArrow, image_width: 42, image_height: 42 },
      jump_down: { letter: 'S', moveFunction: 'jumpDown', image: skin.downJumpArrow, image_width: 42, image_height: 42 }
    },
    generateBlocksForAllDirections: function() {
      SimpleMove.generateBlocksForDirection("up");
      SimpleMove.generateBlocksForDirection("down");
      SimpleMove.generateBlocksForDirection("left");
      SimpleMove.generateBlocksForDirection("right");
    },
    generateBlocksForDirection: function(direction) {
      generator["simple_move_" + direction] = SimpleMove.generateCodeGenerator(direction);
      generator["simple_jump_" + direction] = SimpleMove.generateCodeGenerator('jump_' + direction);
      generator["simple_move_" + direction + "_length"] = SimpleMove.generateCodeGenerator(direction, true);
      generator["simple_jump_" + direction + "_length"] = SimpleMove.generateCodeGenerator('jump_' + direction, true);
      blockly.Blocks['simple_move_' + direction + '_length'] = SimpleMove.generateBlock(direction, true);
      blockly.Blocks['simple_jump_' + direction + '_length'] = SimpleMove.generateBlock('jump_' + direction, true);
      blockly.Blocks['simple_move_' + direction] = SimpleMove.generateBlock(direction);
      blockly.Blocks['simple_jump_' + direction] = SimpleMove.generateBlock('jump_' + direction);
    },
    generateBlock: function(direction, hasLengthInput) {
      var directionConfig = SimpleMove.DIRECTION_CONFIGS[direction];
      return {
        helpUrl: '',
        init: function () {
          this.setHSV(184, 1.00, 0.74);
          this.appendDummyInput()
            .appendTitle(directionConfig.letter)
            .appendTitle(new blockly.FieldImage(directionConfig.image, directionConfig.image_width, directionConfig.image_height));
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setTooltip(msg.jumpTooltip());
          if (hasLengthInput) {
            this.setInputsInline(true);
            this.appendValueInput("length").setCheck("Number");
          }
        }
      };
    },
    generateCodeGenerator: function(direction, hasLengthInput) {
      return function() {
        var length = SimpleMove.DEFAULT_MOVE_LENGTH;

        if (hasLengthInput) {
          var lengthInputResult = generator.valueToCode(this, 'length', generator.ORDER_ATOMIC);
          length = lengthInputResult || length; // Allow empty input
        }
        return 'Turtle.' + SimpleMove.DIRECTION_CONFIGS[direction].moveFunction + '(' + length + ',' + '\'block_id_' + this.id + '\');\n';
      };
    },
    stretchedLine: function(width) {
      var lineImage = new blockly.FieldImage(skin.offsetLineSlice, width, 9);
      lineImage.setPreserveAspectRatio("none");
      return lineImage;
    }
  };

  SimpleMove.generateBlocksForAllDirections();

  blockly.Blocks.simple_move_length_short = {
    init: function() {
      this.setHSV(258, 0.35, 0.62);
      this.appendDummyInput().appendTitle(SimpleMove.stretchedLine(SimpleMove.SHORT_MOVE_LENGTH));
      this.setOutput(true, 'Number');
    }
  };
  blockly.Blocks.simple_move_length_long = {
    init: function() {
      this.setHSV(258, 0.35, 0.62);
      this.appendDummyInput().appendTitle(SimpleMove.stretchedLine(SimpleMove.LONG_MOVE_LENGTH));
      this.setOutput(true, 'Number');
    }
  };

  generator.simple_move_length_short = function () {
    return [SimpleMove.SHORT_MOVE_LENGTH, generator.ORDER_ATOMIC];
  };
  generator.simple_move_length_long = function () {
    return [SimpleMove.LONG_MOVE_LENGTH, generator.ORDER_ATOMIC];
  };

  generator.controls_repeat_k1 = function() {
    // Repeat n times (internal number).
    var repeats = Number(this.getTitleValue('TIMES'));
    var branch = Blockly.JavaScript.statementToCode(this, 'DO');
    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
      branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
          '\'' + this.id + '\'') + branch;
    }
    var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
    var code = 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + repeats + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
    return code;
  };

  blockly.Blocks.controls_repeat_k1 = {
    // Repeat n times (internal number).
    init: function() {
      this.setHelpUrl(Blockly.Msg.CONTROLS_REPEAT_HELPURL);
      this.setHSV(322, 0.90, 0.95);
      this.appendStatementInput('DO')
        .appendTitle(new blockly.FieldImage(skin.repeat, 24, 24));
      this.appendDummyInput()
        .appendTitle(Blockly.Msg.CONTROLS_REPEAT_TITLE_REPEAT)
        .appendTitle(new Blockly.FieldTextInput('10',
          Blockly.FieldTextInput.nonnegativeIntegerValidator), 'TIMES')
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(Blockly.Msg.CONTROLS_REPEAT_TOOLTIP);
    }
  };

  blockly.Blocks.jump.DIRECTIONS =
      [[msg.jumpForward(), 'jumpForward'],
       [msg.jumpBackward(), 'jumpBackward']];

  generator.jump = function() {
    // Generate JavaScript for jumping forward or backwards.
    var value = generator.valueToCode(this, 'VALUE',
        generator.ORDER_NONE) || '0';
    return 'Turtle.' + this.getTitleValue('DIR') +
        '(' + value + ', \'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.draw_turn = {
    // Block for turning left or right.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendValueInput('VALUE')
          .setCheck('Number')
          .appendTitle(new blockly.FieldDropdown(
              blockly.Blocks.draw_turn.DIRECTIONS), 'DIR');
      this.appendDummyInput()
          .appendTitle(msg.degrees());
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.turnTooltip());
    }
  };

  blockly.Blocks.draw_turn.DIRECTIONS =
      [[msg.turnRight(), 'turnRight'],
       [msg.turnLeft(), 'turnLeft']];

  generator.draw_turn = function() {
    // Generate JavaScript for turning left or right.
    var value = generator.valueToCode(this, 'VALUE',
        generator.ORDER_NONE) || '0';
    return 'Turtle.' + this.getTitleValue('DIR') +
        '(' + value + ', \'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.draw_width = {
    // Block for setting the pen width.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendValueInput('WIDTH')
          .setCheck('Number')
          .appendTitle(msg.setWidth());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.widthTooltip());
    }
  };

  generator.draw_width = function() {
    // Generate JavaScript for setting the pen width.
    var width = generator.valueToCode(this, 'WIDTH',
        generator.ORDER_NONE) || '1';
    return 'Turtle.penWidth(' + width + ', \'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.draw_pen = {
    // Block for pen up/down.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.STATE), 'PEN');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.penTooltip());
    }
  };

  blockly.Blocks.draw_pen.STATE =
      [[msg.penUp(), 'penUp'],
       [msg.penDown(), 'penDown']];

  generator.draw_pen = function() {
    // Generate JavaScript for pen up/down.
    return 'Turtle.' + this.getTitleValue('PEN') +
        '(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.draw_colour = {
    // Block for setting the colour.
    helpUrl: '',
    init: function() {
      this.setHSV(42, 0.89, 0.99);
      this.appendValueInput('COLOUR')
          .setCheck('Colour')
          .appendTitle(msg.setColour());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      this.setTooltip(msg.colourTooltip());
    }
  };

  generator.draw_colour = function() {
    // Generate JavaScript for setting the colour.
    var colour = generator.valueToCode(this, 'COLOUR',
        generator.ORDER_NONE) || '\'#000000\'';
    return 'Turtle.penColour(' + colour + ', \'block_id_' +
        this.id + '\');\n';
  };
  
  blockly.Blocks.up_big = {
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.appendDummyInput()
        .appendTitle(new blockly.FieldDropdown(this.STATE), 'VISIBILITY');
      this.setTooltip(msg.turtleVisibilityTooltip());
    }
  };

  generator.up_big = function() {
    // Generate JavaScript for setting the colour.
    var colour = generator.valueToCode(this, 'COLOUR',
      generator.ORDER_NONE) || '\'#000000\'';
    return 'Turtle.penColour(' + colour + ', \'block_id_' +
      this.id + '\');\n';
  };

  blockly.Blocks.turtle_visibility = {
    // Block for changing turtle visiblity.
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.STATE), 'VISIBILITY');
      this.setTooltip(msg.turtleVisibilityTooltip());
    }
  };

  blockly.Blocks.turtle_visibility.STATE =
      [[msg.hideTurtle(), 'hideTurtle'],
       [msg.showTurtle(), 'showTurtle']];

  generator.turtle_visibility = function() {
    // Generate JavaScript for changing turtle visibility.
    return 'Turtle.' + this.getTitleValue('VISIBILITY') +
        '(\'block_id_' + this.id + '\');\n';
  };

};

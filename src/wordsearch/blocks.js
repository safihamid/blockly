/**
 * Blockly Demo: Maze
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
 * @fileoverview Demonstration of Blockly: Solving a maze.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

var msg = require('../../locale/current/wordsearch');
var codegen = require('../codegen');

// Install extensions to Blockly's language and JavaScript generator.
exports.install = function(blockly, skin) {

  var generator = blockly.Generator.get('JavaScript');
  blockly.JavaScript = generator;

  blockly.Blocks.maze_moveForward = {
    // Block for moving forward.
    helpUrl: 'http://code.google.com/p/blockly/wiki/Move',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(msg.moveForward());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.moveForwardTooltip());
    }
  };

  generator.maze_moveForward = function() {
    // Generate JavaScript for moving forward.
    return 'Maze.moveForward(\'block_id_' + this.id + '\');\n';
  };

  var SimpleMove = {
    DIRECTION_CONFIGS: {
      West: { letter: 'W' },
      East: { letter: 'E' },
      North: { letter: 'N' },
      South: { letter: 'S' },
    },
    generateBlocksForAllDirections: function() {
      SimpleMove.generateBlocksForDirection("North");
      SimpleMove.generateBlocksForDirection("South");
      SimpleMove.generateBlocksForDirection("West");
      SimpleMove.generateBlocksForDirection("East");
    },
    generateBlocksForDirection: function(direction) {
      generator["maze_move" + direction] = SimpleMove.generateCodeGenerator(direction);
      blockly.Blocks['maze_move' + direction] = SimpleMove.generateBlock(direction);
    },
    generateBlock: function(direction) {
      var directionConfig = SimpleMove.DIRECTION_CONFIGS[direction];
      return {
        helpUrl: '',
        init: function () {
          this.setHSV(184, 1.00, 0.74);
          this.appendDummyInput()
            .appendTitle(directionConfig.letter);
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setTooltip(msg.moveForwardTooltip());
        }
      };
    },
    generateCodeGenerator: function(direction) {
      return function() {
        return 'Maze.move' + direction + '(\'block_id_' + this.id + '\');\n';
      };
    }
  };

  SimpleMove.generateBlocksForAllDirections();

  blockly.Blocks.maze_fill = {
    // Block for putting dirt on to a tile.
    helpUrl: 'http://code.google.com/p/blockly/wiki/PutDown',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(msg.fill());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.fillTooltip());
    }
  };

  generator.maze_fill = function() {
    // Generate JavaScript for putting dirt on to a tile.
    return 'Maze.fill(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.maze_dig = {
    // Block for putting for removing dirt from a tile.
    helpUrl: 'http://code.google.com/p/blockly/wiki/PickUp',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(msg.dig());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.digTooltip());
    }
  };

  generator.maze_dig = function() {
    // Generate JavaScript for removing dirt from a tile.
    return 'Maze.dig(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.maze_turn = {
    // Block for turning left or right.
    helpUrl: 'http://code.google.com/p/blockly/wiki/Turn',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.turnTooltip());
    }
  };

  blockly.Blocks.maze_turn.DIRECTIONS =
      [[msg.turnLeft() + ' \u21BA', 'turnLeft'],
       [msg.turnRight() + ' \u21BB', 'turnRight']];

  generator.maze_turn = function() {
    // Generate JavaScript for turning left or right.
    var dir = this.getTitleValue('DIR');
    return 'Maze.' + dir + '(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.maze_isPath = {
    // Block for checking if there a path.
    helpUrl: '',
    init: function() {
      this.setHSV(196, 1.0, 0.79);
      this.setOutput(true, 'Boolean');
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
      this.setTooltip(msg.isPathTooltip());
    }
  };

  blockly.Blocks.maze_isPath.DIRECTIONS =
      [[msg.ifPathAhead(), 'isPathForward'],
       [msg.pathLeft() + ' \u21BA', 'isPathLeft'],
       [msg.pathRight() + ' \u21BB', 'isPathRight']];

  generator.maze_isPath = function() {
    // Generate JavaScript for checking if there is a path.
    var code = 'Maze.' + this.getTitleValue('DIR') + '()';
    return [code, generator.ORDER_FUNCTION_CALL];
  };

  blockly.Blocks.maze_if = {
    // Block for 'if' conditional if there is a path.
    helpUrl: '',
    init: function() {
      this.setHSV(196, 1.0, 0.79);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
      this.setInputsInline(true);
      this.appendStatementInput('DO')
          .appendTitle(msg.doCode());
      this.setTooltip(msg.ifTooltip());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };

  blockly.Blocks.maze_if.DIRECTIONS =
      blockly.Blocks.maze_isPath.DIRECTIONS;

  generator.maze_if = function() {
    // Generate JavaScript for 'if' conditional if there is a path.
    var argument = 'Maze.' + this.getTitleValue('DIR') +
        '(\'block_id_' + this.id + '\')';
    var branch = generator.statementToCode(this, 'DO');
    var code = 'if (' + argument + ') {\n' + branch + '}\n';
    return code;
  };

  blockly.Blocks.maze_ifElse = {
    // Block for 'if/else' conditional if there is a path.
    helpUrl: '',
    init: function() {
      this.setHSV(196, 1.0, 0.79);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
      this.setInputsInline(true);
      this.appendStatementInput('DO')
          .appendTitle(msg.doCode());
      this.appendStatementInput('ELSE')
          .appendTitle(msg.elseCode());
      this.setTooltip(msg.ifelseTooltip());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };

  blockly.Blocks.maze_ifElse.DIRECTIONS =
      blockly.Blocks.maze_isPath.DIRECTIONS;

  generator.maze_ifElse = function() {
    // Generate JavaScript for 'if/else' conditional if there is a path.
    var argument = 'Maze.' + this.getTitleValue('DIR') +
        '(\'block_id_' + this.id + '\')';
    var branch0 = generator.statementToCode(this, 'DO');
    var branch1 = generator.statementToCode(this, 'ELSE');
    var code = 'if (' + argument + ') {\n' + branch0 +
               '} else {\n' + branch1 + '}\n';
    return code;
  };

  blockly.Blocks.karel_if = {
    // Block for 'if' conditional if there is a path.
    helpUrl: '',
    init: function() {
      this.setHSV(196, 1.0, 0.79);
      this.appendDummyInput()
          .appendTitle(msg.ifCode());
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
      this.setInputsInline(true);
      this.appendStatementInput('DO')
          .appendTitle(msg.doCode());
      this.setTooltip(msg.ifTooltip());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };

  generator.karel_if = function() {
    // Generate JavaScript for 'if' conditional if there is a path.
    var argument = 'Maze.' + this.getTitleValue('DIR') +
        '(\'block_id_' + this.id + '\')';
    var branch = generator.statementToCode(this, 'DO');
    var code = 'if (' + argument + ') {\n' + branch + '}\n';
    return code;
  };

  blockly.Blocks.karel_if.DIRECTIONS = [
       [msg.pilePresent(), 'pilePresent'],
       [msg.holePresent(), 'holePresent'],
       [msg.pathAhead(), 'isPathForward']
  //     [msg.noPathAhead(), 'noPathForward']
  ];


  blockly.Blocks.karel_ifElse = {
    // Block for 'if/else' conditional if there is a path.
    helpUrl: '',
    init: function() {
      this.setHSV(196, 1.0, 0.79);
      this.appendDummyInput()
          .appendTitle(msg.ifCode());
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
      this.setInputsInline(true);
      this.appendStatementInput('DO')
          .appendTitle(msg.doCode());
      this.appendStatementInput('ELSE')
          .appendTitle(msg.elseCode());
      this.setTooltip(msg.ifelseTooltip());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };

  generator.karel_ifElse = function() {
    // Generate JavaScript for 'if/else' conditional if there is a path.
    var argument = 'Maze.' + this.getTitleValue('DIR') +
        '(\'block_id_' + this.id + '\')';
    var branch0 = generator.statementToCode(this, 'DO');
    var branch1 = generator.statementToCode(this, 'ELSE');
    var code = 'if (' + argument + ') {\n' + branch0 +
               '} else {\n' + branch1 + '}\n';
    return code;
  };

  blockly.Blocks.karel_ifElse.DIRECTIONS =
      blockly.Blocks.karel_if.DIRECTIONS;

  blockly.Blocks.maze_whileNotClear = {
    helpUrl: 'http://code.google.com/p/blockly/wiki/Repeat',
    init: function() {
      this.setHSV(322, 0.90, 0.95);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
      this.appendStatementInput('DO')
          .appendTitle(msg.doCode());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.whileTooltip());
    }
  };

  generator.maze_whileNotClear = function() {
    var argument = 'Maze.' + this.getTitleValue('DIR') +
      '(\'block_id_' + this.id + '\')';
    var branch = generator.statementToCode(this, 'DO');
    branch = codegen.loopTrap(this.id) + branch;
    return 'while (' + argument + ') {\n' + branch + '}\n';
  };

  blockly.Blocks.maze_whileNotClear.DIRECTIONS = [
    [msg.while() + ' ' + msg.pilePresent(), 'pilePresent'],
    [msg.while() + ' ' + msg.holePresent(), 'holePresent']
  ];

  blockly.Blocks.maze_untilBlocked = {
    helpUrl: 'http://code.google.com/p/blockly/wiki/Repeat',
    init: function() {
      this.setHSV(322, 0.90, 0.95);
      this.appendDummyInput()
          .appendTitle(msg.repeatUntilBlocked());
      this.appendStatementInput('DO')
          .appendTitle(msg.doCode());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.whileTooltip());
    }
  };

  generator.maze_untilBlocked = function() {
    var argument = 'Maze.isPathForward' + '(\'block_id_' + this.id + '\')';
    var branch = generator.statementToCode(this, 'DO');
    branch = codegen.loopTrap(this.id) + branch;
    return 'while (' + argument + ') {\n' + branch + '}\n';
  };

  blockly.Blocks.maze_forever = {
    // Do forever loop.
    helpUrl: 'http://code.google.com/p/blockly/wiki/Repeat',
    init: function() {
      this.setHSV(322, 0.90, 0.95);
      this.appendDummyInput()
          .appendTitle(msg.repeatUntil())
          .appendTitle(new blockly.FieldImage(skin.maze_forever, 35, 35));
      this.appendStatementInput('DO')
          .appendTitle(msg.doCode());
      this.setPreviousStatement(true);
      this.setTooltip(msg.whileTooltip());
    }
  };

  generator.maze_forever = function() {
    // Generate JavaScript for do forever loop.
    var branch = generator.statementToCode(this, 'DO');
    branch = codegen.loopTrap(this.id) + branch;
    return 'while (Maze.notFinished()) {\n' + branch + '}\n';
  };

  blockly.Blocks.maze_untilBlockedOrNotClear = {
    helpUrl: 'http://code.google.com/p/blockly/wiki/Repeat',
    init: function() {
      this.setHSV(322, 0.90, 0.95);
      this.appendDummyInput()
          .appendTitle(new blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
      this.appendStatementInput('DO')
          .appendTitle(msg.doCode());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.whileTooltip());
    }
  };

  generator.maze_untilBlockedOrNotClear = function() {
    var argument = 'Maze.' + this.getTitleValue('DIR') +
        '(\'block_id_' + this.id + '\')';
    var branch = generator.statementToCode(this, 'DO');
    branch = codegen.loopTrap(this.id) + branch;
    return 'while (' + argument + ') {\n' + branch + '}\n';
  };

  blockly.Blocks.maze_untilBlockedOrNotClear.DIRECTIONS = [
       [msg.while() + ' ' + msg.pilePresent(), 'pilePresent'],
       [msg.while() + ' ' + msg.holePresent(), 'holePresent'],
       [msg.repeatUntilBlocked(), 'isPathForward']
  ];

  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;

};

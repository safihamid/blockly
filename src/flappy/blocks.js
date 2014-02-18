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

  blockly.Blocks.flappy_whenCollideGround = {
    // Block to handle event where flappy hits ground
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenCollideGround());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenCollideGroundTooltip());
    }
  };

  generator.flappy_whenCollideGround = function () {
    // Generate JavaScript for handling click event.
    return '\n';
  };

  blockly.Blocks.flappy_whenCollidePipe = {
    // Block to handle event where flappy hits a pipe
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenCollidePipe());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenCollidePipeTooltip());
    }
  };

  generator.flappy_whenCollidePipe = function () {
    // Generate JavaScript for handling collide pipe event.
    return '\n';
  };

  blockly.Blocks.flappy_whenEnterPipe = {
    // Block to handle event where flappy enters a pipe
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenEnterPipe());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenEnterPipeTooltip());
    }
  };

  generator.flappy_whenEnterPipe = function () {
    // Generate JavaScript for handling enter pipe.
    return '\n';
  };

  generator.flappy_whenRunButtonClick = function () {
    // Generate JavaScript for handling run button click.
    return '\n';
  };

  blockly.Blocks.flappy_whenRunButtonClick = {
    // Block to handle event where run button is clicked
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenRunButtonClick());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenRunButtonClickTooltip());
    }
  };

  generator.flappy_whenRunButtonClick = function () {
    // Generate JavaScript for handling run button click
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
    return 'Flappy.flap(\'block_id_' + this.id + '\', ' + Flappy.FLAP_VELOCITY + ');\n';
  };

  blockly.Blocks.flappy_playSound = {
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

  // todo - add messages
  blockly.Blocks.flappy_playSound.SOUNDS =
      [[msg.playSoundBounce(), 'wall'],
       [msg.playSoundCrunch(), 'wall0'],
       [msg.playSoundDie(), 'sfx_die'],
       [msg.playSoundHit(), 'sfx_hit'],
       [msg.playSoundPoint(), 'sfx_point'],
       [msg.playSoundSwoosh(), 'sfx_swooshing'],
       [msg.playSoundWing(), 'sfx_wing']];

  generator.flappy_playSound = function() {
    // Generate JavaScript for playing a sound.
    return 'Flappy.playSound(\'block_id_' + this.id + '\', \'' +
               this.getTitleValue('SOUND') + '\');\n';
  };

  blockly.Blocks.flappy_incrementPlayerScore = {
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

  generator.flappy_incrementPlayerScore = function() {
    // Generate JavaScript for incrementing the player's score.
    return 'Flappy.incrementPlayerScore(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.flappy_endGame = {
    helpUrl: '',
    init: function() {
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.endGame());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.endGameTooltip());
    }
  };

  generator.flappy_endGame = function() {
    // Generate JavaScript for incrementing the player's score.
    return 'Flappy.endGame(\'block_id_' + this.id + '\');\n';
  };

  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

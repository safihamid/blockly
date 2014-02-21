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

  blockly.Blocks.flappy_whenCollideObstacle = {
    // Block to handle event where flappy hits a Obstacle
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenCollideObstacle());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenCollideObstacleTooltip());
    }
  };

  generator.flappy_whenCollideObstacle = function () {
    // Generate JavaScript for handling collide Obstacle event.
    return '\n';
  };

  blockly.Blocks.flappy_whenEnterObstacle = {
    // Block to handle event where flappy enters a Obstacle
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(msg.whenEnterObstacle());
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setTooltip(msg.whenEnterObstacleTooltip());
    }
  };

  generator.flappy_whenEnterObstacle = function () {
    // Generate JavaScript for handling enter Obstacle.
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
    return 'Flappy.flap(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.flappy_flap_height = {
    // Block for flapping (flying upwards)
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.HEIGHTS);
      dropdown.setValue(this.HEIGHTS[2][1]);

      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(dropdown, 'HEIGHT');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.flapTooltip());
    }
  };

  blockly.Blocks.flappy_flap_height.HEIGHTS =
      [[msg.flapVerySmall(), 'Flappy.FlapHeight.VERY_SMALL'],
       [msg.flapSmall(), 'Flappy.FlapHeight.SMALL'],
       [msg.flapNormal(), 'Flappy.FlapHeight.NORMAL'],
       [msg.flapLarge(), 'Flappy.FlapHeight.LARGE'],
       [msg.flapVeryLarge(), 'Flappy.FlapHeight.VERY_LARGE']];

  generator.flappy_flap_height = function (velocity) {
    // Generate JavaScript for moving left.
    return 'Flappy.flap(\'block_id_' + this.id + '\', ' +
        this.getTitleValue('HEIGHT') + ');\n';
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

  /**
   * setSpeed
   */
  blockly.Blocks.flappy_setSpeed = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[2][1]);

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setSpeedTooltip());
    }
  };

  blockly.Blocks.flappy_setSpeed.VALUES =
      [[msg.speedVerySlow(), 'Flappy.LevelSpeed.VERY_SLOW'],
       [msg.speedSlow(), 'Flappy.LevelSpeed.SLOW'],
       [msg.speedNormal(), 'Flappy.LevelSpeed.NORMAL'],
       [msg.speedFast(), 'Flappy.LevelSpeed.FAST'],
       [msg.speedVeryFast(), 'Flappy.LevelSpeed.VERY_FAST']];

  generator.flappy_setSpeed = function() {
    return 'Flappy.setSpeed(\'block_id_' + this.id + '\', ' +
      this.getTitleValue('VALUE') + ');\n';
  };

  /**
   * setGapHeight
   */
  blockly.Blocks.flappy_setGapHeight = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setGapHeightTooltip());
    }
  };

  blockly.Blocks.flappy_setGapHeight.VALUES =
      [[msg.setGapVerySmall(), 'Flappy.GapHeight.VERY_SMALL'],
       [msg.setGapSmall(), 'Flappy.GapHeight.SMALL'],
       [msg.setGapNormal(), 'Flappy.GapHeight.NORMAL'],
       [msg.setGapLarge(), 'Flappy.GapHeight.LARGE'],
       [msg.setGapVeryLarge(), 'Flappy.GapHeight.VERY_LARGE']];

  generator.flappy_setGapHeight = function() {
    return 'Flappy.setGapHeight(\'block_id_' + this.id + '\', ' +
      this.getTitleValue('VALUE') + ');\n';
  };

  /**
   * setBackground
   */
  blockly.Blocks.flappy_setBackground = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setBackgroundTooltip());
    }
  };

  blockly.Blocks.flappy_setBackground.VALUES =
      [[msg.setBackgroundFlappy(), '"flappy"'],
       [msg.setBackgroundSciFi(), '"scifi"']];

  generator.flappy_setBackground = function() {
    return 'Flappy.setBackground(\'block_id_' + this.id + '\', ' +
      this.getTitleValue('VALUE') + ');\n';
  };

  /**
   * setPlayer
   */
  blockly.Blocks.flappy_setPlayer = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setPlayerTooltip());
    }
  };

  blockly.Blocks.flappy_setPlayer.VALUES =
      [[msg.setPlayerFlappy(), '"flappy"'],
       [msg.setPlayerSciFi(), '"scifi"']];

  generator.flappy_setPlayer = function() {
    return 'Flappy.setPlayer(\'block_id_' + this.id + '\', ' +
      this.getTitleValue('VALUE') + ');\n';
  };

  /**
   * setObstacle
   */
  blockly.Blocks.flappy_setObstacle = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setObstacleTooltip());
    }
  };

  blockly.Blocks.flappy_setObstacle.VALUES =
      [[msg.setObstacleFlappy(), '"flappy"'],
       [msg.setObstacleSciFi(), '"scifi"']];

  generator.flappy_setObstacle = function() {
    return 'Flappy.setObstacle(\'block_id_' + this.id + '\', ' +
      this.getTitleValue('VALUE') + ');\n';
  };

  /**
   * setGround
   */
  blockly.Blocks.flappy_setGround = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setGroundTooltip());
    }
  };

  blockly.Blocks.flappy_setGround.VALUES =
      [[msg.setGroundFlappy(), '"flappy"'],
       [msg.setGroundSciFi(), '"scifi"']];

  generator.flappy_setGround = function() {
    return 'Flappy.setGround(\'block_id_' + this.id + '\', ' +
      this.getTitleValue('VALUE') + ');\n';
  };

  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

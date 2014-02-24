/**
 * Blockly App: Bounce
 *
 * Copyright 2013 Code.org
 *
 */
'use strict';

var msg = require('../../locale/current/flappy');
var codegen = require('../codegen');

var generateSetterCode = function (ctx, name) {
  var value = ctx.getTitleValue('VALUE');
  if (value === "random") {
    var allValues = ctx.VALUES.slice(1).map(function (item) {
      return item[1];
    });
    value = 'Flappy.random([' + allValues + '])';
  }

  return 'Flappy.' + name + '(\'block_id_' + ctx.id + '\', ' +
    value + ');\n';
};

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
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[3][1]);

      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.flapTooltip());
    }
  };

  blockly.Blocks.flappy_flap_height.VALUES =
      [[msg.flapRandom(), 'random'],
       [msg.flapVerySmall(), 'Flappy.FlapHeight.VERY_SMALL'],
       [msg.flapSmall(), 'Flappy.FlapHeight.SMALL'],
       [msg.flapNormal(), 'Flappy.FlapHeight.NORMAL'],
       [msg.flapLarge(), 'Flappy.FlapHeight.LARGE'],
       [msg.flapVeryLarge(), 'Flappy.FlapHeight.VERY_LARGE']];

  generator.flappy_flap_height = function (velocity) {
    return generateSetterCode(this, 'flap');
  };

  blockly.Blocks.flappy_playSound = {
    // Block for playing sound.
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[7][1]);
      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.playSoundTooltip());
    }
  };

  blockly.Blocks.flappy_playSound.VALUES =
      [[msg.playSoundRandom(), 'random'],
       [msg.playSoundBounce(), '"wall"'],
       [msg.playSoundCrunch(), '"wall0"'],
       [msg.playSoundDie(), '"sfx_die"'],
       [msg.playSoundHit(), '"sfx_hit"'],
       [msg.playSoundPoint(), '"sfx_point"'],
       [msg.playSoundSwoosh(), '"sfx_swooshing"'],
       [msg.playSoundWing(), '"sfx_wing"'],
       [msg.playSoundJet(), '"jet"'],
       [msg.playSoundCrash(), '"crash"'],
       [msg.playSoundJingle(), '"jingle"'],
       [msg.playSoundSplash(), '"splash"'],
       [msg.playSoundLaser(), '"laser"']
     ];

  generator.flappy_playSound = function() {
    return generateSetterCode(this, 'playSound');
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
      dropdown.setValue(this.VALUES[3][1]);

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
      [[msg.speedRandom(), 'random'],
       [msg.speedVerySlow(), 'Flappy.LevelSpeed.VERY_SLOW'],
       [msg.speedSlow(), 'Flappy.LevelSpeed.SLOW'],
       [msg.speedNormal(), 'Flappy.LevelSpeed.NORMAL'],
       [msg.speedFast(), 'Flappy.LevelSpeed.FAST'],
       [msg.speedVeryFast(), 'Flappy.LevelSpeed.VERY_FAST']];

  generator.flappy_setSpeed = function() {
    return generateSetterCode(this, 'setSpeed');
  };

  /**
   * setGapHeight
   */
  blockly.Blocks.flappy_setGapHeight = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[3][1]);

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
      [[msg.setGapRandom(), 'random'],
       [msg.setGapVerySmall(), 'Flappy.GapHeight.VERY_SMALL'],
       [msg.setGapSmall(), 'Flappy.GapHeight.SMALL'],
       [msg.setGapNormal(), 'Flappy.GapHeight.NORMAL'],
       [msg.setGapLarge(), 'Flappy.GapHeight.LARGE'],
       [msg.setGapVeryLarge(), 'Flappy.GapHeight.VERY_LARGE']];

  generator.flappy_setGapHeight = function() {
    return generateSetterCode(this, 'setGapHeight');
  };

  /**
   * setBackground
   */
  blockly.Blocks.flappy_setBackground = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);

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
      [[msg.setBackgroundRandom(), 'random'],
       [msg.setBackgroundFlappy(), '"flappy"'],
       [msg.setBackgroundNight(), '"night"'],
       [msg.setBackgroundSciFi(), '"scifi"'],
       [msg.setBackgroundUnderwater(), '"underwater"'],
       [msg.setBackgroundCave(), '"cave"'],
       [msg.setBackgroundSanta(), '"santa"']];

  generator.flappy_setBackground = function() {
    return generateSetterCode(this, 'setBackground');
  };

  /**
   * setPlayer
   */
  blockly.Blocks.flappy_setPlayer = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);

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
      [[msg.setPlayerRandom(), 'random'],
       [msg.setPlayerFlappy(), '"flappy"'],
       [msg.setPlayerRedBird(), '"redbird"'],
       [msg.setPlayerSciFi(), '"scifi"'],
       [msg.setPlayerUnderwater(), '"underwater"'],
       [msg.setPlayerSanta(), '"santa"'],
       [msg.setPlayerCave(), '"cave"'],
       [msg.setPlayerShark(), '"shark"'],
       [msg.setPlayerEaster(), '"easter"'],
       [msg.setPlayerBatman(), '"batman"'],
       [msg.setPlayerSubmarine(), '"submarine"'],
       [msg.setPlayerUnicorn(), '"unicorn"'],
       [msg.setPlayerFairy(), '"fairy"'],
       [msg.setPlayerSuperman(), '"superman"'],
       [msg.setPlayerTurkey(), '"turkey"']];

  generator.flappy_setPlayer = function() {
    return generateSetterCode(this, 'setPlayer');
  };

  /**
   * setObstacle
   */
  blockly.Blocks.flappy_setObstacle = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);

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
      [[msg.setObstacleRandom(), 'random'],
       [msg.setObstacleFlappy(), '"flappy"'],
       [msg.setObstacleSciFi(), '"scifi"'],
       [msg.setObstacleUnderwater(), '"underwater"'],
       [msg.setObstacleCave(), '"cave"'],
       [msg.setObstacleSanta(), '"santa"'],
       [msg.setObstacleLaser(), '"laser"']];

  generator.flappy_setObstacle = function() {
    return generateSetterCode(this, 'setObstacle');
  };

  /**
   * setGround
   */
  blockly.Blocks.flappy_setGround = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);

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
      [[msg.setGroundRandom(), 'random'],
       [msg.setGroundFlappy(), '"flappy"'],
       [msg.setGroundSciFi(), '"scifi"'],
       [msg.setGroundUnderwater(), '"underwater"'],
       [msg.setGroundCave(), '"cave"'],
       [msg.setGroundSanta(), '"santa"'],
       [msg.setGroundLava(), '"lava"']];

  generator.flappy_setGround = function() {
    return generateSetterCode(this, 'setGround');
  };

  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

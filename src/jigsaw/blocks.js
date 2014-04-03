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

  blockly.Blocks.Jigsaw_whenClick = {
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

  generator.Jigsaw_whenClick = function () {
    // Generate JavaScript for handling click event.
    return '\n';
  };

  blockly.Blocks.Jigsaw_whenCollideGround = {
    // Block to handle event where Jigsaw hits ground
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

  generator.Jigsaw_whenCollideGround = function () {
    // Generate JavaScript for handling click event.
    return '\n';
  };

  blockly.Blocks.Jigsaw_whenCollideObstacle = {
    // Block to handle event where Jigsaw hits a Obstacle
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

  generator.Jigsaw_whenCollideObstacle = function () {
    // Generate JavaScript for handling collide Obstacle event.
    return '\n';
  };

  blockly.Blocks.Jigsaw_whenEnterObstacle = {
    // Block to handle event where Jigsaw enters a Obstacle
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

  generator.Jigsaw_whenEnterObstacle = function () {
    // Generate JavaScript for handling enter Obstacle.
    return '\n';
  };

  generator.Jigsaw_whenRunButtonClick = function () {
    // Generate JavaScript for handling run button click.
    return '\n';
  };

  blockly.Blocks.Jigsaw_whenRunButtonClick = {
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

  generator.Jigsaw_whenRunButtonClick = function () {
    // Generate JavaScript for handling run button click
    return '\n';
  };

  blockly.Blocks.Jigsaw_flap = {
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

  generator.Jigsaw_flap = function (velocity) {
    // Generate JavaScript for moving left.
    return 'Jigsaw.flap(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.Jigsaw_flap_height = {
    // Block for flapping (flying upwards)
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[3][1]); // default to normal

      this.setHSV(184, 1.00, 0.74);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.flapTooltip());
    }
  };

  blockly.Blocks.Jigsaw_flap_height.VALUES =
      [[msg.flapRandom(), 'random'],
       [msg.flapVerySmall(), 'Jigsaw.FlapHeight.VERY_SMALL'],
       [msg.flapSmall(), 'Jigsaw.FlapHeight.SMALL'],
       [msg.flapNormal(), 'Jigsaw.FlapHeight.NORMAL'],
       [msg.flapLarge(), 'Jigsaw.FlapHeight.LARGE'],
       [msg.flapVeryLarge(), 'Jigsaw.FlapHeight.VERY_LARGE']];

  generator.Jigsaw_flap_height = function (velocity) {
    return generateSetterCode(this, 'flap');
  };

  blockly.Blocks.Jigsaw_playSound = {
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

  blockly.Blocks.Jigsaw_playSound.VALUES =
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

  generator.Jigsaw_playSound = function() {
    return generateSetterCode(this, 'playSound');
  };

  blockly.Blocks.Jigsaw_incrementPlayerScore = {
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

  generator.Jigsaw_incrementPlayerScore = function() {
    // Generate JavaScript for incrementing the player's score.
    return 'Jigsaw.incrementPlayerScore(\'block_id_' + this.id + '\');\n';
  };

  blockly.Blocks.Jigsaw_endGame = {
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

  generator.Jigsaw_endGame = function() {
    // Generate JavaScript for incrementing the player's score.
    return 'Jigsaw.endGame(\'block_id_' + this.id + '\');\n';
  };

  /**
   * setSpeed
   */
  blockly.Blocks.Jigsaw_setSpeed = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[3][1]);  // default to normal

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setSpeedTooltip());
    }
  };

  blockly.Blocks.Jigsaw_setSpeed.VALUES =
      [[msg.speedRandom(), 'random'],
       [msg.speedVerySlow(), 'Jigsaw.LevelSpeed.VERY_SLOW'],
       [msg.speedSlow(), 'Jigsaw.LevelSpeed.SLOW'],
       [msg.speedNormal(), 'Jigsaw.LevelSpeed.NORMAL'],
       [msg.speedFast(), 'Jigsaw.LevelSpeed.FAST'],
       [msg.speedVeryFast(), 'Jigsaw.LevelSpeed.VERY_FAST']];

  generator.Jigsaw_setSpeed = function() {
    return generateSetterCode(this, 'setSpeed');
  };

  /**
   * setGapHeight
   */
  blockly.Blocks.Jigsaw_setGapHeight = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[3][1]);  // default to normal

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setGapHeightTooltip());
    }
  };

  blockly.Blocks.Jigsaw_setGapHeight.VALUES =
      [[msg.setGapRandom(), 'random'],
       [msg.setGapVerySmall(), 'Jigsaw.GapHeight.VERY_SMALL'],
       [msg.setGapSmall(), 'Jigsaw.GapHeight.SMALL'],
       [msg.setGapNormal(), 'Jigsaw.GapHeight.NORMAL'],
       [msg.setGapLarge(), 'Jigsaw.GapHeight.LARGE'],
       [msg.setGapVeryLarge(), 'Jigsaw.GapHeight.VERY_LARGE']];

  generator.Jigsaw_setGapHeight = function() {
    return generateSetterCode(this, 'setGapHeight');
  };

  /**
   * setBackground
   */
  blockly.Blocks.Jigsaw_setBackground = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);  // default to Jigsaw

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setBackgroundTooltip());
    }
  };

  blockly.Blocks.Jigsaw_setBackground.VALUES =
      [[msg.setBackgroundRandom(), 'random'],
       [msg.setBackgroundFlappy(), '"Jigsaw"'],
       [msg.setBackgroundNight(), '"night"'],
       [msg.setBackgroundSciFi(), '"scifi"'],
       [msg.setBackgroundUnderwater(), '"underwater"'],
       [msg.setBackgroundCave(), '"cave"'],
       [msg.setBackgroundSanta(), '"santa"']];

  generator.Jigsaw_setBackground = function() {
    return generateSetterCode(this, 'setBackground');
  };

  /**
   * setPlayer
   */
  blockly.Blocks.Jigsaw_setPlayer = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);  // default to Jigsaw

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setPlayerTooltip());
    }
  };

  blockly.Blocks.Jigsaw_setPlayer.VALUES =
      [[msg.setPlayerRandom(), 'random'],
       [msg.setPlayerFlappy(), '"Jigsaw"'],
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

  generator.Jigsaw_setPlayer = function() {
    return generateSetterCode(this, 'setPlayer');
  };

  /**
   * setObstacle
   */
  blockly.Blocks.Jigsaw_setObstacle = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);  // default to Jigsaw

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setObstacleTooltip());
    }
  };

  blockly.Blocks.Jigsaw_setObstacle.VALUES =
      [[msg.setObstacleRandom(), 'random'],
       [msg.setObstacleFlappy(), '"Jigsaw"'],
       [msg.setObstacleSciFi(), '"scifi"'],
       [msg.setObstacleUnderwater(), '"underwater"'],
       [msg.setObstacleCave(), '"cave"'],
       [msg.setObstacleSanta(), '"santa"'],
       [msg.setObstacleLaser(), '"laser"']];

  generator.Jigsaw_setObstacle = function() {
    return generateSetterCode(this, 'setObstacle');
  };

  /**
   * setGround
   */
  blockly.Blocks.Jigsaw_setGround = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[1][1]);  // default to Jigsaw

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setGroundTooltip());
    }
  };

  blockly.Blocks.Jigsaw_setGround.VALUES =
      [[msg.setGroundRandom(), 'random'],
       [msg.setGroundFlappy(), '"Jigsaw"'],
       [msg.setGroundSciFi(), '"scifi"'],
       [msg.setGroundUnderwater(), '"underwater"'],
       [msg.setGroundCave(), '"cave"'],
       [msg.setGroundSanta(), '"santa"'],
       [msg.setGroundLava(), '"lava"']];

  generator.Jigsaw_setGround = function() {
    return generateSetterCode(this, 'setGround');
  };

  /**
   * setGravity
   */
  blockly.Blocks.Jigsaw_setGravity = {
    helpUrl: '',
    init: function() {
      var dropdown = new blockly.FieldDropdown(this.VALUES);
      dropdown.setValue(this.VALUES[3][1]);  // default to normal

      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(dropdown, 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setGravityTooltip());
    }
  };

  blockly.Blocks.Jigsaw_setGravity.VALUES =
      [[msg.setGravityRandom(), 'random'],
       [msg.setGravityVeryLow(), 'Jigsaw.Gravity.VERY_LOW'],
       [msg.setGravityLow(), 'Jigsaw.Gravity.LOW'],
       [msg.setGravityNormal(), 'Jigsaw.Gravity.NORMAL'],
       [msg.setGravityHigh(), 'Jigsaw.Gravity.HIGH'],
       [msg.setGravityVeryHigh(), 'Jigsaw.Gravity.VERY_HIGH']
      ];

  generator.Jigsaw_setGravity = function() {
    return generateSetterCode(this, 'setGravity');
  };

  blockly.Blocks.Jigsaw_setScore = {
    // Block for moving forward or backward the internal number of pixels.
    init: function() {
      this.setHSV(312, 0.32, 0.62);
      this.appendDummyInput()
          .appendTitle(msg.setScore())
          .appendTitle(new blockly.FieldTextInput('0',
            blockly.FieldTextInput.numberValidator), 'VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(msg.setScoreTooltip());
    }
  };

  generator.Jigsaw_setScore = function() {
    // Generate JavaScript for moving forward or backward the internal number of
    // pixels.
    var value = window.parseInt(this.getTitleValue('VALUE'), 10);
    return 'Jigsaw.setScore(\'block_id_' + this.id + '\', ' + value + ');\n';
  };

  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

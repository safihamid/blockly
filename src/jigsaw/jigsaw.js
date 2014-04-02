/**
 * Blockly App: Jigsaw
 *
 * Copyright 2013 Code.org
 *
 */

'use strict';

var BlocklyApps = require('../base');
var commonMsg = require('../../locale/current/common');
var JigsawMsg = require('../../locale/current/Jigsaw');
var skins = require('../skins');
var codegen = require('../codegen');
var api = require('./api');
var page = require('../templates/page.html');
var feedback = require('../feedback.js');
var dom = require('../dom');
var constants = require('./constants');

/**
 * Create a namespace for the application.
 */
var Jigsaw = module.exports;

Jigsaw.GameStates = {
  WAITING: 0,
  ACTIVE: 1,
  ENDING: 2,
  OVER: 3
};

Jigsaw.gameState = Jigsaw.GameStates.WAITING;

Jigsaw.clickPending = false;

Jigsaw.avatarVelocity = 0;

var level;
var skin;
var onSharePage;

Jigsaw.obstacles = [];

/**
 * Milliseconds between each animation frame.
 */
var stepSpeed;

// whether to show Get Ready and Game Over
var infoText;

//TODO: Make configurable.
BlocklyApps.CHECK_FOR_EMPTY_BLOCKS = true;

var randomObstacleHeight = function () {
  var min = Jigsaw.MIN_OBSTACLE_HEIGHT;
  var max = Jigsaw.MAZE_HEIGHT - Jigsaw.GROUND_HEIGHT - Jigsaw.MIN_OBSTACLE_HEIGHT - Jigsaw.GAP_SIZE;
  return Math.floor((Math.random() * (max - min)) + min);
};

//The number of blocks to show as feedback.
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = 1;

// Default Scalings
Jigsaw.scale = {
  'snapRadius': 1,
  'stepSpeed': 33
};

var twitterOptions = {
  text: JigsawMsg.shareJigsawTwitter(),
  hashtag: "JigsawCode"
};

var AVATAR_HEIGHT = constants.AVATAR_HEIGHT;
var AVATAR_WIDTH = constants.AVATAR_WIDTH;
var AVATAR_Y_OFFSET = constants.AVATAR_Y_OFFSET;

var loadLevel = function() {
  // Load maps.
  BlocklyApps.IDEAL_BLOCK_NUM = level.ideal || Infinity;
  BlocklyApps.REQUIRED_BLOCKS = level.requiredBlocks;

  infoText = (level.infoText === undefined ? true : level.infoText);
  if (!infoText) {
    Jigsaw.gameState = Jigsaw.GameStates.ACTIVE;
  }

  // Override scalars.
  for (var key in level.scale) {
    Jigsaw.scale[key] = level.scale[key];
  }

  // Height and width of the goal and obstacles.
  Jigsaw.MARKER_HEIGHT = 43;
  Jigsaw.MARKER_WIDTH = 50;

  Jigsaw.MAZE_WIDTH = 400;
  Jigsaw.MAZE_HEIGHT = 400;

  Jigsaw.GROUND_WIDTH = 400;
  Jigsaw.GROUND_HEIGHT = 48;

  Jigsaw.GOAL_SIZE = 55;

  Jigsaw.OBSTACLE_WIDTH = 52;
  Jigsaw.OBSTACLE_HEIGHT = 320;
  Jigsaw.MIN_OBSTACLE_HEIGHT = 48;

  Jigsaw.setGapHeight(api.GapHeight.NORMAL);

  Jigsaw.OBSTACLE_SPACING = 250; // number of horizontal pixels between the start of obstacles

  var numObstacles = 2 * Jigsaw.MAZE_WIDTH / Jigsaw.OBSTACLE_SPACING;
  if (!level.obstacles) {
    numObstacles = 0;
  }

  var resetObstacle = function (x) {
    this.x = x;
    this.gapStart = randomObstacleHeight();
    this.hitAvatar = false;
  };

  var containsAvatar = function () {
    var JigsawRight = Jigsaw.avatarX + AVATAR_WIDTH;
    var JigsawBottom = Jigsaw.avatarY + AVATAR_HEIGHT;
    var obstacleRight = this.x + Jigsaw.OBSTACLE_WIDTH;
    var obstacleBottom = this.gapStart + Jigsaw.GAP_SIZE;
    return (JigsawRight > this.x &&
      JigsawRight < obstacleRight &&
      Jigsaw.avatarY > this.gapStart &&
      JigsawBottom < obstacleBottom);
  };

  for (var i = 0; i < numObstacles; i++) {
    Jigsaw.obstacles.push({
      x: Jigsaw.MAZE_WIDTH * 1.5 + i * Jigsaw.OBSTACLE_SPACING,
      gapStart: randomObstacleHeight(), // y coordinate of the top of the gap
      hitAvatar: false,
      reset: resetObstacle,
      containsAvatar: containsAvatar
    });
  }
};

var drawMap = function() {
  var svg = document.getElementById('svgJigsaw');
  var i, x, y, k, tile;

  // Adjust outer element size.
  svg.setAttribute('width', Jigsaw.MAZE_WIDTH);
  svg.setAttribute('height', Jigsaw.MAZE_HEIGHT);

  // Adjust visualization and belowVisualization width.
  var visualization = document.getElementById('visualization');
  visualization.style.width = Jigsaw.MAZE_WIDTH + 'px';
  var belowVisualization = document.getElementById('belowVisualization');
  belowVisualization.style.width = Jigsaw.MAZE_WIDTH + 'px';

  // Adjust button table width.
  var buttonTable = document.getElementById('gameButtons');
  buttonTable.style.width = Jigsaw.MAZE_WIDTH + 'px';

  var hintBubble = document.getElementById('bubble');
  hintBubble.style.width = Jigsaw.MAZE_WIDTH + 'px';

  if (skin.background) {
    tile = document.createElementNS(Blockly.SVG_NS, 'image');
    tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                        skin.background);
    tile.setAttribute('id', 'background');
    tile.setAttribute('height', Jigsaw.MAZE_HEIGHT);
    tile.setAttribute('width', Jigsaw.MAZE_WIDTH);
    tile.setAttribute('x', 0);
    tile.setAttribute('y', 0);
    svg.appendChild(tile);
  }

  // Add obstacles
  Jigsaw.obstacles.forEach (function (obstacle, index) {
    var obstacleTopIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    obstacleTopIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.obstacle_top);
    obstacleTopIcon.setAttribute('id', 'obstacle_top' + index);
    obstacleTopIcon.setAttribute('height', Jigsaw.OBSTACLE_HEIGHT);
    obstacleTopIcon.setAttribute('width', Jigsaw.OBSTACLE_WIDTH);
    svg.appendChild(obstacleTopIcon);

    var obstacleBottomIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    obstacleBottomIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.obstacle_bottom);
    obstacleBottomIcon.setAttribute('id', 'obstacle_bottom' + index);
    obstacleBottomIcon.setAttribute('height', Jigsaw.OBSTACLE_HEIGHT);
    obstacleBottomIcon.setAttribute('width', Jigsaw.OBSTACLE_WIDTH);
    svg.appendChild(obstacleBottomIcon);
  });

  if (level.ground) {
    for (i = 0; i < Jigsaw.MAZE_WIDTH / Jigsaw.GROUND_WIDTH + 1; i++) {
      var groundIcon = document.createElementNS(Blockly.SVG_NS, 'image');
      groundIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.ground);
      groundIcon.setAttribute('id', 'ground' + i);
      groundIcon.setAttribute('height', Jigsaw.GROUND_HEIGHT);
      groundIcon.setAttribute('width', Jigsaw.GROUND_WIDTH);
      groundIcon.setAttribute('x', 0);
      groundIcon.setAttribute('y', Jigsaw.MAZE_HEIGHT - Jigsaw.GROUND_HEIGHT);
      svg.appendChild(groundIcon);
    }
  }

  if (level.goal && level.goal.startX) {
    var goal = document.createElementNS(Blockly.SVG_NS, 'image');
    goal.setAttribute('id', 'goal');
    goal.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                            skin.goal);
    goal.setAttribute('height', Jigsaw.GOAL_SIZE);
    goal.setAttribute('width', Jigsaw.GOAL_SIZE);
    goal.setAttribute('x', level.goal.startX);
    goal.setAttribute('y', level.goal.startY);
    svg.appendChild(goal);
  }

  var avatArclip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
  avatArclip.setAttribute('id', 'avatArclipPath');
  var avatArclipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
  avatArclipRect.setAttribute('id', 'avatArclipRect');
  avatArclipRect.setAttribute('width', Jigsaw.MAZE_WIDTH);
  avatArclipRect.setAttribute('height', Jigsaw.MAZE_HEIGHT - Jigsaw.GROUND_HEIGHT);
  avatArclip.appendChild(avatArclipRect);
  svg.appendChild(avatArclip);

  // Add avatar.
  var avatarIcon = document.createElementNS(Blockly.SVG_NS, 'image');
  avatarIcon.setAttribute('id', 'avatar');
  avatarIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                          skin.avatar);
  avatarIcon.setAttribute('height', AVATAR_HEIGHT);
  avatarIcon.setAttribute('width', AVATAR_WIDTH);
  if (level.ground) {
    avatarIcon.setAttribute('clip-path', 'url(#avatArclipPath)');
  }
  svg.appendChild(avatarIcon);

  var instructions = document.createElementNS(Blockly.SVG_NS, 'image');
  instructions.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.instructions);
  instructions.setAttribute('id', 'instructions');
  instructions.setAttribute('height', 50);
  instructions.setAttribute('width', 159);
  instructions.setAttribute('x', 110);
  instructions.setAttribute('y', 170);
  instructions.setAttribute('visibility', 'hidden');
  svg.appendChild(instructions);

  var getready = document.createElementNS(Blockly.SVG_NS, 'image');
  getready.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.getready);
  getready.setAttribute('id', 'getready');
  getready.setAttribute('height', 50);
  getready.setAttribute('width', 183);
  getready.setAttribute('x', 108);
  getready.setAttribute('y', 80);
  getready.setAttribute('visibility', 'hidden');
  svg.appendChild(getready);

  var clickrun = document.createElementNS(Blockly.SVG_NS, 'image');
  clickrun.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.clickrun);
  clickrun.setAttribute('id', 'clickrun');
  clickrun.setAttribute('height', 41);
  clickrun.setAttribute('width', 273);
  clickrun.setAttribute('x', 64);
  clickrun.setAttribute('y', 200);
  clickrun.setAttribute('visibility', 'visibile');
  svg.appendChild(clickrun);

  var gameover = document.createElementNS(Blockly.SVG_NS, 'image');
  gameover.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.gameover);
  gameover.setAttribute('id', 'gameover');
  gameover.setAttribute('height', 41);
  gameover.setAttribute('width', 192);
  gameover.setAttribute('x', 104);
  gameover.setAttribute('y', 80);
  gameover.setAttribute('visibility', 'hidden');
  svg.appendChild(gameover);

  var score = document.createElementNS(Blockly.SVG_NS, 'text');
  score.setAttribute('id', 'score');
  score.setAttribute('class', 'Jigsaw-score');
  score.setAttribute('x', Jigsaw.MAZE_WIDTH / 2);
  score.setAttribute('y', 60);
  score.appendChild(document.createTextNode('0'));
  score.setAttribute('visibility', 'hidden');
  svg.appendChild(score);

  var clickRect = document.createElementNS(Blockly.SVG_NS, 'rect');
  clickRect.setAttribute('width', Jigsaw.MAZE_WIDTH);
  clickRect.setAttribute('height', Jigsaw.MAZE_HEIGHT);
  clickRect.setAttribute('fill-opacity', 0);
  clickRect.addEventListener('touchstart', function (e) {
    Jigsaw.onMouseDown(e);
    e.preventDefault(); // don't want to see mouse down
  });
  clickRect.addEventListener('mousedown', function (e) {
    Jigsaw.onMouseDown(e);
  });
  svg.appendChild(clickRect);
};

Jigsaw.calcDistance = function(xDist, yDist) {
  return Math.sqrt(xDist * xDist + yDist * yDist);
};

var essentiallyEqual = function(float1, float2, opt_variance) {
  var variance = opt_variance || 0.01;
  return (Math.abs(float1 - float2) < variance);
};

/**
 * @param scope Object :  The scope in which to execute the delegated function.
 * @param func Function : The function to execute
 * @param data Object or Array : The data to pass to the function. If the function is also passed arguments, the data is appended to the arguments list. If the data is an Array, each item is appended as a new argument.
 */
var delegate = function(scope, func, data)
{
  return function()
  {
    var args = Array.prototype.slice.apply(arguments).concat(data);
    func.apply(scope, args);
  };
};

/**
 * Check to see if avatar is in collision with given obstacle
 * @param obstacle Object : The obstacle object we're checking
 */
var checkForObstacleCollision = function (obstacle) {
  var insideObstacleColumn = Jigsaw.avatarX + AVATAR_WIDTH >= obstacle.x &&
    Jigsaw.avatarX <= obstacle.x + Jigsaw.OBSTACLE_WIDTH;
  if (insideObstacleColumn && (Jigsaw.avatarY <= obstacle.gapStart ||
    Jigsaw.avatarY + AVATAR_HEIGHT >= obstacle.gapStart + Jigsaw.GAP_SIZE)) {
    return true;
  }
  return false;
};

Jigsaw.activeTicks = function () {
  if (Jigsaw.firstActiveTick < 0) {
    return 0;
  }

  return (Jigsaw.tickCount - Jigsaw.firstActiveTick);
};

Jigsaw.onTick = function() {
  var avatarWasAboveGround, avatarIsAboveGround;

  if (Jigsaw.firstActiveTick < 0 && Jigsaw.gameState === Jigsaw.GameStates.ACTIVE) {
    Jigsaw.firstActiveTick = Jigsaw.tickCount;
  }

  Jigsaw.tickCount++;

  if (Jigsaw.tickCount === 1) {
    try { Jigsaw.whenRunButton(BlocklyApps, api); } catch (e) { }
  }

  // Check for click
  if (Jigsaw.clickPending && Jigsaw.gameState <= Jigsaw.GameStates.ACTIVE) {
    try { Jigsaw.whenClick(BlocklyApps, api); } catch (e) { }
    Jigsaw.clickPending = false;
  }

  avatarWasAboveGround = (Jigsaw.avatarY + AVATAR_HEIGHT) <
    (Jigsaw.MAZE_HEIGHT - Jigsaw.GROUND_HEIGHT);

  // Action doesn't start until user's first click
  if (Jigsaw.gameState === Jigsaw.GameStates.ACTIVE) {
    // Update avatar's vertical position
    Jigsaw.avatarVelocity += Jigsaw.gravity;
    Jigsaw.avatarY = Jigsaw.avatarY + Jigsaw.avatarVelocity;

    // never let the avatar go too far off the top or bottom
    var bottomLimit = level.ground ?
      (Jigsaw.MAZE_HEIGHT - Jigsaw.GROUND_HEIGHT - AVATAR_HEIGHT + 1) :
      (Jigsaw.MAZE_HEIGHT * 1.5);

    Jigsaw.avatarY = Math.min(Jigsaw.avatarY, bottomLimit);
    Jigsaw.avatarY = Math.max(Jigsaw.avatarY, Jigsaw.MAZE_HEIGHT * -0.5);

    // Update obstacles
    Jigsaw.obstacles.forEach(function (obstacle, index) {
      var wasRightOfAvatar = obstacle.x > (Jigsaw.avatarX + AVATAR_WIDTH);

      obstacle.x -= Jigsaw.SPEED;

      var isRightOfAvatar = obstacle.x > (Jigsaw.avatarX + AVATAR_WIDTH);
      if (wasRightOfAvatar && !isRightOfAvatar) {
        if (Jigsaw.avatarY > obstacle.gapStart &&
          (Jigsaw.avatarY + AVATAR_HEIGHT < obstacle.gapStart + Jigsaw.GAP_SIZE)) {
          try { Jigsaw.whenEnterObstacle(BlocklyApps, api); } catch (e) { }
        }
      }

      if (!obstacle.hitAvatar && checkForObstacleCollision(obstacle)) {
        obstacle.hitAvatar = true;
        try {Jigsaw.whenCollideObstacle(BlocklyApps, api); } catch (e) { }
      }

      // If obstacle moves off left side, repurpose as a new obstacle to our right
      var numObstacles = Jigsaw.obstacles.length;
      var previousObstacleIndex = (index - 1 + numObstacles ) % numObstacles;
      if (obstacle.x + Jigsaw.OBSTACLE_WIDTH < 0) {
        obstacle.reset(Jigsaw.obstacles[previousObstacleIndex].x + Jigsaw.OBSTACLE_SPACING);
      }
    });

    // check for ground collision
    avatarIsAboveGround = (Jigsaw.avatarY + AVATAR_HEIGHT) <
      (Jigsaw.MAZE_HEIGHT - Jigsaw.GROUND_HEIGHT);
    if (avatarWasAboveGround && !avatarIsAboveGround) {
      try { Jigsaw.whenCollideGround(BlocklyApps, api); } catch (e) { }
    }

    // update goal
    if (level.goal && level.goal.moving) {
      Jigsaw.goalX -= Jigsaw.SPEED;
      if (Jigsaw.goalX + Jigsaw.GOAL_SIZE < 0) {
        // if it disappears off of left, reappear on right
        Jigsaw.goalX = Jigsaw.MAZE_WIDTH + Jigsaw.GOAL_SIZE;
      }
    }
  }

  if (Jigsaw.gameState === Jigsaw.GameStates.ENDING) {
    Jigsaw.avatarY += 10;

    // we use avatar width instead of height bc he is rotating
    // the extra 4 is so that he buries his beak (similar to mobile game)
    var max = Jigsaw.MAZE_HEIGHT - Jigsaw.GROUND_HEIGHT - AVATAR_WIDTH + 4;
    if (Jigsaw.avatarY >= max) {
      Jigsaw.avatarY = max;
      Jigsaw.gameState = Jigsaw.GameStates.OVER;
      Jigsaw.gameOverTick = Jigsaw.tickCount;
    }

    document.getElementById('avatar').setAttribute('transform',
      'translate(' + AVATAR_WIDTH + ', 0) ' +
      'rotate(90, ' + Jigsaw.avatarX + ', ' + Jigsaw.avatarY + ')');
    if (infoText) {
      document.getElementById('gameover').setAttribute('visibility', 'visibile');
    }
  }

  Jigsaw.displayAvatar(Jigsaw.avatarX, Jigsaw.avatarY);
  Jigsaw.displayObstacles();
  if (Jigsaw.gameState <= Jigsaw.GameStates.ACTIVE) {
    Jigsaw.displayGround(Jigsaw.tickCount);
    Jigsaw.displayGoal();
  }

  if (checkFinished()) {
    Jigsaw.onPuzzleComplete();
  }
};

Jigsaw.onMouseDown = function (e) {
  if (Jigsaw.intervalId) {
    Jigsaw.clickPending = true;
    if (Jigsaw.gameState === Jigsaw.GameStates.WAITING) {
      Jigsaw.gameState = Jigsaw.GameStates.ACTIVE;
    } else if (Jigsaw.gameState === Jigsaw.GameStates.OVER &&
      Jigsaw.gameOverTick + 10 < Jigsaw.tickCount) {
      // do a reset
      var resetButton = document.getElementById('resetButton');
      if (resetButton) {
        resetButton.click();
      }
    }
    document.getElementById('instructions').setAttribute('visibility', 'hidden');
    document.getElementById('getready').setAttribute('visibility', 'hidden');
  } else if (Jigsaw.gameState === Jigsaw.GameStates.WAITING) {
    BlocklyApps.runButtonClick();
  }
};
/**
 * Initialize Blockly and the Jigsaw app.  Called on page load.
 */
Jigsaw.init = function(config) {
  Jigsaw.clearEventHandlersKillTickLoop();
  skin = config.skin;
  level = config.level;
  onSharePage = config.share;
  loadLevel();

  config.html = page({
    assetUrl: BlocklyApps.assetUrl,
    data: {
      localeDirection: BlocklyApps.localeDirection(),
      visualization: require('./visualization.html')(),
      controls: require('./controls.html')({assetUrl: BlocklyApps.assetUrl}),
      blockUsed: undefined,
      idealBlockNumber: undefined,
      blockCounterClass: 'block-counter-default'
    }
  });

  config.loadAudio = function() {
    Blockly.loadAudio_(skin.winSound, 'win');
    Blockly.loadAudio_(skin.startSound, 'start');
    Blockly.loadAudio_(skin.failureSound, 'failure');
    Blockly.loadAudio_(skin.obstacleSound, 'obstacle');

    Blockly.loadAudio_(skin.dieSound, 'sfx_die');
    Blockly.loadAudio_(skin.hitSound, 'sfx_hit');
    Blockly.loadAudio_(skin.pointSound, 'sfx_point');
    Blockly.loadAudio_(skin.swooshingSound, 'sfx_swooshing');
    Blockly.loadAudio_(skin.wingSound, 'sfx_wing');
    Blockly.loadAudio_(skin.winGoalSound, 'winGoal');
    Blockly.loadAudio_(skin.jetSound, 'jet');
    Blockly.loadAudio_(skin.jingleSound, 'jingle');
    Blockly.loadAudio_(skin.crashSound, 'crash');
    Blockly.loadAudio_(skin.laserSound, 'laser');
    Blockly.loadAudio_(skin.splashSound, 'splash');
    Blockly.loadAudio_(skin.wallSound, 'wall');
    Blockly.loadAudio_(skin.wall0Sound, 'wall0');
  };

  config.afterInject = function() {
    /**
     * The richness of block colours, regardless of the hue.
     * MOOC blocks should be brighter (target audience is younger).
     * Must be in the range of 0 (inclusive) to 1 (exclusive).
     * Blockly's default is 0.45.
     */
    Blockly.HSV_SATURATION = 0.6;

    Blockly.SNAP_RADIUS *= Jigsaw.scale.snapRadius;

    drawMap();
  };

  config.getDisplayWidth = function() {
    var visualization = document.getElementById('visualization');
    return visualization.getBoundingClientRect().width;
  };

  config.trashcan = false;

  config.twitter = twitterOptions;

  // for Jigsaw show make your own button if on share page
  config.makeYourOwn = config.share;

  config.makeString = commonMsg.makeYourOwnJigsaw();
  config.makeUrl = "http://code.org/Jigsaw";
  config.makeImage = BlocklyApps.assetUrl('media/Jigsaw_promo.png');

  config.enableShowCode = false;

  config.preventExtraTopLevelBlocks = true;

  // define how our blocks should be arranged
  var col1 = constants.WORKSPACE_BUFFER;
  var col2 = col1 + constants.WORKSPACE_COL_WIDTH;
  var row1 = constants.WORKSPACE_BUFFER;
  var row2 = row1 + constants.WORKSPACE_ROW_HEIGHT;
  var row3 = row2 + constants.WORKSPACE_ROW_HEIGHT;

  config.blockArrangement = {
    'Jigsaw_whenClick': { x: col1, y: row1},
    'Jigsaw_whenCollideGround': { x: col2, y: row1},
    'Jigsaw_whenCollideObstacle': { x: col2, y: row2},
    'Jigsaw_whenEnterObstacle': { x: col2, y: row3},
    'Jigsaw_whenRunButtonClick': { x: col1, y: row2}
  };

  BlocklyApps.init(config);

  if (!onSharePage) {
    var shareButton = document.getElementById('shareButton');
    dom.addClickTouchEvent(shareButton, Jigsaw.onPuzzleComplete);
  }
};

/**
 * Clear the event handlers and stop the onTick timer.
 */
Jigsaw.clearEventHandlersKillTickLoop = function() {
  Jigsaw.whenClick = null;
  Jigsaw.whenCollideGround = null;
  Jigsaw.whenCollideObstacle = null;
  Jigsaw.whenEnterObstacle = null;
  Jigsaw.whenRunButton = null;
  if (Jigsaw.intervalId) {
    window.clearInterval(Jigsaw.intervalId);
  }
  Jigsaw.intervalId = 0;
};

/**
 * Reset the app to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
BlocklyApps.reset = function(first) {
  var i;
  Jigsaw.clearEventHandlersKillTickLoop();

  Jigsaw.gameState = Jigsaw.GameStates.WAITING;

  // Reset the score.
  Jigsaw.playerScore = 0;

  Jigsaw.avatarVelocity = 0;

  // Reset obstacles
  Jigsaw.obstacles.forEach(function (obstacle, index) {
    obstacle.reset(Jigsaw.MAZE_WIDTH * 1.5 + index * Jigsaw.OBSTACLE_SPACING);
  });

  // reset configurable values
  Jigsaw.SPEED = 0;
  Jigsaw.FLAP_VELOCITY = -11;
  Jigsaw.setBackground('Jigsaw');
  Jigsaw.setObstacle('Jigsaw');
  Jigsaw.setPlayer('Jigsaw');
  Jigsaw.setGround('Jigsaw');
  Jigsaw.setGapHeight(api.GapHeight.NORMAL);
  Jigsaw.gravity = api.Gravity.NORMAL;

  // Move Avatar into position.
  Jigsaw.avatarX = 110;
  Jigsaw.avatarY = 150;

  if (level.goal && level.goal.startX) {
    Jigsaw.goalX = level.goal.startX;
    Jigsaw.goalY = level.goal.startY;
  }

  document.getElementById('avatar').setAttribute('transform', '');
  document.getElementById('score').setAttribute('visibility', 'hidden');
  document.getElementById('instructions').setAttribute('visibility', 'hidden');
  document.getElementById('clickrun').setAttribute('visibility', 'visible');
  document.getElementById('getready').setAttribute('visibility', 'hidden');
  document.getElementById('gameover').setAttribute('visibility', 'hidden');

  Jigsaw.displayAvatar(Jigsaw.avatarX, Jigsaw.avatarY);
  Jigsaw.displayObstacles();
  Jigsaw.displayGround(0);
  Jigsaw.displayGoal();

  var svg = document.getElementById('svgJigsaw');
};

/**
 * Click the run button.  Start the program.
 */
// XXX This is the only method used by the templates!
BlocklyApps.runButtonClick = function() {
  // Only allow a single top block on some levels.
  if (level.singleTopBlock &&
      Blockly.mainWorkspace.getTopBlocks().length > 1) {
    window.alert(commonMsg.oneTopBlock());
    return;
  }
  var runButton = document.getElementById('runButton');
  var resetButton = document.getElementById('resetButton');
  // Ensure that Reset button is at least as wide as Run button.
  if (!resetButton.style.minWidth) {
    resetButton.style.minWidth = runButton.offsetWidth + 'px';
  }
  document.getElementById('clickrun').setAttribute('visibility', 'hidden');
  document.getElementById('instructions').setAttribute('visibility', 'visible');
  document.getElementById('getready').setAttribute('visibility', 'visible');

  runButton.style.display = 'none';
  resetButton.style.display = 'inline';
  Blockly.mainWorkspace.traceOn(true);
  // BlocklyApps.reset(false);
  BlocklyApps.attempts++;
  Jigsaw.execute();

  if (level.freePlay && !onSharePage) {
    var shareCell = document.getElementById('share-cell');
    shareCell.className = 'share-cell-enabled';
  }
  if (level.score) {
    document.getElementById('score').setAttribute('visibility', 'visible');
    Jigsaw.displayScore();
  }
};

/**
 * Outcomes of running the user program.
 */
var ResultType = {
  UNSET: 0,
  SUCCESS: 1,
  FAILURE: -1,
  TIMEOUT: 2,
  ERROR: -2
};

/**
 * App specific displayFeedback function that calls into
 * BlocklyApps.displayFeedback when appropriate
 */
var displayFeedback = function() {
  if (!Jigsaw.waitingForReport) {
    BlocklyApps.displayFeedback({
      app: 'Jigsaw', //XXX
      skin: skin.id,
      feedbackType: Jigsaw.testResults,
      response: Jigsaw.response,
      level: level,
      showingSharing: level.freePlay,
      twitter: twitterOptions,
      appStrings: {
        reinfFeedbackMsg: JigsawMsg.reinfFeedbackMsg(),
        sharingText: JigsawMsg.shareGame()
      }
    });
  }
};

/**
 * Function to be called when the service report call is complete
 * @param {object} JSON response (if available)
 */
Jigsaw.onReportComplete = function(response) {
  Jigsaw.response = response;
  Jigsaw.waitingForReport = false;
  // Disable the run button until onReportComplete is called.
  var runButton = document.getElementById('runButton');
  runButton.disabled = false;
  displayFeedback();
};

/**
 * Execute the user's code.  Heaven help us...
 */
Jigsaw.execute = function() {
  BlocklyApps.log = [];
  BlocklyApps.ticks = 100; //TODO: Set higher for some levels
  Jigsaw.result = ResultType.UNSET;
  Jigsaw.testResults = BlocklyApps.TestResults.NO_TESTS_RUN;
  Jigsaw.waitingForReport = false;
  Jigsaw.response = null;

  // Check for empty top level blocks to warn user about bugs,
  // especially ones that lead to infinite loops.
  if (feedback.hasEmptyTopLevelBlocks()) {
    Jigsaw.testResults = BlocklyApps.TestResults.EMPTY_BLOCK_FAIL;
    displayFeedback();
    return;
  }

  if (level.editCode) {
    var codeTextbox = document.getElementById('codeTextbox');
    var code = dom.getText(codeTextbox);
    // Insert aliases from level codeBlocks into code
    if (level.codeFunctions) {
      for (var i = 0; i < level.codeFunctions.length; i++) {
        var codeFunction = level.codeFunctions[i];
        if (codeFunction.alias) {
          code = codeFunction.func +
              " = function() { " + codeFunction.alias + " };" + code;
        }
      }
    }
  }

  var codeClick = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'Jigsaw_whenClick');
  var whenClickFunc = codegen.functionFromCode(
                                      codeClick, {
                                      BlocklyApps: BlocklyApps,
                                      Jigsaw: api } );

  var codeCollideGround = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'Jigsaw_whenCollideGround');
  var whenCollideGroundFunc = codegen.functionFromCode(
                                      codeCollideGround, {
                                      BlocklyApps: BlocklyApps,
                                      Jigsaw: api } );

  var codeEnterObstacle = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'Jigsaw_whenEnterObstacle');
  var whenEnterObstacleFunc = codegen.functionFromCode(
                                      codeEnterObstacle, {
                                      BlocklyApps: BlocklyApps,
                                      Jigsaw: api } );

  var codeCollideObstacle = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'Jigsaw_whenCollideObstacle');
  var whenCollideObstacleFunc = codegen.functionFromCode(
                                      codeCollideObstacle, {
                                      BlocklyApps: BlocklyApps,
                                      Jigsaw: api } );

  var codeWhenRunButton = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'Jigsaw_whenRunButtonClick');
  var whenRunButtonFunc = codegen.functionFromCode(
                                      codeWhenRunButton, {
                                      BlocklyApps: BlocklyApps,
                                      Jigsaw: api } );


  BlocklyApps.playAudio('start', {volume: 0.5});

  // BlocklyApps.reset(false);

  // Set event handlers and start the onTick timer
  Jigsaw.whenClick = whenClickFunc;
  Jigsaw.whenCollideGround = whenCollideGroundFunc;
  Jigsaw.whenEnterObstacle = whenEnterObstacleFunc;
  Jigsaw.whenCollideObstacle = whenCollideObstacleFunc;
  Jigsaw.whenRunButton = whenRunButtonFunc;

  Jigsaw.tickCount = 0;
  Jigsaw.firstActiveTick = -1;
  Jigsaw.gameOverTick = 0;
  if (Jigsaw.intervalId) {
    window.clearInterval(Jigsaw.intervalId);
  }
  Jigsaw.intervalId = window.setInterval(Jigsaw.onTick, Jigsaw.scale.stepSpeed);
};

Jigsaw.onPuzzleComplete = function() {
  if (level.freePlay) {
    Jigsaw.result = ResultType.SUCCESS;
  }

  // Stop everything on screen
  Jigsaw.clearEventHandlersKillTickLoop();

  // If we know they succeeded, mark levelComplete true
  // Note that we have not yet animated the succesful run
  BlocklyApps.levelComplete = (Jigsaw.result == ResultType.SUCCESS);

  // If the current level is a free play, always return the free play
  // result type
  if (level.freePlay) {
    Jigsaw.testResults = BlocklyApps.TestResults.FREE_PLAY;
  } else {
    Jigsaw.testResults = BlocklyApps.getTestResults();
  }

  // Special case for Jigsaw level 1 where you have the right blocks, but you
  // don't flap to the goal.  Note: this currently depends on us getting
  // TOO_FEW_BLOCKS_FAIL, when really we should probably be getting
  // LEVEL_INCOMPLETE_FAIL here. (see pivotal item 66362504)
  if (level.id === "1" &&
    Jigsaw.testResults === BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL) {
    Jigsaw.testResults = BlocklyApps.TestResults.Jigsaw_SPECIFIC_FAIL;
  }


  if (Jigsaw.testResults >= BlocklyApps.TestResults.FREE_PLAY) {
    BlocklyApps.playAudio('win', {volume : 0.5});
  } else {
    BlocklyApps.playAudio('failure', {volume : 0.5});
  }

  if (level.editCode) {
    Jigsaw.testResults = BlocklyApps.levelComplete ?
      BlocklyApps.TestResults.ALL_PASS :
      BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL;
  }

  if (level.failForOther1Star && !BlocklyApps.levelComplete) {
    Jigsaw.testResults = BlocklyApps.TestResults.OTHER_1_STAR_FAIL;
  }

  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var textBlocks = Blockly.Xml.domToText(xml);

  Jigsaw.waitingForReport = true;

  // Report result to server.
  BlocklyApps.report({
                     app: 'Jigsaw',
                     level: level.id,
                     result: Jigsaw.result === ResultType.SUCCESS,
                     testResult: Jigsaw.testResults,
                     program: encodeURIComponent(textBlocks),
                     onComplete: Jigsaw.onReportComplete
                     });
};

/**
 * Display Avatar at the specified location
 * @param {number} x Horizontal Pixel location.
 * @param {number} y Vertical Pixel location.
 */
Jigsaw.displayAvatar = function(x, y) {
  var avatarIcon = document.getElementById('avatar');
  avatarIcon.setAttribute('x', x);
  avatarIcon.setAttribute('y', y);
};

/**
 * display moving goal
 */
Jigsaw.displayGoal = function() {
  if (!Jigsaw.goalX) {
    return;
  }
  var goal = document.getElementById('goal');
  goal.setAttribute('x', Jigsaw.goalX);
  goal.setAttribute('y', Jigsaw.goalY);
};


/**
 * Display ground at given tickCount
 */
Jigsaw.displayGround = function(tickCount) {
  if (!level.ground) {
    return;
  }
  var offset = tickCount * Jigsaw.SPEED;
  offset = offset % Jigsaw.GROUND_WIDTH;
  for (var i = 0; i < Jigsaw.MAZE_WIDTH / Jigsaw.GROUND_WIDTH + 1; i++) {
    var ground = document.getElementById('ground' + i);
    ground.setAttribute('x', -offset + i * Jigsaw.GROUND_WIDTH);
    ground.setAttribute('y', Jigsaw.MAZE_HEIGHT - Jigsaw.GROUND_HEIGHT);
  }
};

/**
 * Display all obstacles
 */
Jigsaw.displayObstacles = function () {
  for (var i = 0; i < Jigsaw.obstacles.length; i++) {
    var obstacle = Jigsaw.obstacles[i];
    var topIcon = document.getElementById('obstacle_top' + i);
    topIcon.setAttribute('x', obstacle.x);
    topIcon.setAttribute('y', obstacle.gapStart - Jigsaw.OBSTACLE_HEIGHT);

    var bottomIcon = document.getElementById('obstacle_bottom' + i);
    bottomIcon.setAttribute('x', obstacle.x);
    bottomIcon.setAttribute('y', obstacle.gapStart + Jigsaw.GAP_SIZE);
  }
};

Jigsaw.displayScore = function() {
  var score = document.getElementById('score');
  score.textContent = Jigsaw.playerScore;
};

Jigsaw.flap = function (amount) {
  var defaultFlap = level.defaultFlap || "NORMAL";
  Jigsaw.avatarVelocity = amount || api.FlapHeight[defaultFlap];
};

Jigsaw.setGapHeight = function (value) {
  var minGapSize = Jigsaw.MAZE_HEIGHT - Jigsaw.MIN_OBSTACLE_HEIGHT -
    Jigsaw.OBSTACLE_HEIGHT;
  if (value < minGapSize) {
    value = minGapSize;
  }
  Jigsaw.GAP_SIZE = value;
};

var skinTheme = function (value) {
  if (value === 'Jigsaw') {
    return skin;
  }
  return skin[value];
};

Jigsaw.setBackground = function (value) {
  var element = document.getElementById('background');
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
    skinTheme(value).background);
};

Jigsaw.setPlayer = function (value) {
  var element = document.getElementById('avatar');
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
    skinTheme(value).avatar);
};

Jigsaw.setObstacle = function (value) {
  var element;
  Jigsaw.obstacles.forEach(function (obstacle, index) {
    element = document.getElementById('obstacle_top' + index);
    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      skinTheme(value).obstacle_top);

    element = document.getElementById('obstacle_bottom' + index);
    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      skinTheme(value).obstacle_bottom);
  });
};

Jigsaw.setGround = function (value) {
  if (!level.ground) {
    return;
  }
  var element, i;
  for (i = 0; i < Jigsaw.MAZE_WIDTH / Jigsaw.GROUND_WIDTH + 1; i++) {
    element = document.getElementById('ground' + i);
    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      skinTheme(value).ground);
  }
};

var checkTickLimit = function() {
  if (!level.tickLimit) {
    return false;
  }

  if ((Jigsaw.tickCount - Jigsaw.firstActiveTick) >= level.tickLimit &&
    (Jigsaw.gameState === Jigsaw.GameStates.ACTIVE ||
    Jigsaw.gameState === Jigsaw.GameStates.OVER)) {
    // We'll ignore tick limit if we're ending so that we fully finish ending
    // sequence
    return true;
  }

  return false;
};

var checkFinished = function () {
  // if we have a succcess condition and have accomplished it, we're done and successful
  if (level.goal && level.goal.successCondition && level.goal.successCondition()) {
    Jigsaw.result = ResultType.SUCCESS;
    return true;
  }

  // if we have a failure condition, and it's been reached, we're done and failed
  if (level.goal && level.goal.failureCondition && level.goal.failureCondition()) {
    Jigsaw.result = ResultType.FAILURE;
    return true;
  }

  return false;
};

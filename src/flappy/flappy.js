/**
 * Blockly App: Flappy
 *
 * Copyright 2013 Code.org
 *
 */

'use strict';

var BlocklyApps = require('../base');
var commonMsg = require('../../locale/current/common');
var flappyMsg = require('../../locale/current/flappy');
var skins = require('../skins');
var tiles = require('./tiles');
var codegen = require('../codegen');
var api = require('./api');
var page = require('../templates/page.html');
var feedback = require('../feedback.js');
var dom = require('../dom');

var SquareType = tiles.SquareType;

/**
 * Create a namespace for the application.
 */
var Flappy = module.exports;

Flappy.GameStates = {
  WAITING: 0,
  ACTIVE: 1,
  ENDING: 2,
  OVER: 3
};

Flappy.gameState = Flappy.GameStates.WAITING;

Flappy.clickPending = false;

Flappy.birdVelocity = 0;
Flappy.gravity = 1;

var level;
var skin;

Flappy.pipes = [];

/**
 * Milliseconds between each animation frame.
 */
var stepSpeed;

// whether to show Get Ready and Game Over
var infoText;

//TODO: Make configurable.
BlocklyApps.CHECK_FOR_EMPTY_BLOCKS = true;

var randomPipeHeight = function () {
  var min = Flappy.MIN_PIPE_HEIGHT;
  var max = Flappy.MAZE_HEIGHT - Flappy.GROUND_HEIGHT - Flappy.MIN_PIPE_HEIGHT - Flappy.GAP_SIZE;
  return Math.floor((Math.random() * (max - min)) + min);
};

//The number of blocks to show as feedback.
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = 1;

// Default Scalings
Flappy.scale = {
  'snapRadius': 1,
  'stepSpeed': 33
};

var loadLevel = function() {
  // Load maps.
  BlocklyApps.IDEAL_BLOCK_NUM = level.ideal || Infinity;
  BlocklyApps.REQUIRED_BLOCKS = level.requiredBlocks;

  infoText = (level.infoText === undefined ? true : level.infoText);
  if (!infoText) {
    Flappy.gameState = Flappy.GameStates.ACTIVE;
  }

  // Override scalars.
  for (var key in level.scale) {
    Flappy.scale[key] = level.scale[key];
  }

  // Measure maze dimensions and set sizes.
  // todo - rename to bird
  Flappy.PEGMAN_HEIGHT = skin.pegmanHeight;
  Flappy.PEGMAN_WIDTH = skin.pegmanWidth;
  Flappy.PEGMAN_Y_OFFSET = skin.pegmanYOffset;
  // Height and width of the goal and obstacles.
  Flappy.MARKER_HEIGHT = 43;
  Flappy.MARKER_WIDTH = 50;

  Flappy.MAZE_WIDTH = 400;
  Flappy.MAZE_HEIGHT = 400;

  Flappy.GROUND_WIDTH = 24;
  Flappy.GROUND_HEIGHT = 48;

  Flappy.GOAL_SIZE = 48;

  Flappy.PIPE_WIDTH = 52;
  Flappy.PIPE_HEIGHT = 320;
  Flappy.MIN_PIPE_HEIGHT = 48;


  // todo - make sure somewhere that MIN_PIPE_HEIGHT + GAP_SIZE + PIPE_HEIGHT always gets us over MAZE_HEIGHT
  Flappy.GAP_SIZE = 100;

  Flappy.PIPE_SPACING = 250; // number of horizontal pixels between the start of pipes

  var numPipes = 2 * Flappy.MAZE_WIDTH / Flappy.PIPE_SPACING;
  if (!level.pipes) {
    numPipes = 0;
  }
  for (var i = 0; i < numPipes; i++) {
    Flappy.pipes.push({
      x: Flappy.MAZE_WIDTH * 1.5 + i * Flappy.PIPE_SPACING,
      gapStart: randomPipeHeight(), // y coordinate of the top of the gap
      hitBird: false,
      reset: function (x) {
        this.x = x;
        this.gapStart = randomPipeHeight();
        this.hitBird = false;
      }
    });
  }
};

/**
 * PIDs of async tasks currently executing.
 */
Flappy.pidList = [];

var drawMap = function() {
  var svg = document.getElementById('svgFlappy');
  var i, x, y, k, tile;

  // Draw the outer square.
  var square = document.createElementNS(Blockly.SVG_NS, 'rect');
  square.setAttribute('width', Flappy.MAZE_WIDTH);
  square.setAttribute('height', Flappy.MAZE_HEIGHT);
  square.setAttribute('fill', '#F1EEE7');
  square.setAttribute('stroke-width', 1);
  square.setAttribute('stroke', '#CCB');
  svg.appendChild(square);

  // Adjust outer element size.
  svg.setAttribute('width', Flappy.MAZE_WIDTH);
  svg.setAttribute('height', Flappy.MAZE_HEIGHT);

  // Adjust visualization and belowVisualization width.
  var visualization = document.getElementById('visualization');
  visualization.style.width = Flappy.MAZE_WIDTH + 'px';
  var belowVisualization = document.getElementById('belowVisualization');
  belowVisualization.style.width = Flappy.MAZE_WIDTH + 'px';

  // Adjust button table width.
  var buttonTable = document.getElementById('gameButtons');
  buttonTable.style.width = Flappy.MAZE_WIDTH + 'px';

  var hintBubble = document.getElementById('bubble');
  hintBubble.style.width = Flappy.MAZE_WIDTH + 'px';

  if (skin.background) {
    tile = document.createElementNS(Blockly.SVG_NS, 'image');
    tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                        skin.background);
    tile.setAttribute('height', Flappy.MAZE_HEIGHT);
    tile.setAttribute('width', Flappy.MAZE_WIDTH);
    tile.setAttribute('x', 0);
    tile.setAttribute('y', 0);
    svg.appendChild(tile);
  }

  // Add pipes
  Flappy.pipes.forEach (function (pipe, index) {
    var pipeTopIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    pipeTopIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.pipe_top);
    pipeTopIcon.setAttribute('id', 'pipe_top' + index);
    pipeTopIcon.setAttribute('height', Flappy.PIPE_HEIGHT);
    pipeTopIcon.setAttribute('width', Flappy.PIPE_WIDTH);
    svg.appendChild(pipeTopIcon);

    var pipeBottomIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    pipeBottomIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.pipe_bottom);
    pipeBottomIcon.setAttribute('id', 'pipe_bottom' + index);
    pipeBottomIcon.setAttribute('height', Flappy.PIPE_HEIGHT);
    pipeBottomIcon.setAttribute('width', Flappy.PIPE_WIDTH);
    svg.appendChild(pipeBottomIcon);
  });

  // Bird's clipPath element, whose (x, y) is reset by Flappy.displayBird
  var birdClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
  birdClip.setAttribute('id', 'birdClipPath');
  var birdClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
  birdClipRect.setAttribute('id', 'birdClipRect');
  birdClipRect.setAttribute('width', Flappy.PEGMAN_WIDTH);
  birdClipRect.setAttribute('height', Flappy.PEGMAN_HEIGHT);
  birdClip.appendChild(birdClipRect);
  svg.appendChild(birdClip);

  // Add bird.
  var birdIcon = document.createElementNS(Blockly.SVG_NS, 'image');
  birdIcon.setAttribute('id', 'bird');
  birdIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                          skin.avatar);
  birdIcon.setAttribute('height', Flappy.PEGMAN_HEIGHT);
  birdIcon.setAttribute('width', Flappy.PEGMAN_WIDTH);
  // todo - dont think i need this until i start animating bird
  // birdIcon.setAttribute('clip-path', 'url(#birdClipPath)');
  svg.appendChild(birdIcon);

  if (level.ground) {
    // todo - can almost certainly do better than having a bunch of individual icons
    for (i = 0; i < Flappy.MAZE_WIDTH / Flappy.GROUND_WIDTH + 1; i++) {
      var groundIcon = document.createElementNS(Blockly.SVG_NS, 'image');
      groundIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.ground);
      groundIcon.setAttribute('id', 'ground' + i);
      groundIcon.setAttribute('height', Flappy.GROUND_HEIGHT);
      groundIcon.setAttribute('width', Flappy.GROUND_WIDTH);
      svg.appendChild(groundIcon);
    }
  }

  if (level.goal && level.goal.x) {
    var goal = document.createElementNS(Blockly.SVG_NS, 'image');
    goal.setAttribute('id', 'goal');
    goal.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                            skin.goal);
    goal.setAttribute('height', Flappy.GOAL_SIZE);
    goal.setAttribute('width', Flappy.GOAL_SIZE);
    goal.setAttribute('x', level.goal.x);
    goal.setAttribute('y', level.goal.y);
    svg.appendChild(goal);
  }

  var instructions = document.createElementNS(Blockly.SVG_NS, 'image');
  instructions.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.instructions);
  instructions.setAttribute('id', 'instructions');
  instructions.setAttribute('height', 98);
  instructions.setAttribute('width', 114);
  instructions.setAttribute('x', 143);
  instructions.setAttribute('y', 125);
  instructions.setAttribute('visibility', 'hidden');
  svg.appendChild(instructions);

  var getready = document.createElementNS(Blockly.SVG_NS, 'image');
  getready.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.getready);
  getready.setAttribute('id', 'getready');
  getready.setAttribute('height', 50);
  getready.setAttribute('width', 183);
  getready.setAttribute('x', 108);
  getready.setAttribute('y', 50);
  getready.setAttribute('visibility', 'hidden');
  svg.appendChild(getready);

  var gameover = document.createElementNS(Blockly.SVG_NS, 'image');
  gameover.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.gameover);
  gameover.setAttribute('id', 'gameover');
  gameover.setAttribute('height', 41);
  gameover.setAttribute('width', 192);
  gameover.setAttribute('x', 104);
  gameover.setAttribute('y', 50);
  gameover.setAttribute('visibility', 'hidden');
  svg.appendChild(gameover);

  var clickRect = document.createElementNS(Blockly.SVG_NS, 'rect');
  clickRect.setAttribute('width', Flappy.MAZE_WIDTH);
  clickRect.setAttribute('height', Flappy.MAZE_HEIGHT);
  clickRect.setAttribute('fill-opacity', 0);
  // todo - add to pid list?
  clickRect.addEventListener('touchstart', function (e) {
    Flappy.onMouseDown(e);
    e.preventDefault(); // don't want to see mouse down
  });
  clickRect.addEventListener('mousedown', function (e) {
    Flappy.onMouseDown(e);
  });
  svg.appendChild(clickRect);
};

Flappy.calcDistance = function(xDist, yDist) {
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
 * Check to see if bird is in collision with given pipe
 * @param pipe Object : The pipe object we're checking
 */
var checkForPipeCollision = function (pipe) {
  var insidePipeColumn = Flappy.birdX + Flappy.PEGMAN_WIDTH >= pipe.x &&
    Flappy.birdX <= pipe.x + Flappy.PIPE_WIDTH;
  if (insidePipeColumn && (Flappy.birdY <= pipe.gapStart ||
    Flappy.birdY + Flappy.PEGMAN_HEIGHT >= pipe.gapStart + Flappy.GAP_SIZE)) {
    return true;
  }
  return false;
}

Flappy.onTick = function() {
  var birdWasAboveGround, birdIsAboveGround;

  if (Flappy.firstActiveTick < 0 && Flappy.gameState === Flappy.GameStates.ACTIVE) {
    Flappy.firstActiveTick = Flappy.tickCount;
  }

  Flappy.tickCount++;

  if (Flappy.tickCount === 1) {
    try { Flappy.whenRunButton(BlocklyApps, api); } catch (e) { }
  }

  // Check for click
  if (Flappy.clickPending && Flappy.gameState <= Flappy.GameStates.ACTIVE) {
    try { Flappy.whenClick(BlocklyApps, api); } catch (e) { }
    Flappy.clickPending = false;
  }

  birdWasAboveGround = (Flappy.birdY + Flappy.PEGMAN_HEIGHT) <
    (Flappy.MAZE_HEIGHT - Flappy.GROUND_HEIGHT);

  // Action doesn't start until user's first click
  if (Flappy.gameState === Flappy.GameStates.ACTIVE) {
    // Update bird's vertical position
    Flappy.birdVelocity += Flappy.gravity;
    Flappy.birdY = Flappy.birdY + Flappy.birdVelocity;

    // never let the bird go too far off the top or bottom
    var bottomLimit = level.ground ?
      (Flappy.MAZE_HEIGHT - Flappy.GROUND_HEIGHT - Flappy.PEGMAN_HEIGHT + 1) :
      (Flappy.MAZE_HEIGHT * 1.5);

    Flappy.birdY = Math.min(Flappy.birdY, bottomLimit);
    Flappy.birdY = Math.max(Flappy.birdY, Flappy.MAZE_HEIGHT * -0.5);

    // Update pipes
    Flappy.pipes.forEach(function (pipe) {
      var wasRightOfBird = pipe.x > (Flappy.birdX + Flappy.PEGMAN_WIDTH);

      pipe.x -= Flappy.SPEED;

      var isRightOfBird = pipe.x > (Flappy.birdX + Flappy.PEGMAN_WIDTH);
      if (wasRightOfBird && !isRightOfBird) {
        if (Flappy.birdY > pipe.gapStart &&
          (Flappy.birdY + Flappy.PEGMAN_HEIGHT < pipe.gapStart + Flappy.GAP_SIZE)) {
          try { Flappy.whenEnterPipe(BlocklyApps, api); } catch (e) { }
        }
      }

      if (!pipe.hitBird && checkForPipeCollision(pipe)) {
        pipe.hitBird = true;
        try {Flappy.whenCollidePipe(BlocklyApps, api); } catch (e) { }
      }

      // If pipe moves off left side, repurpose as a new pipe to our right
      if (pipe.x + Flappy.PIPE_WIDTH < 0) {
        pipe.reset(Flappy.pipes.length * Flappy.PIPE_SPACING);
      }
    });

    // check for ground collision
    birdIsAboveGround = (Flappy.birdY + Flappy.PEGMAN_HEIGHT) <
      (Flappy.MAZE_HEIGHT - Flappy.GROUND_HEIGHT);
    if (birdWasAboveGround && !birdIsAboveGround) {
      try { Flappy.whenCollideGround(BlocklyApps, api); } catch (e) { }
    }
  }

  if (Flappy.gameState === Flappy.GameStates.ENDING) {
    Flappy.birdY += 10;

    // we use avatar width instead of height bc he is rotating
    // the extra 4 is so that he buries his beak (similar to mobile game)
    var max = Flappy.MAZE_HEIGHT - Flappy.GROUND_HEIGHT - Flappy.PEGMAN_WIDTH + 4;
    if (Flappy.birdY >= max) {
      Flappy.birdY = max;
      Flappy.gameState = Flappy.GameStates.OVER;
      // Flappy.clearEventHandlersKillTickLoop();
    }

    document.getElementById('bird').setAttribute('transform',
      'translate(' + Flappy.PEGMAN_WIDTH + ', 0) ' +
      'rotate(90, ' + Flappy.birdX + ', ' + Flappy.birdY + ')');
    if (infoText) {
      document.getElementById('gameover').setAttribute('visibility', 'visibile');
    }
  }

  Flappy.displayBird(Flappy.birdX, Flappy.birdY);
  Flappy.displayPipes();
  if (Flappy.gameState <= Flappy.GameStates.ACTIVE) {
    Flappy.displayGround(Flappy.tickCount);
  }

  if (Flappy.reachedGoalOrTickLimit()) {
    if (!level.goal.validation || level.goal.validation()) {
      Flappy.result = ResultType.SUCCESS;
    } else {
      Flappy.result = ResultType.FAILURE;
    }
    Flappy.onPuzzleComplete();
  }

  // todo - consider timeout
  // else if (Flappy.timedOut()) {
  //   BlocklyApps.playAudio('failure', {volume: 0.5});
  //   Flappy.result = ResultType.FAILURE;
  //   Flappy.onPuzzleComplete();
  // }
};

Flappy.onMouseDown = function (e) {
  if (Flappy.intervalId) {
    Flappy.clickPending = true;
    if (Flappy.gameState === Flappy.GameStates.WAITING) {
      Flappy.gameState = Flappy.GameStates.ACTIVE;
    }
    document.getElementById('instructions').setAttribute('visibility', 'hidden');
    document.getElementById('getready').setAttribute('visibility', 'hidden');
  }
};
/**
 * Initialize Blockly and the Flappy app.  Called on page load.
 */
Flappy.init = function(config) {
  Flappy.clearEventHandlersKillTickLoop();
  skin = config.skin;
  level = config.level;
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
    // Load wall sounds.
    Blockly.loadAudio_(skin.wallSound, 'wall');
    if (skin.additionalSound) {
      Blockly.loadAudio_(skin.wall0Sound, 'wall0');
      Blockly.loadAudio_(skin.wall1Sound, 'wall1');
      Blockly.loadAudio_(skin.wall2Sound, 'wall2');
      Blockly.loadAudio_(skin.wall3Sound, 'wall3');
      Blockly.loadAudio_(skin.wall4Sound, 'wall4');
      Blockly.loadAudio_(skin.dieSound, 'sfx_die');
      Blockly.loadAudio_(skin.hitSound, 'sfx_hit');
      Blockly.loadAudio_(skin.pointSound, 'sfx_point');
      Blockly.loadAudio_(skin.swooshingSound, 'sfx_swooshing');
      Blockly.loadAudio_(skin.wingSound, 'sfx_wing');
      Blockly.loadAudio_(skin.winGoalSound, 'winGoal');
    }
  };

  config.afterInject = function() {
    /**
     * The richness of block colours, regardless of the hue.
     * MOOC blocks should be brighter (target audience is younger).
     * Must be in the range of 0 (inclusive) to 1 (exclusive).
     * Blockly's default is 0.45.
     */
    Blockly.HSV_SATURATION = 0.6;

    Blockly.SNAP_RADIUS *= Flappy.scale.snapRadius;

    drawMap();
  };

  config.getDisplayWidth = function() {
    var visualization = document.getElementById('visualization');
    return visualization.getBoundingClientRect().width;
  };

  BlocklyApps.init(config);
};

/**
 * Clear the event handlers and stop the onTick timer.
 */
Flappy.clearEventHandlersKillTickLoop = function() {
  Flappy.whenClick = null;
  Flappy.whenCollideGround = null;
  Flappy.whenCollidePipe = null;
  Flappy.whenEnterPipe = null;
  Flappy.whenRunButton = null;
  if (Flappy.intervalId) {
    window.clearInterval(Flappy.intervalId);
  }
  Flappy.intervalId = 0;
};

/**
 * Reset the app to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
BlocklyApps.reset = function(first) {
  var i;
  Flappy.clearEventHandlersKillTickLoop();

  Flappy.gameState = Flappy.GameStates.WAITING;

  // Kill all tasks.
  for (i = 0; i < Flappy.pidList.length; i++) {
    window.clearTimeout(Flappy.pidList[i]);
  }
  Flappy.pidList = [];

  // Reset the score.
  Flappy.playerScore = 0;
  if (level.score) {
    var scoreCell = document.getElementById('score-cell');
    scoreCell.className = 'score-cell-enabled';
    Flappy.displayScore();
  }

  Flappy.birdVelocity = 0;

  // Reset pipes
  Flappy.pipes.forEach(function (pipe, index) {
    pipe.reset(Flappy.MAZE_WIDTH * 1.5 + index * Flappy.PIPE_SPACING);
  });

  // Move Ball into position.
  if (Flappy.ballStart_) {
    for (i = 0; i < Flappy.ballCount; i++) {
      Flappy.resetBall(i);
    }
  }

  // reset configurable values
  Flappy.SPEED = 4;
  Flappy.FLAP_VELOCITY = -11;

  // Move Bird into position.
  Flappy.birdX = 110;
  Flappy.birdY = 150;

  document.getElementById('bird').removeAttribute('transform');
  document.getElementById('instructions').setAttribute('visibility', 'visible');
  if (infoText) {
    document.getElementById('getready').setAttribute('visibility', 'visible');
  }
  document.getElementById('gameover').setAttribute('visibility', 'hidden');

  Flappy.displayBird(Flappy.birdX, Flappy.birdY);
  Flappy.displayPipes();
  Flappy.displayGround(0); // todo

  var svg = document.getElementById('svgFlappy');
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
  runButton.style.display = 'none';
  resetButton.style.display = 'inline';
  Blockly.mainWorkspace.traceOn(true);
  BlocklyApps.reset(false);
  BlocklyApps.attempts++;
  Flappy.execute();
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
  if (!Flappy.waitingForReport) {
    BlocklyApps.displayFeedback({
      app: 'flappy', //XXX
      skin: skin.id,
      feedbackType: Flappy.testResults,
      response: Flappy.response,
      level: level
    });
  }
};

/**
 * Function to be called when the service report call is complete
 * @param {object} JSON response (if available)
 */
Flappy.onReportComplete = function(response) {
  Flappy.response = response;
  Flappy.waitingForReport = false;
  // Disable the run button until onReportComplete is called.
  var runButton = document.getElementById('runButton');
  runButton.disabled = false;
  displayFeedback();
};

/**
 * Execute the user's code.  Heaven help us...
 */
Flappy.execute = function() {
  BlocklyApps.log = [];
  BlocklyApps.ticks = 100; //TODO: Set higher for some levels
  var code = Blockly.Generator.workspaceToCode('JavaScript', 'bounce_whenRun');
  Flappy.result = ResultType.UNSET;
  Flappy.testResults = BlocklyApps.TestResults.NO_TESTS_RUN;
  Flappy.waitingForReport = false;
  Flappy.response = null;

  // Check for empty top level blocks to warn user about bugs,
  // especially ones that lead to infinite loops.
  if (feedback.hasEmptyTopLevelBlocks()) {
    Flappy.testResults = BlocklyApps.TestResults.EMPTY_BLOCK_FAIL;
    displayFeedback();
    return;
  }

  if (level.editCode) {
    var codeTextbox = document.getElementById('codeTextbox');
    code = dom.getText(codeTextbox);
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
                                    'flappy_whenClick');
  var whenClickFunc = codegen.functionFromCode(
                                     codeClick, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeCollideGround = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'flappy_whenCollideGround');
  var whenCollideGroundFunc = codegen.functionFromCode(
                                     codeCollideGround, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeEnterPipe = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'flappy_whenEnterPipe');
  var whenEnterPipeFunc = codegen.functionFromCode(
                                     codeEnterPipe, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeCollidePipe = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'flappy_whenCollidePipe');
  var whenCollidePipeFunc = codegen.functionFromCode(
                                     codeCollidePipe, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );

  var codeWhenRunButton = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'flappy_whenRunButtonClick');
  var whenRunButtonFunc = codegen.functionFromCode(
                                     codeWhenRunButton, {
                                      BlocklyApps: BlocklyApps,
                                      Flappy: api } );


  BlocklyApps.playAudio('start', {volume: 0.5});

  BlocklyApps.reset(false);

  // Set event handlers and start the onTick timer
  Flappy.whenClick = whenClickFunc;
  Flappy.whenCollideGround = whenCollideGroundFunc;
  Flappy.whenEnterPipe = whenEnterPipeFunc;
  Flappy.whenCollidePipe = whenCollidePipeFunc;
  Flappy.whenRunButton = whenRunButtonFunc;

  Flappy.tickCount = 0;
  Flappy.firstActiveTick = -1;
  Flappy.intervalId = window.setInterval(Flappy.onTick, Flappy.scale.stepSpeed);
};

Flappy.onPuzzleComplete = function() {
  // Stop everything on screen
  Flappy.clearEventHandlersKillTickLoop();

  // If we know they succeeded, mark levelComplete true
  // Note that we have not yet animated the succesful run
  BlocklyApps.levelComplete = (Flappy.result == ResultType.SUCCESS);

  Flappy.testResults = BlocklyApps.getTestResults();

  if (level.editCode) {
    Flappy.testResults = BlocklyApps.levelComplete ?
      BlocklyApps.TestResults.ALL_PASS :
      BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL;
  }

  if (level.failForOther1Star && !BlocklyApps.levelComplete) {
    Flappy.testResults = BlocklyApps.TestResults.OTHER_1_STAR_FAIL;
  }

  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var textBlocks = Blockly.Xml.domToText(xml);

  Flappy.waitingForReport = true;

  // Report result to server.
  BlocklyApps.report({
                     app: 'flappy',
                     level: level.id,
                     result: Flappy.result === ResultType.SUCCESS,
                     testResult: Flappy.testResults,
                     program: encodeURIComponent(textBlocks),
                     onComplete: Flappy.onReportComplete
                     });
};

/**
 * Display Bird at the specified location
 * @param {number} x Horizontal Pixel location.
 * @param {number} y Vertical Pixel location.
 */

Flappy.displayBird = function(x, y) {
  var birdIcon = document.getElementById('bird');
  birdIcon.setAttribute('x', x);
  birdIcon.setAttribute('y', y);

  // todo - introduce animation frame for bird
  var birdClipRect = document.getElementById('birdClipRect');
  birdClipRect.setAttribute('x', x);
  birdClipRect.setAttribute('y', y);
};

/**
 * Display ground at specified location
 * @param {number} ground
 */
Flappy.displayGround = function(offset) {
  if (!level.ground) {
    return;
  }
  offset *= Flappy.SPEED;
  offset = offset % Flappy.GROUND_WIDTH;
  for (var i = 0; i < Flappy.MAZE_WIDTH / Flappy.GROUND_WIDTH + 1; i++) {
    var ground = document.getElementById('ground' + i);
    ground.setAttribute('x', -offset + i * Flappy.GROUND_WIDTH);
    ground.setAttribute('y', Flappy.MAZE_HEIGHT - Flappy.GROUND_HEIGHT);
  }
};

/**
 * Display all pipes
 */
Flappy.displayPipes = function () {
  for (var i = 0; i < Flappy.pipes.length; i++) {
    var pipe = Flappy.pipes[i];
    var topIcon = document.getElementById('pipe_top' + i);
    topIcon.setAttribute('x', pipe.x);
    topIcon.setAttribute('y', pipe.gapStart - Flappy.PIPE_HEIGHT);

    var bottomIcon = document.getElementById('pipe_bottom' + i);
    bottomIcon.setAttribute('x', pipe.x);
    bottomIcon.setAttribute('y', pipe.gapStart + Flappy.GAP_SIZE);
  }
};

/**
 * Display the score in the span element below the visualization.
 */
Flappy.displayScore = function() {
  var scoreElement = document.getElementById('flappy-score');
  scoreElement.innerText = flappyMsg.scoreText({
    playerScore: Flappy.playerScore
  });
};

Flappy.reachedGoalOrTickLimit = function() {
  if (level.freePlay) {
    return false;
  }

  var sensitivity = level.goal.sensitivity || 5;

  if (level.tickLimit &&
    (Flappy.tickCount - Flappy.firstActiveTick) >= level.tickLimit &&
    (Flappy.gameState === Flappy.GameStates.ACTIVE ||
    Flappy.gameState === Flappy.GameStates.OVER)) {
    // We'll ignore tick limit if we're ending so that we fully finish ending
    // sequence
    return true;
  }

  if (level.goal.x) {
    var height = document.getElementById('bird').hasAttribute('transform') ?
      Flappy.PEGMAN_WIDTH : Flappy.PEGMAN_HEIGHT;
    var birdCenter = Flappy.birdY + (height / 2);
    var goalCenter = level.goal.y + (Flappy.GOAL_SIZE / 2);
    var diff = Math.abs(birdCenter - goalCenter);
    console.log("diff = " + diff);

    return (diff <= sensitivity);
  }

  return false;
};

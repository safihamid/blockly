/**
 * Blockly App: Bounce
 *
 * Copyright 2013 Code.org
 *
 */

'use strict';

var BlocklyApps = require('../base');
var commonMsg = require('../../locale/current/common');
var bounceMsg = require('../../locale/current/bounce');
var skins = require('../skins');
var tiles = require('./tiles');
var codegen = require('../codegen');
var api = require('./api');
var page = require('../templates/page.html');
var feedback = require('../feedback.js');
var dom = require('../dom');

var Direction = tiles.Direction;
var AngleDirection = tiles.AngleDirection;
var SquareType = tiles.SquareType;

/**
 * Create a namespace for the application.
 */
var Bounce = module.exports;

var level;
var skin;

/**
 * Milliseconds between each animation frame.
 */
var stepSpeed;

//TODO: Make configurable.
BlocklyApps.CHECK_FOR_EMPTY_BLOCKS = true;

var getTile = function(map, x, y) {
  if (map && map[y]) {
    return map[y][x];
  }
};

//The number of blocks to show as feedback.
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = 1;

// Default Scalings
Bounce.scale = {
  'snapRadius': 1,
  'stepSpeed': 33
};

var loadLevel = function() {
  // Load maps.
  Bounce.map = level.map;
  BlocklyApps.IDEAL_BLOCK_NUM = level.ideal || Infinity;
  Bounce.startDirection = level.startDirection;
  BlocklyApps.REQUIRED_BLOCKS = level.requiredBlocks;

  // Override scalars.
  for (var key in level.scale) {
    Bounce.scale[key] = level.scale[key];
  }

  // Measure maze dimensions and set sizes.
  // ROWS: Number of tiles down.
  Bounce.ROWS = Bounce.map.length;
  // COLS: Number of tiles across.
  Bounce.COLS = Bounce.map[0].length;
  // Initialize the wallMap.
  initWallMap();
  // Pixel height and width of each maze square (i.e. tile).
  Bounce.SQUARE_SIZE = 50;
  Bounce.PEGMAN_HEIGHT = skin.pegmanHeight;
  Bounce.PEGMAN_WIDTH = skin.pegmanWidth;
  Bounce.PEGMAN_Y_OFFSET = skin.pegmanYOffset;
  // Height and width of the goal and obstacles.
  Bounce.MARKER_HEIGHT = 43;
  Bounce.MARKER_WIDTH = 50;

  Bounce.MAZE_WIDTH = Bounce.SQUARE_SIZE * Bounce.COLS;
  Bounce.MAZE_HEIGHT = Bounce.SQUARE_SIZE * Bounce.ROWS;
  Bounce.PATH_WIDTH = Bounce.SQUARE_SIZE / 3;
};


var initWallMap = function() {
  Bounce.wallMap = new Array(Bounce.ROWS);
  for (var y = 0; y < Bounce.ROWS; y++) {
    Bounce.wallMap[y] = new Array(Bounce.COLS);
  }
};

// Map each possible shape to a sprite.
// Input: Binary string representing Centre/North/West/South/East squares.
// Output: [x, y] coordinates of each tile's sprite in tiles.png.
var TILE_SHAPES = {
  '10010': [4, 0],  // Dead ends
  '10001': [3, 3],
  '11000': [0, 1],
  '10100': [0, 2],
  '11010': [4, 1],  // Vertical
  '10101': [3, 2],  // Horizontal
  '10110': [0, 0],  // Elbows
  '10011': [2, 0],
  '11001': [4, 2],
  '11100': [2, 3],
  '11110': [1, 1],  // Junctions
  '10111': [1, 0],
  '11011': [2, 1],
  '11101': [1, 2],
  '11111': [2, 2],  // Cross
  'null0': [4, 3],  // Empty
  'null1': [3, 0],
  'null2': [3, 1],
  'null3': [0, 3],
  'null4': [1, 3]
};

var drawMap = function() {
  var svg = document.getElementById('svgBounce');
  var x, y, k, tile;

  // Draw the outer square.
  var square = document.createElementNS(Blockly.SVG_NS, 'rect');
  square.setAttribute('width', Bounce.MAZE_WIDTH);
  square.setAttribute('height', Bounce.MAZE_HEIGHT);
  square.setAttribute('fill', '#F1EEE7');
  square.setAttribute('stroke-width', 1);
  square.setAttribute('stroke', '#CCB');
  svg.appendChild(square);

  // Adjust outer element size.
  svg.setAttribute('width', Bounce.MAZE_WIDTH);
  svg.setAttribute('height', Bounce.MAZE_HEIGHT);

  // Adjust visualization and belowVisualization width.
  var visualization = document.getElementById('visualization');
  visualization.style.width = Bounce.MAZE_WIDTH + 'px';
  var belowVisualization = document.getElementById('belowVisualization');
  belowVisualization.style.width = Bounce.MAZE_WIDTH + 'px';

  // Adjust button table width.
  var buttonTable = document.getElementById('gameButtons');
  buttonTable.style.width = Bounce.MAZE_WIDTH + 'px';

  var hintBubble = document.getElementById('bubble');
  hintBubble.style.width = Bounce.MAZE_WIDTH + 'px';

  if (skin.background) {
    tile = document.createElementNS(Blockly.SVG_NS, 'image');
    tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                        skin.background);
    tile.setAttribute('height', Bounce.MAZE_HEIGHT);
    tile.setAttribute('width', Bounce.MAZE_WIDTH);
    tile.setAttribute('x', 0);
    tile.setAttribute('y', 0);
    svg.appendChild(tile);
  }

  if (skin.graph) {
    // Draw the grid lines.
    // The grid lines are offset so that the lines pass through the centre of
    // each square.  A half-pixel offset is also added to as standard SVG
    // practice to avoid blurriness.
    var offset = Bounce.SQUARE_SIZE / 2 + 0.5;
    for (k = 0; k < Bounce.ROWS; k++) {
      var h_line = document.createElementNS(Blockly.SVG_NS, 'line');
      h_line.setAttribute('y1', k * Bounce.SQUARE_SIZE + offset);
      h_line.setAttribute('x2', Bounce.MAZE_WIDTH);
      h_line.setAttribute('y2', k * Bounce.SQUARE_SIZE + offset);
      h_line.setAttribute('stroke', skin.graph);
      h_line.setAttribute('stroke-width', 1);
      svg.appendChild(h_line);
    }
    for (k = 0; k < Bounce.COLS; k++) {
      var v_line = document.createElementNS(Blockly.SVG_NS, 'line');
      v_line.setAttribute('x1', k * Bounce.SQUARE_SIZE + offset);
      v_line.setAttribute('x2', k * Bounce.SQUARE_SIZE + offset);
      v_line.setAttribute('y2', Bounce.MAZE_HEIGHT);
      v_line.setAttribute('stroke', skin.graph);
      v_line.setAttribute('stroke-width', 1);
      svg.appendChild(v_line);
    }
  }

  // Draw the tiles making up the maze map.

  // Return a value of '0' if the specified square is wall or out of bounds '1'
  // otherwise (empty, obstacle, start, finish).
  var normalize = function(x, y) {
    return ((Bounce.map[y] === undefined) ||
            (Bounce.map[y][x] === undefined) ||
            (Bounce.map[y][x] == SquareType.WALL)) ? '0' : '1';
  };

  // Compute and draw the tile for each square.
  var tileId = 0;
  for (y = 0; y < Bounce.ROWS; y++) {
    for (x = 0; x < Bounce.COLS; x++) {
      // Compute the tile index.
      tile = normalize(x, y) +
          normalize(x, y - 1) +  // North.
          normalize(x + 1, y) +  // West.
          normalize(x, y + 1) +  // South.
          normalize(x - 1, y);   // East.

      // Draw the tile.
      if (!TILE_SHAPES[tile]) {
        // Empty square.  Use null0 for large areas, with null1-4 for borders.
        if (tile == '00000' && Math.random() > 0.3) {
          Bounce.wallMap[y][x] = 0;
          tile = 'null0';
        } else {
          var wallIdx = Math.floor(1 + Math.random() * 4);
          Bounce.wallMap[y][x] = wallIdx;
          tile = 'null' + wallIdx;
        }
      }
      var left = TILE_SHAPES[tile][0];
      var top = TILE_SHAPES[tile][1];
      // Tile's clipPath element.
      var tileClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
      tileClip.setAttribute('id', 'tileClipPath' + tileId);
      var tileClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
      tileClipRect.setAttribute('width', Bounce.SQUARE_SIZE);
      tileClipRect.setAttribute('height', Bounce.SQUARE_SIZE);

      tileClipRect.setAttribute('x', x * Bounce.SQUARE_SIZE);
      tileClipRect.setAttribute('y', y * Bounce.SQUARE_SIZE);

      tileClip.appendChild(tileClipRect);
      svg.appendChild(tileClip);
      // Tile sprite.
      var tileElement = document.createElementNS(Blockly.SVG_NS, 'image');
      tileElement.setAttribute('id', 'tileElement' + tileId);
      tileElement.setAttributeNS('http://www.w3.org/1999/xlink',
                                 'xlink:href',
                                 skin.tiles);
      tileElement.setAttribute('height', Bounce.SQUARE_SIZE * 4);
      tileElement.setAttribute('width', Bounce.SQUARE_SIZE * 5);
      tileElement.setAttribute('clip-path',
                               'url(#tileClipPath' + tileId + ')');
      tileElement.setAttribute('x', (x - left) * Bounce.SQUARE_SIZE);
      tileElement.setAttribute('y', (y - top) * Bounce.SQUARE_SIZE);
      svg.appendChild(tileElement);
      // Tile animation
      var tileAnimation = document.createElementNS(Blockly.SVG_NS,
                                                   'animate');
      tileAnimation.setAttribute('id', 'tileAnimation' + tileId);
      tileAnimation.setAttribute('attributeType', 'CSS');
      tileAnimation.setAttribute('attributeName', 'opacity');
      tileAnimation.setAttribute('from', 1);
      tileAnimation.setAttribute('to', 0);
      tileAnimation.setAttribute('dur', '1s');
      tileAnimation.setAttribute('begin', 'indefinite');
      tileElement.appendChild(tileAnimation);

      tileId++;
    }
  }

  // Ball's clipPath element, whose (x, y) is reset by Bounce.displayBall
  var ballClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
  ballClip.setAttribute('id', 'ballClipPath');
  var ballClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
  ballClipRect.setAttribute('id', 'ballClipRect');
  ballClipRect.setAttribute('width', Bounce.PEGMAN_WIDTH);
  ballClipRect.setAttribute('height', Bounce.PEGMAN_HEIGHT);
  ballClip.appendChild(ballClipRect);
  svg.appendChild(ballClip);
  
  // Add ball.
  var ballIcon = document.createElementNS(Blockly.SVG_NS, 'image');
  ballIcon.setAttribute('id', 'ball');
  ballIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                          skin.avatar);
  ballIcon.setAttribute('height', Bounce.PEGMAN_HEIGHT);
  ballIcon.setAttribute('width', Bounce.PEGMAN_WIDTH * 21); // 49 * 21 = 1029
  ballIcon.setAttribute('clip-path', 'url(#ballClipPath)');
  svg.appendChild(ballIcon);

  // Paddle's clipPath element, whose (x, y) is reset by Bounce.displayPaddle
  var paddleClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
  paddleClip.setAttribute('id', 'paddleClipPath');
  var paddleClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
  paddleClipRect.setAttribute('id', 'paddleClipRect');
  paddleClipRect.setAttribute('width', Bounce.PEGMAN_WIDTH);
  paddleClipRect.setAttribute('height', Bounce.PEGMAN_HEIGHT);
  paddleClip.appendChild(paddleClipRect);
  svg.appendChild(paddleClip);
  
  // Add ball.
  var paddleIcon = document.createElementNS(Blockly.SVG_NS, 'image');
  paddleIcon.setAttribute('id', 'paddle');
  paddleIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                            skin.avatar);
  paddleIcon.setAttribute('height', Bounce.PEGMAN_HEIGHT);
  paddleIcon.setAttribute('width', Bounce.PEGMAN_WIDTH * 21); // 49 * 21 = 1029
  paddleIcon.setAttribute('clip-path', 'url(#paddleClipPath)');
  svg.appendChild(paddleIcon);

  if (Bounce.finish_) {
    // Add finish marker.
    var finishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
    finishMarker.setAttribute('id', 'finish');
    finishMarker.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                                skin.goal);
    finishMarker.setAttribute('height', Bounce.MARKER_HEIGHT);
    finishMarker.setAttribute('width', Bounce.MARKER_WIDTH);
    svg.appendChild(finishMarker);
  }

  // Add wall hitting animation
  if (skin.hittingWallAnimation) {
    var wallAnimationIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    wallAnimationIcon.setAttribute('id', 'wallAnimation');
    wallAnimationIcon.setAttribute('height', Bounce.SQUARE_SIZE);
    wallAnimationIcon.setAttribute('width', Bounce.SQUARE_SIZE);
    wallAnimationIcon.setAttribute('visibility', 'hidden');
    svg.appendChild(wallAnimationIcon);
  }

  // Add obstacles.
  var obsId = 0;
  for (y = 0; y < Bounce.ROWS; y++) {
    for (x = 0; x < Bounce.COLS; x++) {
      if (Bounce.map[y][x] == SquareType.OBSTACLE) {
        var obsIcon = document.createElementNS(Blockly.SVG_NS, 'image');
        obsIcon.setAttribute('id', 'obstacle' + obsId);
        obsIcon.setAttribute('height', Bounce.MARKER_HEIGHT * skin.obstacleScale);
        obsIcon.setAttribute('width', Bounce.MARKER_WIDTH * skin.obstacleScale);
        obsIcon.setAttributeNS(
          'http://www.w3.org/1999/xlink', 'xlink:href', skin.obstacle);
        obsIcon.setAttribute('x',
                             Bounce.SQUARE_SIZE * (x + 0.5) -
                             obsIcon.getAttribute('width') / 2);
        obsIcon.setAttribute('y',
                             Bounce.SQUARE_SIZE * (y + 0.9) -
                             obsIcon.getAttribute('height'));
        svg.appendChild(obsIcon);
      }
      ++obsId;
    }
  }
};

Bounce.onTick = function() {
  var deltaX = 0;
  var deltaY = 0;
  var collision = false;
  
  switch (Bounce.ballD) {
    case AngleDirection.NORTHEAST:
      deltaY = -0.05;
      deltaX = 0.05;
      break;
    case AngleDirection.NORTHWEST:
      deltaY = -0.05;
      deltaX = -0.05;
      break;
    case AngleDirection.SOUTHEAST:
      deltaY = 0.05;
      deltaX = 0.05;
      break;
    case AngleDirection.SOUTHWEST:
      deltaY = 0.05;
      deltaX = -0.05;
      break;
  }

  Bounce.ballX += deltaX;
  Bounce.ballY += deltaY;
  
  if (Bounce.ballX < 0) {
    Bounce.ballX = 0;
    Bounce.ballD += 1;
    collision = true;
  } else if (Bounce.ballX > (Bounce.COLS - 1)) {
    Bounce.ballX = Bounce.COLS - 1;
    Bounce.ballD += 1;
    collision = true;
  }

  if (Bounce.ballY < 0) {
    Bounce.ballY = 0;
    Bounce.ballD += 1;
    collision = true;
  } else if (Bounce.ballY > (Bounce.ROWS - 1)) {
    Bounce.ballY = Bounce.ROWS - 1;
    Bounce.ballD += 1;
    collision = true;
  }
  
  if (collision) {
    Bounce.ballD %= 4;
    console.log("collision");
    try {
      Bounce.whenWallCollided(BlocklyApps, api);
    }
    catch (e) {
    }
  }
  
  Bounce.displayBall(Bounce.ballX, Bounce.ballY, 8);
  Bounce.displayPaddle(Bounce.paddleX, Bounce.paddleY, 0);
}

Keycodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

Bounce.onKeyDown = function(e) {
  switch (e.keyCode) {
    case Keycodes.LEFT:
      try { Bounce.whenLeft(BlocklyApps, api); } catch (e) { }
      break;
    case Keycodes.UP:
      try { Bounce.whenUp(BlocklyApps, api); } catch (e) { }
      break;
    case Keycodes.RIGHT:
      try { Bounce.whenRight(BlocklyApps, api); } catch (e) { }
      break;
    case Keycodes.DOWN:
      try { Bounce.whenDown(BlocklyApps, api); } catch (e) { }
      break;
  }
};

/**
 * Initialize Blockly and the maze.  Called on page load.
 */
Bounce.init = function(config) {
  Bounce.intervalId = 0;
  Bounce.whenWallCollided = null;
  Bounce.whenDown = null;
  Bounce.whenLeft = null;
  Bounce.whenRight = null;
  Bounce.whenUp = null;
  skin = config.skin;
  level = config.level;
  loadLevel();
  
  window.addEventListener("keydown", Bounce.onKeyDown, false);

  config.html = page({
    assetUrl: BlocklyApps.assetUrl,
    data: {
      localeDirection: BlocklyApps.localeDirection(),
      visualization: require('./visualization.html')(),
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

    Blockly.SNAP_RADIUS *= Bounce.scale.snapRadius;

    // Locate the start and finish squares.
    for (var y = 0; y < Bounce.ROWS; y++) {
      for (var x = 0; x < Bounce.COLS; x++) {
        if (Bounce.map[y][x] == SquareType.START) {
          Bounce.start_ = {x: x, y: y};
        } else if (Bounce.map[y][x] == SquareType.FINISH) {
          Bounce.finish_ = {x: x, y: y};
        } else if (Bounce.map[y][x] == SquareType.STARTANDFINISH) {
          Bounce.start_ = {x: x, y: y};
          Bounce.finish_ = {x: x, y: y};
        } else if (Bounce.map[y][x] == SquareType.BALLSTART) {
          Bounce.ballStart_ = {x: x, y: y};
        } else if (Bounce.map[y][x] == SquareType.PADDLESTART) {
          Bounce.paddleStart_ = {x: x, y: y};
        }
      }
    }

    drawMap();
  };

  config.getDisplayWidth = function() {
    var visualization = document.getElementById('visualization');
    return visualization.getBoundingClientRect().width;
  };

  BlocklyApps.init(config);
};

/**
 * Reset the maze to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
BlocklyApps.reset = function(first) {
  // Clear event handlers and kill onTick timer
  Bounce.whenWallCollided = null;
  Bounce.whenDown = null;
  Bounce.whenLeft = null;
  Bounce.whenRight = null;
  Bounce.whenUp = null;
  window.clearInterval(Bounce.intervalId);
  
  // Move Ball into position.
  Bounce.ballX = Bounce.ballStart_.x;
  Bounce.ballY = Bounce.ballStart_.y;
  
  // Move Paddle into position.
  Bounce.paddleX = Bounce.paddleStart_.x;
  Bounce.paddleY = Bounce.paddleStart_.y;
  
  Bounce.ballD = AngleDirection.SOUTHWEST;
  Bounce.displayBall(Bounce.ballX, Bounce.ballY, 8);
  
  Bounce.displayPaddle(Bounce.paddleX, Bounce.paddleY, 0);

  var svg = document.getElementById('svgBounce');

  if (Bounce.finish_) {
    // Move the finish icon into position.
    var finishIcon = document.getElementById('finish');
    finishIcon.setAttribute('x', Bounce.SQUARE_SIZE * (Bounce.finish_.x + 0.5) -
        finishIcon.getAttribute('width') / 2);
    finishIcon.setAttribute('y', Bounce.SQUARE_SIZE * (Bounce.finish_.y + 0.9) -
        finishIcon.getAttribute('height'));
    finishIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.goal);
  }

  // Reset the obstacle image.
  var obsId = 0;
  var x, y;
  for (y = 0; y < Bounce.ROWS; y++) {
    for (x = 0; x < Bounce.COLS; x++) {
      var obsIcon = document.getElementById('obstacle' + obsId);
      if (obsIcon) {
        obsIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                               skin.obstacle);
      }
      ++obsId;
    }
  }

  // Reset the tiles
  var tileId = 0;
  for (y = 0; y < Bounce.ROWS; y++) {
    for (x = 0; x < Bounce.COLS; x++) {
      // Tile's clipPath element.
      var tileClip = document.getElementById('tileClipPath' + tileId);
      tileClip.setAttribute('visibility', 'visible');
      // Tile sprite.
      var tileElement = document.getElementById('tileElement' + tileId);
      tileElement.setAttributeNS(
          'http://www.w3.org/1999/xlink', 'xlink:href', skin.tiles);
      tileElement.setAttribute('opacity', 1);
      tileId++;
    }
  }
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
  Bounce.execute();
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
  if (!Bounce.waitingForReport) {
    BlocklyApps.displayFeedback({
      app: 'bounce', //XXX
      skin: skin.id,
      feedbackType: Bounce.testResults,
      response: Bounce.response,
      level: level
    });
  }
};

/**
 * Function to be called when the service report call is complete
 * @param {object} JSON response (if available)
 */
Bounce.onReportComplete = function(response) {
  Bounce.response = response;
  Bounce.waitingForReport = false;
  // Disable the run button until onReportComplete is called.
  var runButton = document.getElementById('runButton');
  runButton.disabled = false;
  displayFeedback();
};

/**
 * Execute the user's code.  Heaven help us...
 */
Bounce.execute = function() {
  BlocklyApps.log = [];
  BlocklyApps.ticks = 100; //TODO: Set higher for some levels
  var code = Blockly.Generator.workspaceToCode('JavaScript', 'bounce_whenRun');
  Bounce.result = ResultType.UNSET;
  Bounce.testResults = BlocklyApps.TestResults.NO_TESTS_RUN;
  Bounce.waitingForReport = false;
  Bounce.response = null;

  // Check for empty top level blocks to warn user about bugs,
  // especially ones that lead to infinite loops.
  if (feedback.hasEmptyTopLevelBlocks()) {
    Bounce.testResults = BlocklyApps.TestResults.EMPTY_BLOCK_FAIL;
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
  
  var codeWallCollided = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenWallCollided');
  var whenWallCollidedFunc = codegen.functionFromCode(
                                     codeWallCollided, {
                                      BlocklyApps: BlocklyApps,
                                      Bounce: api } );

  var codeLeft = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenLeft');
  var whenLeftFunc = codegen.functionFromCode(
                                     codeLeft, {
                                      BlocklyApps: BlocklyApps,
                                      Bounce: api } );

  var codeRight = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenRight');
  var whenRightFunc = codegen.functionFromCode(
                                     codeRight, {
                                      BlocklyApps: BlocklyApps,
                                      Bounce: api } );

  BlocklyApps.playAudio('start', {volume: 0.5});

  BlocklyApps.reset(false);
  
  // Set event handlers and start the onTick timer
  Bounce.whenWallCollided = whenWallCollidedFunc;
  Bounce.whenLeft = whenLeftFunc;
  Bounce.whenRight = whenRightFunc;
  Bounce.intervalId = window.setInterval(Bounce.onTick, Bounce.scale.stepSpeed);
};

Bounce.foo = function() {
  // If we know they succeeded, mark levelComplete true
  // Note that we have not yet animated the succesful run
  BlocklyApps.levelComplete = (Bounce.result == ResultType.SUCCESS);
  
  Bounce.testResults = BlocklyApps.getTestResults();
  
  if (level.editCode) {
    Bounce.testResults = BlocklyApps.levelComplete ?
    BlocklyApps.TestResults.ALL_PASS :
    BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL;
  }
  
  if (level.failForOther1Star && !BlocklyApps.levelComplete) {
    Bounce.testResults = BlocklyApps.TestResults.OTHER_1_STAR_FAIL;
  }
  
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var textBlocks = Blockly.Xml.domToText(xml);
  
  Bounce.waitingForReport = true;
  
  // Report result to server.
  BlocklyApps.report({
                     app: 'bounce',
                     level: level.id,
                     result: Bounce.result === ResultType.SUCCESS,
                     testResult: Bounce.testResults,
                     program: encodeURIComponent(textBlocks),
                     onComplete: Bounce.onReportComplete
                     });
}

/**
 * Replace the tiles surronding the obstacle with broken tiles.
 */
Bounce.updateSurroundingTiles = function(obstacleY, obstacleX, brokenTiles) {
  var tileCoords = [
    [obstacleY - 1, obstacleX - 1],
    [obstacleY - 1, obstacleX],
    [obstacleY - 1, obstacleX + 1],
    [obstacleY, obstacleX - 1],
    [obstacleY, obstacleX],
    [obstacleY, obstacleX + 1],
    [obstacleY + 1, obstacleX - 1],
    [obstacleY + 1, obstacleX],
    [obstacleY + 1, obstacleX + 1]
  ];
  for (var idx = 0; idx < tileCoords.length; ++idx) {
    var tileIdx = tileCoords[idx][1] + Bounce.COLS * tileCoords[idx][0];
    var tileElement = document.getElementById('tileElement' + tileIdx);
    if (tileElement) {
      tileElement.setAttributeNS(
          'http://www.w3.org/1999/xlink', 'xlink:href', brokenTiles);
    }
  }
};

/**
 * Set the tiles to be transparent gradually.
 */
Bounce.setTileTransparent = function() {
  var tileId = 0;
  for (var y = 0; y < Bounce.ROWS; y++) {
    for (var x = 0; x < Bounce.COLS; x++) {
      // Tile sprite.
      var tileElement = document.getElementById('tileElement' + tileId);
      var tileAnimation = document.getElementById('tileAnimation' + tileId);
      if (tileElement) {
        tileElement.setAttribute('opacity', 0);
      }
      if (tileAnimation) {
        tileAnimation.beginElement();
      }
      tileId++;
    }
  }
};

/**
 * Display Ball at the specified location, facing the specified direction.
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 * @param {number} d Direction (0 - 15) or dance (16 - 17).
 */
Bounce.displayBall = function(x, y, d) {
  var ballIcon = document.getElementById('ball');
  ballIcon.setAttribute('x',
                        x * Bounce.SQUARE_SIZE - d * Bounce.PEGMAN_WIDTH + 1);
  ballIcon.setAttribute('y',
                        y * Bounce.SQUARE_SIZE + Bounce.PEGMAN_Y_OFFSET - 8);
  
  var ballClipRect = document.getElementById('ballClipRect');
  ballClipRect.setAttribute('x', x * Bounce.SQUARE_SIZE + 1);
  ballClipRect.setAttribute('y', ballIcon.getAttribute('y'));
};

/**
 * Display Paddle at the specified location
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 * @param {number} d Direction (0 - 15) or dance (16 - 17).
 */
Bounce.displayPaddle = function(x, y, d) {
  var paddleIcon = document.getElementById('paddle');
  paddleIcon.setAttribute('x',
                          x * Bounce.SQUARE_SIZE - d * Bounce.PEGMAN_WIDTH + 1);
  paddleIcon.setAttribute('y',
                          y * Bounce.SQUARE_SIZE + Bounce.PEGMAN_Y_OFFSET - 8);
  
  var paddleClipRect = document.getElementById('paddleClipRect');
  paddleClipRect.setAttribute('x', x * Bounce.SQUARE_SIZE + 1);
  paddleClipRect.setAttribute('y', paddleIcon.getAttribute('y'));
};

/**
 * Keep the direction within 0-3, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Bounce.constrainDirection4 = function(d) {
  if (d < 0) {
    d += 4;
  } else if (d > 3) {
    d -= 4;
  }
  return d;
};

/**
 * Keep the direction within 0-15, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Bounce.constrainDirection16 = function(d) {
  if (d < 0) {
    d += 16;
  } else if (d > 15) {
    d -= 16;
  }
  return d;
};

var atFinish = function() {
  return !Bounce.finish_ ||
      (Bounce.pegmanX == Bounce.finish_.x && Bounce.pegmanY == Bounce.finish_.y);
};

Bounce.checkSuccess = function() {
  if (atFinish()) {
    // Finished.  Terminate the user's program.
    BlocklyApps.log.push(['finish', null]);
    throw true;
  }
  return false;
};

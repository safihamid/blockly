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
var SquareType = tiles.SquareType;

/**
 * Create a namespace for the application.
 */
var Bounce = module.exports;

Bounce.keyState = {};
Bounce.btnState = {};

var ButtonState = {
  UP: 0,
  DOWN: 1
};

var ArrowIds = {
  LEFT: 'leftButton',
  UP: 'upButton',
  RIGHT: 'rightButton',
  DOWN: 'downButton'
};

var Keycodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

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
  Bounce.timeoutFailureTick = level.timeoutFailureTick || Infinity;
  Bounce.softButtons_ = level.softButtons || [];
  Bounce.respawnBalls = level.respawnBalls || false;
  Bounce.failOnBallExit = level.failOnBallExit || false;
  BlocklyApps.IDEAL_BLOCK_NUM = level.ideal || Infinity;
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
  Bounce.BALL_Y_OFFSET = skin.ballYOffset;
  Bounce.PADDLE_Y_OFFSET = skin.paddleYOffset;
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

/**
 * PIDs of async tasks currently executing.
 */
Bounce.pidList = [];

// Map each possible shape to a sprite.
// Input: Binary string representing Centre/North/East/South/West squares.
// Output: [x, y] coordinates of each tile's sprite in tiles.png.
var WALL_TILE_SHAPES = {
  '1X101': [1, 0],  // Horiz top
  '11X10': [2, 1],  // Vert right
  '11XX0': [2, 1],  // Bottom right corner
  '1XX11': [2, 0],  // Top right corner
  '1X001': [1, 0],  // Top horiz right end
  '1X100': [1, 0],  // Top horiz left end
  '1101X': [0, 1],  // Vert left
  '110XX': [0, 1],  // Bottom left corner
  '1X11X': [0, 0],  // Top left corner
  'null0': [1, 1],  // Empty
};

var GOAL_TILE_SHAPES = {
  '1X101': [2, 3],  // Horiz top
  '1XX11': [3, 3],  // Top right corner
  '1X001': [3, 3],  // Top horiz right end
  '1X11X': [0, 2],  // Top left corner
  '1X100': [0, 2],  // Top horiz left end
  'null0': [1, 1],  // Empty
};

var drawMap = function() {
  var svg = document.getElementById('svgBounce');
  var i, x, y, k, tile;

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

  // Return a value of '0' if the specified square is not a wall, '1' for
  // a wall, 'X' for out of bounds
  var wallNormalize = function(x, y) {
    return ((Bounce.map[y] === undefined) ||
            (Bounce.map[y][x] === undefined)) ? 'X' :
              (Bounce.map[y][x] & SquareType.WALL) ? '1' : '0';
  };

  // Return a value of '0' if the specified square is not a wall, '1' for
  // a wall, 'X' for out of bounds
  var goalNormalize = function(x, y) {
    return ((Bounce.map[y] === undefined) ||
            (Bounce.map[y][x] === undefined)) ? 'X' :
              (Bounce.map[y][x] & SquareType.GOAL) ? '1' : '0';
  };

  // Compute and draw the tile for each square.
  var tileId = 0;
  for (y = 0; y < Bounce.ROWS; y++) {
    for (x = 0; x < Bounce.COLS; x++) {
      var left;
      var top;
      var image;
      // Compute the tile index.
      tile = wallNormalize(x, y) +
          wallNormalize(x, y - 1) +  // North.
          wallNormalize(x + 1, y) +  // East.
          wallNormalize(x, y + 1) +  // South.
          wallNormalize(x - 1, y);   // West.

      // Draw the tile.
      if (WALL_TILE_SHAPES[tile]) {
        left = WALL_TILE_SHAPES[tile][0];
        top = WALL_TILE_SHAPES[tile][1];
        image = skin.tiles;
      }
      else {
        // Compute the tile index.
        tile = goalNormalize(x, y) +
            goalNormalize(x, y - 1) +  // North.
            goalNormalize(x + 1, y) +  // East.
            goalNormalize(x, y + 1) +  // South.
            goalNormalize(x - 1, y);   // West.

        if (!GOAL_TILE_SHAPES[tile]) {
          // Empty square.  Use null0.
          tile = 'null0';
        }
        left = GOAL_TILE_SHAPES[tile][0];
        top = GOAL_TILE_SHAPES[tile][1];
        image = skin.goalTiles;
      }
      if (tile != 'null0') {
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
                                   image);
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
      }

      tileId++;
    }
  }

  if (Bounce.ballStart_) {
    for (i = 0; i < Bounce.ballCount; i++) {
      // Ball's clipPath element, whose (x, y) is reset by Bounce.displayBall
      var ballClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
      ballClip.setAttribute('id', 'ballClipPath' + i);
      var ballClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
      ballClipRect.setAttribute('id', 'ballClipRect' + i);
      ballClipRect.setAttribute('width', Bounce.PEGMAN_WIDTH);
      ballClipRect.setAttribute('height', Bounce.PEGMAN_HEIGHT);
      ballClip.appendChild(ballClipRect);
      svg.appendChild(ballClip);
      
      // Add ball.
      var ballIcon = document.createElementNS(Blockly.SVG_NS, 'image');
      ballIcon.setAttribute('id', 'ball' + i);
      ballIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.ball);
      ballIcon.setAttribute('height', Bounce.PEGMAN_HEIGHT);
      ballIcon.setAttribute('width', Bounce.PEGMAN_WIDTH);
      ballIcon.setAttribute('clip-path', 'url(#ballClipPath' + i + ')');
      svg.appendChild(ballIcon);
    }
  }

  if (Bounce.paddleStart_) {
    // Paddle's clipPath element, whose (x, y) is reset by Bounce.displayPaddle
    var paddleClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
    paddleClip.setAttribute('id', 'paddleClipPath');
    var paddleClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
    paddleClipRect.setAttribute('id', 'paddleClipRect');
    paddleClipRect.setAttribute('width', Bounce.PEGMAN_WIDTH);
    paddleClipRect.setAttribute('height', Bounce.PEGMAN_HEIGHT);
    paddleClip.appendChild(paddleClipRect);
    svg.appendChild(paddleClip);
    
    // Add paddle.
    var paddleIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    paddleIcon.setAttribute('id', 'paddle');
    paddleIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.paddle);
    paddleIcon.setAttribute('height', Bounce.PEGMAN_HEIGHT);
    paddleIcon.setAttribute('width', Bounce.PEGMAN_WIDTH);
    paddleIcon.setAttribute('clip-path', 'url(#paddleClipPath)');
    svg.appendChild(paddleIcon);
  }
  
  if (Bounce.paddleFinish_) {
    for (i = 0; i < Bounce.paddleFinishCount; i++) {
      // Add finish markers.
      var paddleFinishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
      paddleFinishMarker.setAttribute('id', 'paddlefinish' + i);
      paddleFinishMarker.setAttributeNS('http://www.w3.org/1999/xlink',
                                        'xlink:href',
                                        skin.goal);
      paddleFinishMarker.setAttribute('height', Bounce.MARKER_HEIGHT);
      paddleFinishMarker.setAttribute('width', Bounce.MARKER_WIDTH);
      svg.appendChild(paddleFinishMarker);
    }
  }

  if (Bounce.ballFinish_) {
    // Add ball finish marker.
    var ballFinishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
    ballFinishMarker.setAttribute('id', 'ballfinish');
    ballFinishMarker.setAttributeNS('http://www.w3.org/1999/xlink',
                                    'xlink:href',
                                    skin.goal);
    ballFinishMarker.setAttribute('height', Bounce.MARKER_HEIGHT);
    ballFinishMarker.setAttribute('width', Bounce.MARKER_WIDTH);
    svg.appendChild(ballFinishMarker);
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

Bounce.calcDistance = function(xDist, yDist) {
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

Bounce.onTick = function() {
  Bounce.tickCount++;
  
  // Run key event handlers for any keys that are down:
  for (var key in Keycodes) {
    if (Bounce.keyState[Keycodes[key]] &&
        Bounce.keyState[Keycodes[key]] == "keydown") {
      switch (Keycodes[key]) {
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
    }
  }
  
  for (var btn in ArrowIds) {
    if (Bounce.btnState[ArrowIds[btn]] &&
        Bounce.btnState[ArrowIds[btn]] == ButtonState.DOWN) {
      switch (ArrowIds[btn]) {
        case ArrowIds.LEFT:
          try { Bounce.whenLeft(BlocklyApps, api); } catch (e) { }
          break;
        case ArrowIds.UP:
          try { Bounce.whenUp(BlocklyApps, api); } catch (e) { }
          break;
        case ArrowIds.RIGHT:
          try { Bounce.whenRight(BlocklyApps, api); } catch (e) { }
          break;
        case ArrowIds.DOWN:
          try { Bounce.whenDown(BlocklyApps, api); } catch (e) { }
          break;
      }
    }
  }

  if (Bounce.ballStart_) {
    for (var i = 0; i < Bounce.ballCount; i++) {
      var deltaX = 0.1 * Math.sin(Bounce.ballD[i]);
      var deltaY = -0.1 * Math.cos(Bounce.ballD[i]);
      
      var wasXOK = Bounce.ballX[i] >= 0 && Bounce.ballX[i] <= Bounce.COLS - 1;
      var wasYOK = Bounce.ballY[i] >= 0;
      var wasYAboveBottom = Bounce.ballY[i] <= Bounce.ROWS - 1;

      Bounce.ballX[i] += deltaX;
      Bounce.ballY[i] += deltaY;
      
      var nowXOK = Bounce.ballX[i] >= 0 && Bounce.ballX[i] <= Bounce.COLS - 1;
      var nowYOK = Bounce.ballY[i] >= 0;
      var nowYAboveBottom = Bounce.ballY[i] <= Bounce.ROWS - 1;
      
      if (wasXOK && !nowXOK) {
        try { Bounce.whenWallCollided(BlocklyApps, api); } catch (e) { }
      }
      
      if (wasYOK && !nowYOK) {
        if (Bounce.map[0][Math.floor(Bounce.ballX[i])] & SquareType.GOAL) {
          try { Bounce.whenBallInGoal(BlocklyApps, api); } catch (e) { }
          Bounce.pidList.push(window.setTimeout(
              delegate(this, Bounce.moveBallOffscreen, i),
              1000));
          if (Bounce.respawnBalls) {
            Bounce.pidList.push(window.setTimeout(
                delegate(this, Bounce.playSoundAndResetBall, i),
                3000));
          }
        } else {
          try { Bounce.whenWallCollided(BlocklyApps, api); } catch (e) { }
        }
      }
      
      var xPaddleBall = Bounce.ballX[i] - Bounce.paddleX;
      var yPaddleBall = Bounce.ballY[i] - Bounce.paddleY;
      var distPaddleBall = Bounce.calcDistance(xPaddleBall, yPaddleBall);
      
      if (distPaddleBall < tiles.PADDLE_BALL_COLLIDE_DISTANCE) {
        // paddle ball collision
        try { Bounce.whenPaddleCollided(BlocklyApps, api); } catch (e) { }
      } else if (wasYAboveBottom && !nowYAboveBottom) {
        // ball missed paddle
        try { Bounce.whenBallMissesPaddle(BlocklyApps, api); } catch (e) { }
        Bounce.pidList.push(window.setTimeout(
            delegate(this, Bounce.moveBallOffscreen, i),
            1000));
        if (Bounce.respawnBalls) {
          Bounce.pidList.push(window.setTimeout(
              delegate(this, Bounce.playSoundAndResetBall, i),
              3000));
        } else if (Bounce.failOnBallExit) {
          BlocklyApps.playAudio('failure', {volume: 0.5});
          Bounce.result = ResultType.FAILURE;
          Bounce.onPuzzleComplete();          
        }
      }
    
      Bounce.displayBall(i, Bounce.ballX[i], Bounce.ballY[i]);
    }
  }
  
  Bounce.displayPaddle(Bounce.paddleX, Bounce.paddleY);
  
  if (Bounce.allFinishesComplete()) {
    Bounce.result = ResultType.SUCCESS;
    Bounce.onPuzzleComplete();
  } else if (Bounce.timedOut()) {
    BlocklyApps.playAudio('failure', {volume: 0.5});
    Bounce.result = ResultType.FAILURE;
    Bounce.onPuzzleComplete();
  }
};

Bounce.onKey = function(e) {
  // Store the most recent event type per-key
  Bounce.keyState[e.keyCode] = e.type;
  
  // If we are actively running our tick loop, suppress default event handling
  if (Bounce.intervalId &&
      e.keyCode >= Keycodes.LEFT && e.keyCode <= Keycodes.DOWN) {
    e.preventDefault();
  }
};

Bounce.onArrowButtonDown = function(e, idBtn) {
  // Store the most recent event type per-button
  Bounce.btnState[idBtn] = ButtonState.DOWN;
  e.preventDefault();  // Stop normal events so we see mouseup later.
};

Bounce.onArrowButtonUp = function(e, idBtn) {
  // Store the most recent event type per-button
  Bounce.btnState[idBtn] = ButtonState.UP;
};

Bounce.onMouseUp = function(e) {
  // Reset btnState on mouse up
  Bounce.btnState = {};
};

/**
 * Initialize Blockly and the Bounce app.  Called on page load.
 */
Bounce.init = function(config) {
  Bounce.clearEventHandlersKillTickLoop();
  skin = config.skin;
  level = config.level;
  loadLevel();
  
  window.addEventListener("keydown", Bounce.onKey, false);
  window.addEventListener("keyup", Bounce.onKey, false);

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
    Blockly.loadAudio_(skin.ballStartSound, 'ballstart');
    Blockly.loadAudio_(skin.failureSound, 'failure');
    Blockly.loadAudio_(skin.rubberSound, 'rubber');
    Blockly.loadAudio_(skin.crunchSound, 'crunch');
    Blockly.loadAudio_(skin.flagSound, 'flag');
    Blockly.loadAudio_(skin.winPointSound, 'winpoint');
    Blockly.loadAudio_(skin.winPoint2Sound, 'winpoint2');
    Blockly.loadAudio_(skin.losePointSound, 'losepoint');
    Blockly.loadAudio_(skin.losePoint2Sound, 'losepoint2');
    Blockly.loadAudio_(skin.goal1Sound, 'goal1');
    Blockly.loadAudio_(skin.goal2Sound, 'goal2');
    Blockly.loadAudio_(skin.woodSound, 'wood');
    Blockly.loadAudio_(skin.retroSound, 'retro');
    Blockly.loadAudio_(skin.slapSound, 'slap');
    Blockly.loadAudio_(skin.hitSound, 'hit');
  };

  config.afterInject = function() {
    // Connect up arrow button event handlers
    for (var btn in ArrowIds) {
      dom.addClickTouchEvent(document.getElementById(ArrowIds[btn]),
                             delegate(this,
                                      Bounce.onArrowButtonUp,
                                      ArrowIds[btn]));
      dom.addMouseDownTouchEvent(document.getElementById(ArrowIds[btn]),
                                 delegate(this,
                                          Bounce.onArrowButtonDown,
                                          ArrowIds[btn]));
    }
    document.addEventListener('mouseup', Bounce.onMouseUp, false);
  
    /**
     * The richness of block colours, regardless of the hue.
     * MOOC blocks should be brighter (target audience is younger).
     * Must be in the range of 0 (inclusive) to 1 (exclusive).
     * Blockly's default is 0.45.
     */
    Blockly.HSV_SATURATION = 0.6;

    Blockly.SNAP_RADIUS *= Bounce.scale.snapRadius;
    
    Bounce.ballCount = 0;
    Bounce.paddleFinishCount = 0;
    
    // Locate the start and finish squares.
    for (var y = 0; y < Bounce.ROWS; y++) {
      for (var x = 0; x < Bounce.COLS; x++) {
        if (Bounce.map[y][x] & SquareType.PADDLEFINISH) {
          if (0 === Bounce.paddleFinishCount) {
            Bounce.paddleFinish_ = [];
          }
          Bounce.paddleFinish_[Bounce.paddleFinishCount] = {x: x, y: y};
          Bounce.paddleFinishCount++;
        } else if (Bounce.map[y][x] & SquareType.BALLSTART) {
          if (0 === Bounce.ballCount) {
            Bounce.ballStart_ = [];
            Bounce.ballX = [];
            Bounce.ballY = [];
            Bounce.ballD = [];
          }
          Bounce.ballStart_[Bounce.ballCount] =
              {x: x, y: y, d: level.ballDirection || 0};
          Bounce.ballCount++;
        } else if (Bounce.map[y][x] & SquareType.PADDLESTART) {
          Bounce.paddleStart_ = {x: x, y: y};
        } else if (Bounce.map[y][x] & SquareType.BALLFINISH) {
          Bounce.ballFinish_ = {x: x, y: y};
        } else if (Bounce.map[y][x] & SquareType.GOAL) {
          Bounce.goalLocated_ = true;
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
 * Clear the event handlers and stop the onTick timer.
 */
Bounce.clearEventHandlersKillTickLoop = function() {
  Bounce.whenWallCollided = null;
  Bounce.whenBallInGoal = null;
  Bounce.whenBallMissesPaddle = null;
  Bounce.whenPaddleCollided = null;
  Bounce.whenDown = null;
  Bounce.whenLeft = null;
  Bounce.whenRight = null;
  Bounce.whenUp = null;
  if (Bounce.intervalId) {
    window.clearInterval(Bounce.intervalId);
  }
  Bounce.intervalId = 0;
};

/**
 * Move ball to a safe place off of the screen.
 * @param {int} i Index of ball to be moved.
 */
Bounce.moveBallOffscreen = function(i) {
  Bounce.ballX[i] = 100;
  Bounce.ballY[i] = 100;
  Bounce.ballD[i] = Math.PI / 2;
};

/**
 * Play a start sound and reset the ball at index i and redraw it.
 * @param {int} i Index of ball to be reset.
 */
Bounce.playSoundAndResetBall = function(i) {
  Bounce.resetBall(i);
  BlocklyApps.playAudio('ballstart', {volume: 0.5});
};

/**
 * Reset the ball from index i to the start position and redraw it.
 * @param {int} i Index of ball to be reset.
 */
Bounce.resetBall = function(i) {
  Bounce.ballX[i] = Bounce.ballStart_[i].x;
  Bounce.ballY[i] = Bounce.ballStart_[i].y;
  Bounce.ballD[i] = Bounce.ballStart_[i].d || 1.25 * Math.PI;
  
  Bounce.displayBall(i, Bounce.ballX[i], Bounce.ballY[i]);
};

/**
 * Reset the app to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
BlocklyApps.reset = function(first) {
  var i;
  Bounce.clearEventHandlersKillTickLoop();

  // Kill all tasks.
  for (i = 0; i < Bounce.pidList.length; i++) {
    window.clearTimeout(Bounce.pidList[i]);
  }
  Bounce.pidList = [];

  // Soft buttons
  var softButtonCount = 0;
  for (i = 0; i < Bounce.softButtons_.length; i++) {
    document.getElementById(Bounce.softButtons_[i]).style.display = 'inline';
    softButtonCount++;
  }
  if (softButtonCount) {
    var softButtonsCell = document.getElementById('soft-buttons');
    softButtonsCell.className = 'soft-buttons-' + softButtonCount;
  }
  
  // Reset the score.
  Bounce.playerScore = 0;
  Bounce.opponentScore = 0;
  if (Bounce.goalLocated_) {
    var scoreCell = document.getElementById('score-cell');
    scoreCell.className = 'score-cell-enabled';
    Bounce.displayScore();
  }
  
  // Move Ball into position.
  if (Bounce.ballStart_) {
    for (i = 0; i < Bounce.ballCount; i++) {
      Bounce.resetBall(i);
    }
  }
  
  // Move Paddle into position.
  Bounce.paddleX = Bounce.paddleStart_.x;
  Bounce.paddleY = Bounce.paddleStart_.y;
  
  Bounce.displayPaddle(Bounce.paddleX, Bounce.paddleY);

  var svg = document.getElementById('svgBounce');

  if (Bounce.paddleFinish_) {
    for (i = 0; i < Bounce.paddleFinishCount; i++) {
      // Mark each finish as incomplete.
      Bounce.paddleFinish_[i].finished = false;

      // Move the finish icons into position.
      var paddleFinishIcon = document.getElementById('paddlefinish' + i);
      paddleFinishIcon.setAttribute(
          'x',
          Bounce.SQUARE_SIZE * (Bounce.paddleFinish_[i].x + 0.5) -
          paddleFinishIcon.getAttribute('width') / 2);
      paddleFinishIcon.setAttribute(
          'y',
          Bounce.SQUARE_SIZE * (Bounce.paddleFinish_[i].y + 0.9) -
          paddleFinishIcon.getAttribute('height'));
      paddleFinishIcon.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'xlink:href',
          skin.goal);
    }
  }

  if (Bounce.ballFinish_) {
    // Move the finish icon into position.
    var ballFinishIcon = document.getElementById('ballfinish');
    ballFinishIcon.setAttribute(
        'x',
        Bounce.SQUARE_SIZE * (Bounce.ballFinish_.x + 0.5) -
        ballFinishIcon.getAttribute('width') / 2);
    ballFinishIcon.setAttribute(
        'y',
        Bounce.SQUARE_SIZE * (Bounce.ballFinish_.y + 0.9) -
        ballFinishIcon.getAttribute('height'));
    ballFinishIcon.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'xlink:href',
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
      if (tileClip) {
        tileClip.setAttribute('visibility', 'visible');
      }
      // Tile sprite.
      var tileElement = document.getElementById('tileElement' + tileId);
      if (tileElement) {
        tileElement.setAttribute('opacity', 1);
      }
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

  var codeBallInGoal = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenBallInGoal');
  var whenBallInGoalFunc = codegen.functionFromCode(
                                     codeBallInGoal, {
                                      BlocklyApps: BlocklyApps,
                                      Bounce: api } );

  var codeBallMissesPaddle = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenBallMissesPaddle');
  var whenBallMissesPaddleFunc = codegen.functionFromCode(
                                     codeBallMissesPaddle, {
                                      BlocklyApps: BlocklyApps,
                                      Bounce: api } );

  var codePaddleCollided = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenPaddleCollided');
  var whenPaddleCollidedFunc = codegen.functionFromCode(
                                     codePaddleCollided, {
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

  var codeUp = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenUp');
  var whenUpFunc = codegen.functionFromCode(
                                     codeUp, {
                                      BlocklyApps: BlocklyApps,
                                      Bounce: api } );

  var codeDown = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'bounce_whenDown');
  var whenDownFunc = codegen.functionFromCode(
                                     codeDown, {
                                      BlocklyApps: BlocklyApps,
                                      Bounce: api } );

  BlocklyApps.playAudio(Bounce.ballStart_ ? 'ballstart' : 'start',
                        {volume: 0.5});

  BlocklyApps.reset(false);
  
  // Set event handlers and start the onTick timer
  Bounce.whenWallCollided = whenWallCollidedFunc;
  Bounce.whenBallInGoal = whenBallInGoalFunc;
  Bounce.whenBallMissesPaddle = whenBallMissesPaddleFunc;
  Bounce.whenPaddleCollided = whenPaddleCollidedFunc;
  Bounce.whenLeft = whenLeftFunc;
  Bounce.whenRight = whenRightFunc;
  Bounce.whenUp = whenUpFunc;
  Bounce.whenDown = whenDownFunc;
  Bounce.tickCount = 0;
  Bounce.intervalId = window.setInterval(Bounce.onTick, Bounce.scale.stepSpeed);
};

Bounce.onPuzzleComplete = function() {
  // Stop everything on screen
  Bounce.clearEventHandlersKillTickLoop();

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
 * @param {number} i Ball index..
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 */
Bounce.displayBall = function(i, x, y) {
  var ballIcon = document.getElementById('ball' + i);
  ballIcon.setAttribute('x',
                        x * Bounce.SQUARE_SIZE);
  ballIcon.setAttribute('y',
                        y * Bounce.SQUARE_SIZE + Bounce.BALL_Y_OFFSET);
  
  var ballClipRect = document.getElementById('ballClipRect' + i);
  ballClipRect.setAttribute('x', x * Bounce.SQUARE_SIZE);
  ballClipRect.setAttribute('y', ballIcon.getAttribute('y'));
};

/**
 * Display Paddle at the specified location
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 */
Bounce.displayPaddle = function(x, y) {
  var paddleIcon = document.getElementById('paddle');
  paddleIcon.setAttribute('x',
                          x * Bounce.SQUARE_SIZE);
  paddleIcon.setAttribute('y',
                          y * Bounce.SQUARE_SIZE + Bounce.PADDLE_Y_OFFSET);
  
  var paddleClipRect = document.getElementById('paddleClipRect');
  paddleClipRect.setAttribute('x', x * Bounce.SQUARE_SIZE);
  paddleClipRect.setAttribute('y', paddleIcon.getAttribute('y'));
};

/**
 * Display the score in the span element below the visualization.
 */
Bounce.displayScore = function() {
  var scoreElement = document.getElementById('bounce-score');
  scoreElement.innerText = bounceMsg.scoreText({
    playerScore: Bounce.playerScore,
    opponentScore: Bounce.opponentScore
  });
};

Bounce.timedOut = function() {
  return Bounce.tickCount > Bounce.timeoutFailureTick;
};

Bounce.allFinishesComplete = function() {
  var i;
  if (Bounce.paddleFinish_) {
    var finished, playSound;
    for (i = 0, finished = 0; i < Bounce.paddleFinishCount; i++) {
      if (!Bounce.paddleFinish_[i].finished) {
        if (essentiallyEqual(Bounce.paddleX, Bounce.paddleFinish_[i].x, 0.2) &&
            essentiallyEqual(Bounce.paddleY, Bounce.paddleFinish_[i].y, 0.2)) {
          Bounce.paddleFinish_[i].finished = true;
          finished++;
          playSound = true;

          // Change the finish icon to goalSuccess.
          var paddleFinishIcon = document.getElementById('paddlefinish' + i);
          paddleFinishIcon.setAttributeNS(
              'http://www.w3.org/1999/xlink',
              'xlink:href',
              skin.goalSuccess);
        }
      } else {
        finished++;
      }
    }
    if (playSound) {
      BlocklyApps.playAudio(
          (finished == Bounce.paddleFinishCount) ? 'win' : 'flag',
          {volume: 0.5});
    }
    return (finished == Bounce.paddleFinishCount);
  }
  else if (Bounce.ballFinish_) {
    for (i = 0; i < Bounce.ballCount; i++) {
      if (essentiallyEqual(Bounce.ballX[i], Bounce.ballFinish_.x, 0.5) &&
          essentiallyEqual(Bounce.ballY[i], Bounce.ballFinish_.y, 0.5)) {
        // Change the finish icon to goalSuccess.
        var ballFinishIcon = document.getElementById('ballfinish');
        ballFinishIcon.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'xlink:href',
            skin.goalSuccess);
        
        BlocklyApps.playAudio('win', {volume: 0.5});
        return true;
      }
    }
  }
  return false;
};

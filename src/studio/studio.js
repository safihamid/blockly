/**
 * Blockly App: Studio
 *
 * Copyright 2014 Code.org
 *
 */

'use strict';

var BlocklyApps = require('../base');
var commonMsg = require('../../locale/current/common');
var studioMsg = require('../../locale/current/studio');
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
var Studio = module.exports;

Studio.keyState = {};
Studio.btnState = {};

var ButtonState = {
  UP: 0,
  DOWN: 1
};

Studio.SpriteFlags = {
  MISSED_PADDLE: 1,
  IN_GOAL: 2,
  LAUNCHING: 4
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
var onSharePage;

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
Studio.scale = {
  'snapRadius': 1,
  'stepSpeed': 33
};

var twitterOptions = {
  text: studioMsg.shareStudioTwitter(),
  hashtag: "StudioCode"
};

var loadLevel = function() {
  // Load maps.
  Studio.map = level.map;
  Studio.timeoutFailureTick = level.timeoutFailureTick || Infinity;
  Studio.softButtons_ = level.softButtons || [];
  BlocklyApps.IDEAL_BLOCK_NUM = level.ideal || Infinity;
  BlocklyApps.REQUIRED_BLOCKS = level.requiredBlocks;

  // Override scalars.
  for (var key in level.scale) {
    Studio.scale[key] = level.scale[key];
  }

  // Measure maze dimensions and set sizes.
  // ROWS: Number of tiles down.
  Studio.ROWS = Studio.map.length;
  // COLS: Number of tiles across.
  Studio.COLS = Studio.map[0].length;
  // Initialize the wallMap.
  initWallMap();
  // Pixel height and width of each maze square (i.e. tile).
  Studio.SQUARE_SIZE = 50;
  Studio.PEGMAN_HEIGHT = skin.pegmanHeight;
  Studio.PEGMAN_WIDTH = skin.pegmanWidth;
  Studio.SPRITE_Y_OFFSET = skin.spriteYOffset;
  // Height and width of the goal and obstacles.
  Studio.MARKER_HEIGHT = 43;
  Studio.MARKER_WIDTH = 50;

  Studio.MAZE_WIDTH = Studio.SQUARE_SIZE * Studio.COLS;
  Studio.MAZE_HEIGHT = Studio.SQUARE_SIZE * Studio.ROWS;
  Studio.PATH_WIDTH = Studio.SQUARE_SIZE / 3;
};


var initWallMap = function() {
  Studio.wallMap = new Array(Studio.ROWS);
  for (var y = 0; y < Studio.ROWS; y++) {
    Studio.wallMap[y] = new Array(Studio.COLS);
  }
};

/**
 * PIDs of async tasks currently executing.
 */
Studio.pidList = [];

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

// Return a value of '0' if the specified square is not a wall, '1' for
// a wall, 'X' for out of bounds
var wallNormalize = function(x, y) {
  return ((Studio.map[y] === undefined) ||
          (Studio.map[y][x] === undefined)) ? 'X' :
            (Studio.map[y][x] & SquareType.WALL) ? '1' : '0';
};

// Return a value of '0' if the specified square is not a wall, '1' for
// a wall, 'X' for out of bounds
var goalNormalize = function(x, y) {
  return ((Studio.map[y] === undefined) ||
          (Studio.map[y][x] === undefined)) ? 'X' :
            (Studio.map[y][x] & SquareType.GOAL) ? '1' : '0';
};

var drawMap = function() {
  var svg = document.getElementById('svgStudio');
  var i, x, y, k, tile;

  // Adjust outer element size.
  svg.setAttribute('width', Studio.MAZE_WIDTH);
  svg.setAttribute('height', Studio.MAZE_HEIGHT);

  // Adjust visualization and belowVisualization width.
  var visualization = document.getElementById('visualization');
  visualization.style.width = Studio.MAZE_WIDTH + 'px';
  var belowVisualization = document.getElementById('belowVisualization');
  belowVisualization.style.width = Studio.MAZE_WIDTH + 'px';

  // Adjust button table width.
  var buttonTable = document.getElementById('gameButtons');
  buttonTable.style.width = Studio.MAZE_WIDTH + 'px';

  var hintBubble = document.getElementById('bubble');
  hintBubble.style.width = Studio.MAZE_WIDTH + 'px';

  if (skin.background) {
    tile = document.createElementNS(Blockly.SVG_NS, 'image');
    tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                        skin.background);
    tile.setAttribute('id', 'background');
    tile.setAttribute('height', Studio.MAZE_HEIGHT);
    tile.setAttribute('width', Studio.MAZE_WIDTH);
    tile.setAttribute('x', 0);
    tile.setAttribute('y', 0);
    svg.appendChild(tile);
  }

  if (skin.graph) {
    // Draw the grid lines.
    // The grid lines are offset so that the lines pass through the centre of
    // each square.  A half-pixel offset is also added to as standard SVG
    // practice to avoid blurriness.
    var offset = Studio.SQUARE_SIZE / 2 + 0.5;
    for (k = 0; k < Studio.ROWS; k++) {
      var h_line = document.createElementNS(Blockly.SVG_NS, 'line');
      h_line.setAttribute('y1', k * Studio.SQUARE_SIZE + offset);
      h_line.setAttribute('x2', Studio.MAZE_WIDTH);
      h_line.setAttribute('y2', k * Studio.SQUARE_SIZE + offset);
      h_line.setAttribute('stroke', skin.graph);
      h_line.setAttribute('stroke-width', 1);
      svg.appendChild(h_line);
    }
    for (k = 0; k < Studio.COLS; k++) {
      var v_line = document.createElementNS(Blockly.SVG_NS, 'line');
      v_line.setAttribute('x1', k * Studio.SQUARE_SIZE + offset);
      v_line.setAttribute('x2', k * Studio.SQUARE_SIZE + offset);
      v_line.setAttribute('y2', Studio.MAZE_HEIGHT);
      v_line.setAttribute('stroke', skin.graph);
      v_line.setAttribute('stroke-width', 1);
      svg.appendChild(v_line);
    }
  }

  // Draw the tiles making up the maze map.

  // Compute and draw the tile for each square.
  var tileId = 0;
  for (y = 0; y < Studio.ROWS; y++) {
    for (x = 0; x < Studio.COLS; x++) {
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
        tileClipRect.setAttribute('width', Studio.SQUARE_SIZE);
        tileClipRect.setAttribute('height', Studio.SQUARE_SIZE);

        tileClipRect.setAttribute('x', x * Studio.SQUARE_SIZE);
        tileClipRect.setAttribute('y', y * Studio.SQUARE_SIZE);

        tileClip.appendChild(tileClipRect);
        svg.appendChild(tileClip);
        // Tile sprite.
        var tileElement = document.createElementNS(Blockly.SVG_NS, 'image');
        tileElement.setAttribute('id', 'tileElement' + tileId);
        tileElement.setAttributeNS('http://www.w3.org/1999/xlink',
                                   'xlink:href',
                                   image);
        tileElement.setAttribute('height', Studio.SQUARE_SIZE * 4);
        tileElement.setAttribute('width', Studio.SQUARE_SIZE * 5);
        tileElement.setAttribute('clip-path',
                                 'url(#tileClipPath' + tileId + ')');
        tileElement.setAttribute('x', (x - left) * Studio.SQUARE_SIZE);
        tileElement.setAttribute('y', (y - top) * Studio.SQUARE_SIZE);
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

  if (Studio.spriteStart_) {
    for (i = 0; i < Studio.spriteCount; i++) {
      // Sprite clipPath element, whose (x, y) is reset by Studio.displaySprite
      var spriteClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
      spriteClip.setAttribute('id', 'spriteClipPath' + i);
      var spriteClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
      spriteClipRect.setAttribute('id', 'spriteClipRect' + i);
      spriteClipRect.setAttribute('width', Studio.PEGMAN_WIDTH);
      spriteClipRect.setAttribute('height', Studio.PEGMAN_HEIGHT);
      spriteClip.appendChild(spriteClipRect);
      svg.appendChild(spriteClip);
      
      // Add sprite.
      var spriteIcon = document.createElementNS(Blockly.SVG_NS, 'image');
      spriteIcon.setAttribute('id', 'sprite' + i);
      spriteIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                                skin.sprite);
      spriteIcon.setAttribute('height', Studio.PEGMAN_HEIGHT);
      spriteIcon.setAttribute('width', Studio.PEGMAN_WIDTH);
      spriteIcon.setAttribute('clip-path', 'url(#spriteClipPath' + i + ')');
      svg.appendChild(spriteIcon);
      
      dom.addMouseDownTouchEvent(spriteIcon,
                                 delegate(this,
                                          Studio.onSpriteClicked,
                                          i));
    }
  }
  
  if (Studio.paddleFinish_) {
    for (i = 0; i < Studio.paddleFinishCount; i++) {
      // Add finish markers.
      var paddleFinishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
      paddleFinishMarker.setAttribute('id', 'paddlefinish' + i);
      paddleFinishMarker.setAttributeNS('http://www.w3.org/1999/xlink',
                                        'xlink:href',
                                        skin.goal);
      paddleFinishMarker.setAttribute('height', Studio.MARKER_HEIGHT);
      paddleFinishMarker.setAttribute('width', Studio.MARKER_WIDTH);
      svg.appendChild(paddleFinishMarker);
    }
  }

  var score = document.createElementNS(Blockly.SVG_NS, 'text');
  score.setAttribute('id', 'score');
  score.setAttribute('class', 'studio-score');
  score.setAttribute('x', Studio.MAZE_WIDTH / 2);
  score.setAttribute('y', 60);
  score.appendChild(document.createTextNode('0'));
  score.setAttribute('visibility', 'hidden');
  svg.appendChild(score);

  // Add wall hitting animation
  if (skin.hittingWallAnimation) {
    var wallAnimationIcon = document.createElementNS(Blockly.SVG_NS, 'image');
    wallAnimationIcon.setAttribute('id', 'wallAnimation');
    wallAnimationIcon.setAttribute('height', Studio.SQUARE_SIZE);
    wallAnimationIcon.setAttribute('width', Studio.SQUARE_SIZE);
    wallAnimationIcon.setAttribute('visibility', 'hidden');
    svg.appendChild(wallAnimationIcon);
  }
};

Studio.calcDistance = function(xDist, yDist) {
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

Studio.onTick = function() {
  Studio.tickCount++;

  if (Studio.tickCount === 1) {
    try { Studio.whenGameStarts(BlocklyApps, api); } catch (e) { }
  }
  
  // Run key event handlers for any keys that are down:
  for (var key in Keycodes) {
    if (Studio.keyState[Keycodes[key]] &&
        Studio.keyState[Keycodes[key]] == "keydown") {
      switch (Keycodes[key]) {
        case Keycodes.LEFT:
          try { Studio.whenLeft(BlocklyApps, api); } catch (e) { }
          break;
        case Keycodes.UP:
          try { Studio.whenUp(BlocklyApps, api); } catch (e) { }
          break;
        case Keycodes.RIGHT:
          try { Studio.whenRight(BlocklyApps, api); } catch (e) { }
          break;
        case Keycodes.DOWN:
          try { Studio.whenDown(BlocklyApps, api); } catch (e) { }
          break;
      }
    }
  }
  
  for (var btn in ArrowIds) {
    if (Studio.btnState[ArrowIds[btn]] &&
        Studio.btnState[ArrowIds[btn]] == ButtonState.DOWN) {
      switch (ArrowIds[btn]) {
        case ArrowIds.LEFT:
          try { Studio.whenLeft(BlocklyApps, api); } catch (e) { }
          break;
        case ArrowIds.UP:
          try { Studio.whenUp(BlocklyApps, api); } catch (e) { }
          break;
        case ArrowIds.RIGHT:
          try { Studio.whenRight(BlocklyApps, api); } catch (e) { }
          break;
        case ArrowIds.DOWN:
          try { Studio.whenDown(BlocklyApps, api); } catch (e) { }
          break;
      }
    }
  }

  for (var i = 0; i < Studio.spriteCount; i++) {
    for (var j = 0; j < Studio.spriteCount; j++) {
      if (i == j) {
        continue;
      }
      if (essentiallyEqual(Studio.sprite[i].x,
                           Studio.sprite[j].x,
                           tiles.SPRITE_COLLIDE_DISTANCE) &&
          essentiallyEqual(Studio.sprite[i].y,
                           Studio.sprite[j].y,
                           tiles.SPRITE_COLLIDE_DISTANCE)) {
        if (0 == (Studio.sprite[i].collisionMask & Math.pow(2, j))) {
          Studio.sprite[i].collisionMask |= Math.pow(2, j);
          try {
            Studio.whenSpriteCollided[i][j](BlocklyApps, api);
          } catch (e) { }
        }
       } else {
          Studio.sprite[i].collisionMask &= ~(Math.pow(2, j));
        }
     }
    Studio.displaySprite(i);
  }
  
  if (checkFinished()) {
    Studio.onPuzzleComplete();
  }
};

Studio.onKey = function(e) {
  // Store the most recent event type per-key
  Studio.keyState[e.keyCode] = e.type;
  
  // If we are actively running our tick loop, suppress default event handling
  if (Studio.intervalId &&
      e.keyCode >= Keycodes.LEFT && e.keyCode <= Keycodes.DOWN) {
    e.preventDefault();
  }
};

Studio.onArrowButtonDown = function(e, idBtn) {
  // Store the most recent event type per-button
  Studio.btnState[idBtn] = ButtonState.DOWN;
  e.preventDefault();  // Stop normal events so we see mouseup later.
};

Studio.onSpriteClicked = function(e, sprite) {
  // If we are "running", call the event handler if registered.
  if (Studio.intervalId) {
    try { Studio.whenSpriteClicked[sprite](BlocklyApps, api); } catch (e) { }
  }
  e.preventDefault();  // Stop normal events.
};

Studio.onArrowButtonUp = function(e, idBtn) {
  // Store the most recent event type per-button
  Studio.btnState[idBtn] = ButtonState.UP;
};

Studio.onMouseUp = function(e) {
  // Reset btnState on mouse up
  Studio.btnState = {};
};

/**
 * Initialize Blockly and the Studio app.  Called on page load.
 */
Studio.init = function(config) {
  Studio.clearEventHandlersKillTickLoop();
  skin = config.skin;
  level = config.level;
  onSharePage = config.share;
  loadLevel();
  
  window.addEventListener("keydown", Studio.onKey, false);
  window.addEventListener("keyup", Studio.onKey, false);

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
                                      Studio.onArrowButtonUp,
                                      ArrowIds[btn]));
      dom.addMouseDownTouchEvent(document.getElementById(ArrowIds[btn]),
                                 delegate(this,
                                          Studio.onArrowButtonDown,
                                          ArrowIds[btn]));
    }
    document.addEventListener('mouseup', Studio.onMouseUp, false);
  
    /**
     * The richness of block colours, regardless of the hue.
     * MOOC blocks should be brighter (target audience is younger).
     * Must be in the range of 0 (inclusive) to 1 (exclusive).
     * Blockly's default is 0.45.
     */
    Blockly.HSV_SATURATION = 0.6;

    Blockly.SNAP_RADIUS *= Studio.scale.snapRadius;
    
    Studio.paddleFinishCount = 0;
    Studio.spriteCount = 0;
    Studio.sprite = [];
    
    // Locate the start and finish squares.
    for (var y = 0; y < Studio.ROWS; y++) {
      for (var x = 0; x < Studio.COLS; x++) {
        if (Studio.map[y][x] & SquareType.PADDLEFINISH) {
          if (0 === Studio.paddleFinishCount) {
            Studio.paddleFinish_ = [];
          }
          Studio.paddleFinish_[Studio.paddleFinishCount] = {x: x, y: y};
          Studio.paddleFinishCount++;
        } else if (Studio.map[y][x] & SquareType.SPRITESTART) {
          if (0 === Studio.spriteCount) {
            Studio.spriteStart_ = [];
          }
          Studio.sprite[Studio.spriteCount] = [];
          Studio.spriteStart_[Studio.spriteCount] = {x: x, y: y};
          Studio.spriteCount++;
        } else if (Studio.map[y][x] & SquareType.GOAL) {
          Studio.goalLocated_ = true;
        }
      }
    }
    
    drawMap();
  };

  config.getDisplayWidth = function() {
    var visualization = document.getElementById('visualization');
    return visualization.getBoundingClientRect().width;
  };

  // Block placement default (used as fallback in the share levels)
  config.blockArrangement = {
    'studio_whenGameStarts': { x: 20, y: 20},
    'studio_whenLeft': { x: 20, y: 110},
    'studio_whenRight': { x: 180, y: 110},
    'studio_whenPaddleCollided': { x: 20, y: 190},
    'studio_whenWallCollided': { x: 20, y: 270},
  };

  config.twitter = twitterOptions;

  // for this app, show make your own button if on share page
  config.makeYourOwn = config.share;

  config.makeString = studioMsg.makeYourOwn();
  config.makeUrl = "http://code.org/studio";
  config.makeImage = BlocklyApps.assetUrl('media/promo.png');

  config.enableShowCode = false;

  config.preventExtraTopLevelBlocks = true;

  BlocklyApps.init(config);

  if (!onSharePage) {
    var shareButton = document.getElementById('shareButton');
    dom.addClickTouchEvent(shareButton, Studio.onPuzzleComplete);
  }
};

/**
 * Clear the event handlers and stop the onTick timer.
 */
Studio.clearEventHandlersKillTickLoop = function() {
  Studio.whenWallCollided = null;
  Studio.whenPaddleCollided = null;
  Studio.whenDown = null;
  Studio.whenLeft = null;
  Studio.whenRight = null;
  Studio.whenUp = null;
  Studio.whenGameStarts = null;
  Studio.whenSpriteClicked = [];
  Studio.whenSpriteCollided = [];
  if (Studio.intervalId) {
    window.clearInterval(Studio.intervalId);
  }
  Studio.intervalId = 0;
  // Kill all tasks.
  for (var i = 0; i < Studio.pidList.length; i++) {
    window.clearTimeout(Studio.pidList[i]);
  }
  Studio.pidList = [];
};

/**
 * Reset the app to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
BlocklyApps.reset = function(first) {
  var i;
  Studio.clearEventHandlersKillTickLoop();

  // Soft buttons
  var softButtonCount = 0;
  for (i = 0; i < Studio.softButtons_.length; i++) {
    document.getElementById(Studio.softButtons_[i]).style.display = 'inline';
    softButtonCount++;
  }
  if (softButtonCount) {
    var softButtonsCell = document.getElementById('soft-buttons');
    softButtonsCell.className = 'soft-buttons-' + softButtonCount;
  }
  
  // Reset the score.
  Studio.playerScore = 0;
  Studio.opponentScore = 0;
  document.getElementById('score').setAttribute('visibility', 'hidden');

  // Reset configurable variables
  Studio.setBackground('hardcourt');

  // Move sprites into position.
  for (i = 0; i < Studio.spriteCount; i++) {
    Studio.sprite[i].x = Studio.spriteStart_[i].x;
    Studio.sprite[i].y = Studio.spriteStart_[i].y;
    Studio.sprite[i].speed = tiles.DEFAULT_SPRITE_SPEED;
    Studio.sprite[i].collisionMask = 0;

    Studio.setSprite(i, 'hardcourt');
    Studio.displaySprite(i);
  }

  var svg = document.getElementById('svgStudio');

  if (Studio.paddleFinish_) {
    for (i = 0; i < Studio.paddleFinishCount; i++) {
      // Mark each finish as incomplete.
      Studio.paddleFinish_[i].finished = false;

      // Move the finish icons into position.
      var paddleFinishIcon = document.getElementById('paddlefinish' + i);
      paddleFinishIcon.setAttribute(
          'x',
          Studio.SQUARE_SIZE * (Studio.paddleFinish_[i].x + 0.5) -
          paddleFinishIcon.getAttribute('width') / 2);
      paddleFinishIcon.setAttribute(
          'y',
          Studio.SQUARE_SIZE * (Studio.paddleFinish_[i].y + 0.9) -
          paddleFinishIcon.getAttribute('height'));
      paddleFinishIcon.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'xlink:href',
          skin.goal);
    }
  }

  // Reset the tiles
  var tileId = 0;
  for (var y = 0; y < Studio.ROWS; y++) {
    for (var x = 0; x < Studio.COLS; x++) {
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
  Studio.execute();
  
  if (level.freePlay && !onSharePage) {
    var shareCell = document.getElementById('share-cell');
    shareCell.className = 'share-cell-enabled';
  }
  if (Studio.goalLocated_) {
    document.getElementById('score').setAttribute('visibility', 'visible');
    Studio.displayScore();
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
  if (!Studio.waitingForReport) {
    BlocklyApps.displayFeedback({
      app: 'studio', //XXX
      skin: skin.id,
      feedbackType: Studio.testResults,
      response: Studio.response,
      level: level,
      showingSharing: level.freePlay,
      twitter: twitterOptions,
      appStrings: {
        reinfFeedbackMsg: studioMsg.reinfFeedbackMsg(),
        sharingText: studioMsg.shareGame()
      }
    });
  }
};

/**
 * Function to be called when the service report call is complete
 * @param {object} JSON response (if available)
 */
Studio.onReportComplete = function(response) {
  Studio.response = response;
  Studio.waitingForReport = false;
  // Disable the run button until onReportComplete is called.
  var runButton = document.getElementById('runButton');
  runButton.disabled = false;
  displayFeedback();
};

/**
 * Execute the user's code.  Heaven help us...
 */
Studio.execute = function() {
  BlocklyApps.log = [];
  BlocklyApps.ticks = 100; //TODO: Set higher for some levels
  var code;
  Studio.result = ResultType.UNSET;
  Studio.testResults = BlocklyApps.TestResults.NO_TESTS_RUN;
  Studio.waitingForReport = false;
  Studio.response = null;
  var i;

  // Check for empty top level blocks to warn user about bugs,
  // especially ones that lead to infinite loops.
  if (feedback.hasEmptyTopLevelBlocks()) {
    Studio.testResults = BlocklyApps.TestResults.EMPTY_BLOCK_FAIL;
    displayFeedback();
    return;
  }

  if (level.editCode) {
    var codeTextbox = document.getElementById('codeTextbox');
    code = dom.getText(codeTextbox);
    // Insert aliases from level codeBlocks into code
    if (level.codeFunctions) {
      for (i = 0; i < level.codeFunctions.length; i++) {
        var codeFunction = level.codeFunctions[i];
        if (codeFunction.alias) {
          code = codeFunction.func +
              " = function() { " + codeFunction.alias + " };" + code;
        }
      }
    }
  }
  
  code = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'studio_whenWallCollided');
  var whenWallCollidedFunc = codegen.functionFromCode(
                                     code, {
                                      BlocklyApps: BlocklyApps,
                                      Studio: api } );

  code = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'studio_whenPaddleCollided');
  var whenPaddleCollidedFunc = codegen.functionFromCode(
                                     code, {
                                      BlocklyApps: BlocklyApps,
                                      Studio: api } );

  code = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'studio_whenLeft');
  var whenLeftFunc = codegen.functionFromCode(
                                     code, {
                                      BlocklyApps: BlocklyApps,
                                      Studio: api } );

  code = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'studio_whenRight');
  var whenRightFunc = codegen.functionFromCode(
                                     code, {
                                      BlocklyApps: BlocklyApps,
                                      Studio: api } );

  code = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'studio_whenUp');
  var whenUpFunc = codegen.functionFromCode(
                                     code, {
                                      BlocklyApps: BlocklyApps,
                                      Studio: api } );

  code = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'studio_whenDown');
  var whenDownFunc = codegen.functionFromCode(
                                     code, {
                                      BlocklyApps: BlocklyApps,
                                      Studio: api } );

  code = Blockly.Generator.workspaceToCode(
                                    'JavaScript',
                                    'studio_whenGameStarts');
  var whenGameStartsFunc = codegen.functionFromCode(
                                     code, {
                                      BlocklyApps: BlocklyApps,
                                      Studio: api } );

  var blocks = Blockly.mainWorkspace.getTopBlocks(true);

  var whenSpriteClickedFunc = [];
  for (i = 0; i < Studio.spriteCount; i++) {
    for (var x = 0; blocks[x]; x++) {
      var block = blocks[x];
      if (block.type == 'studio_whenSpriteClicked' &&
          i == parseInt(block.getTitleValue('SPRITE'), 10)) {
        code = Blockly.Generator.blocksToCode('JavaScript', [ block ]);
        whenSpriteClickedFunc[i] = codegen.functionFromCode(
                                           code, {
                                            BlocklyApps: BlocklyApps,
                                            Studio: api } );
      }
    }
  }

  var whenSpriteCollidedFunc = [];
  for (i = 0; i < Studio.spriteCount; i++) {
    whenSpriteCollidedFunc[i] = [];
    for (var j = 0; j < Studio.spriteCount; j++) {
      if (i == j) {
        continue;
      }
      for (var x = 0; blocks[x]; x++) {
        var block = blocks[x];
        if (block.type == 'studio_whenSpriteCollided' &&
            i == parseInt(block.getTitleValue('SPRITE1'), 10) &&
            j == parseInt(block.getTitleValue('SPRITE2'), 10)) {
          code = Blockly.Generator.blocksToCode('JavaScript', [ block ]);
          whenSpriteCollidedFunc[i][j] = codegen.functionFromCode(
                                             code, {
                                              BlocklyApps: BlocklyApps,
                                              Studio: api } );
        }
      }
    }
  }
  
  BlocklyApps.playAudio('start', {volume: 0.5});

  BlocklyApps.reset(false);
  
  // Set event handlers and start the onTick timer
  Studio.whenWallCollided = whenWallCollidedFunc;
  Studio.whenPaddleCollided = whenPaddleCollidedFunc;
  Studio.whenLeft = whenLeftFunc;
  Studio.whenRight = whenRightFunc;
  Studio.whenUp = whenUpFunc;
  Studio.whenDown = whenDownFunc;
  Studio.whenGameStarts = whenGameStartsFunc;
  Studio.whenSpriteClicked = whenSpriteClickedFunc;
  Studio.whenSpriteCollided = whenSpriteCollidedFunc;
  Studio.tickCount = 0;
  Studio.intervalId = window.setInterval(Studio.onTick, Studio.scale.stepSpeed);
};

Studio.onPuzzleComplete = function() {
  if (level.freePlay) {
    Studio.result = ResultType.SUCCESS;
  }

  // Stop everything on screen
  Studio.clearEventHandlersKillTickLoop();

  // If we know they succeeded, mark levelComplete true
  // Note that we have not yet animated the succesful run
  BlocklyApps.levelComplete = (Studio.result == ResultType.SUCCESS);
  
  // If the current level is a free play, always return the free play
  // result type
  if (level.freePlay) {
    Studio.testResults = BlocklyApps.TestResults.FREE_PLAY;
  } else {
    Studio.testResults = BlocklyApps.getTestResults();
  }

  if (Studio.testResults >= BlocklyApps.TestResults.FREE_PLAY) {
    BlocklyApps.playAudio('win', {volume : 0.5});
  } else {
    BlocklyApps.playAudio('failure', {volume : 0.5});
  }
  
  if (level.editCode) {
    Studio.testResults = BlocklyApps.levelComplete ?
      BlocklyApps.TestResults.ALL_PASS :
      BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL;
  }
  
  if (level.failForOther1Star && !BlocklyApps.levelComplete) {
    Studio.testResults = BlocklyApps.TestResults.OTHER_1_STAR_FAIL;
  }
  
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var textBlocks = Blockly.Xml.domToText(xml);
  
  Studio.waitingForReport = true;
  
  // Report result to server.
  BlocklyApps.report({
                     app: 'studio',
                     level: level.id,
                     result: Studio.result === ResultType.SUCCESS,
                     testResult: Studio.testResults,
                     program: encodeURIComponent(textBlocks),
                     onComplete: Studio.onReportComplete
                     });
};

/**
 * Set the tiles to be transparent gradually.
 */
Studio.setTileTransparent = function() {
  var tileId = 0;
  for (var y = 0; y < Studio.ROWS; y++) {
    for (var x = 0; x < Studio.COLS; x++) {
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

Studio.displaySprite = function(i) {
  var xCoord = Studio.sprite[i].x * Studio.SQUARE_SIZE;
  var yCoord = Studio.sprite[i].y * Studio.SQUARE_SIZE + Studio.SPRITE_Y_OFFSET;

  var spriteIcon = document.getElementById('sprite' + i);
  spriteIcon.setAttribute('x', xCoord);
  spriteIcon.setAttribute('y', yCoord);
  
  var spriteClipRect = document.getElementById('spriteClipRect' + i);
  spriteClipRect.setAttribute('x', xCoord);
  spriteClipRect.setAttribute('y', yCoord);
};

Studio.displayScore = function() {
  var score = document.getElementById('score');
  score.textContent = studioMsg.scoreText({
    playerScore: Studio.playerScore,
    opponentScore: Studio.opponentScore
  });
};

var skinTheme = function (value) {
  if (value === 'hardcourt') {
    return skin;
  }
  return skin[value];
};

Studio.setBackground = function (value) {
  var element = document.getElementById('background');
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
    skinTheme(value).background);

  // Recompute all of the tiles to determine if they are walls, goals, or empty
  // TODO: do this once during init and cache the result
  var tileId = 0;
  for (var y = 0; y < Studio.ROWS; y++) {
    for (var x = 0; x < Studio.COLS; x++) {
      var empty = false;
      var image;
      // Compute the tile index.
      var tile = wallNormalize(x, y) +
          wallNormalize(x, y - 1) +  // North.
          wallNormalize(x + 1, y) +  // East.
          wallNormalize(x, y + 1) +  // South.
          wallNormalize(x - 1, y);   // West.

      // Draw the tile.
      if (WALL_TILE_SHAPES[tile]) {
        image = skinTheme(value).tiles;
      }
      else {
        // Compute the tile index.
        tile = goalNormalize(x, y) +
            goalNormalize(x, y - 1) +  // North.
            goalNormalize(x + 1, y) +  // East.
            goalNormalize(x, y + 1) +  // South.
            goalNormalize(x - 1, y);   // West.

        if (!GOAL_TILE_SHAPES[tile]) {
          empty = true;
        }
        image = skinTheme(value).goalTiles;
      }
      if (!empty) {
        element = document.getElementById('tileElement' + tileId);
        element.setAttributeNS(
            'http://www.w3.org/1999/xlink', 'xlink:href', image);
      }
      tileId++;
    }
  }
};

Studio.setSprite = function (index, value) {
  var element = document.getElementById('sprite' + index);
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
    skinTheme(value).sprite);
};

Studio.timedOut = function() {
  return Studio.tickCount > Studio.timeoutFailureTick;
};

Studio.allFinishesComplete = function() {
  var i;
  if (Studio.paddleFinish_) {
    var finished, playSound;
    for (i = 0, finished = 0; i < Studio.paddleFinishCount; i++) {
      if (!Studio.paddleFinish_[i].finished) {
        if (essentiallyEqual(Studio.sprite[0].x,
                             Studio.paddleFinish_[i].x,
                             tiles.FINISH_COLLIDE_DISTANCE) &&
            essentiallyEqual(Studio.sprite[0].y,
                             Studio.paddleFinish_[i].y,
                             tiles.FINISH_COLLIDE_DISTANCE)) {
          Studio.paddleFinish_[i].finished = true;
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
    if (playSound && finished != Studio.paddleFinishCount) {
      // Play a sound unless we've hit the last flag
      BlocklyApps.playAudio('flag', {volume: 0.5});
    }
    return (finished == Studio.paddleFinishCount);
  }
  return false;
};

var checkFinished = function () {
  // if we have a succcess condition and have accomplished it, we're done and successful
  if (level.goal && level.goal.successCondition && level.goal.successCondition()) {
    Studio.result = ResultType.SUCCESS;
    return true;
  }
  
  // if we have a failure condition, and it's been reached, we're done and failed
  if (level.goal && level.goal.failureCondition && level.goal.failureCondition()) {
    Studio.result = ResultType.FAILURE;
    return true;
  }

  if (Studio.allFinishesComplete()) {
    Studio.result = ResultType.SUCCESS;
    return true;
  }
  
  if (Studio.timedOut()) {
    Studio.result = ResultType.FAILURE;
    return true;
  }
  
  return false;
};

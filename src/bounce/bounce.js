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
  'stepSpeed': 5
};

var loadLevel = function() {
  // Load maps.
  Bounce.map = level.map;
  BlocklyApps.IDEAL_BLOCK_NUM = level.ideal || Infinity;
  Bounce.initialDirtMap = level.initialDirt;
  Bounce.finalDirtMap = level.finalDirt;
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
  // Height and width of the dirt piles/holes.
  Bounce.DIRT_HEIGHT = 50;
  Bounce.DIRT_WIDTH = 50;
  // The number line is [-inf, min, min+1, ... no zero ..., max-1, max, +inf]
  Bounce.DIRT_MAX = 10;
  Bounce.DIRT_COUNT = Bounce.DIRT_MAX * 2 + 2;

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
 * PIDs of animation tasks currently executing.
 */
Bounce.pidList = [];

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

        // For the first 3 levels in maze, only show the null0 image.
        if (level.id == '2_1' || level.id == '2_2' || level.id == '2_3') {
          Bounce.wallMap[y][x] = 0;
          tile = 'null0';
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

  // Pegman's clipPath element, whose (x, y) is reset by Bounce.displayPegman
  var pegmanClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
  pegmanClip.setAttribute('id', 'pegmanClipPath');
  var clipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
  clipRect.setAttribute('id', 'clipRect');
  clipRect.setAttribute('width', Bounce.PEGMAN_WIDTH);
  clipRect.setAttribute('height', Bounce.PEGMAN_HEIGHT);
  pegmanClip.appendChild(clipRect);
  svg.appendChild(pegmanClip);
  
  // Add pegman.
  var pegmanIcon = document.createElementNS(Blockly.SVG_NS, 'image');
  pegmanIcon.setAttribute('id', 'pegman');
  pegmanIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                            skin.avatar);
  pegmanIcon.setAttribute('height', Bounce.PEGMAN_HEIGHT);
  pegmanIcon.setAttribute('width', Bounce.PEGMAN_WIDTH * 21); // 49 * 21 = 1029
  pegmanIcon.setAttribute('clip-path', 'url(#pegmanClipPath)');
  svg.appendChild(pegmanIcon);

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

  // Add idle pegman.
  if (skin.idlePegmanAnimation) {
    createPegmanAnimation({
      idStr: 'idle',
      pegmanImage: skin.idlePegmanAnimation,
      row: Bounce.start_.y,
      col: Bounce.start_.x,
      direction: Bounce.startDirection
    });
  }

  // Add the hidden dazed pegman when hitting the wall.
  if (skin.wallPegmanAnimation) {
    createPegmanAnimation({
      idStr: 'wall',
      pegmanImage: skin.wallPegmanAnimation
    });
  }

  // Add the hidden moving pegman animation.
  if (skin.movePegmanAnimation) {
    createPegmanAnimation({
      idStr: 'move',
      pegmanImage: skin.movePegmanAnimation,
      numColPegman: 4,
      numRowPegman: 9
    });
  }
  
  window.setInterval(Bounce.onTick, 33);

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
    console.log("collission");
    try {
      Bounce.whenWallCollided(BlocklyApps, api);
    }
    catch (e) {
    }
  }
  
  Bounce.displayBall(Bounce.ballX, Bounce.ballY, 0);
}

var resetDirt = function() {
  // Init the dirt so that all places are empty
  Bounce.dirt_ = new Array(Bounce.ROWS);
  // Locate the dirt in dirt_map
  for (var y = 0; y < Bounce.ROWS; y++) {
    if (Bounce.initialDirtMap) {
      Bounce.dirt_[y] = Bounce.initialDirtMap[y].slice(0);
    } else {
      Bounce.dirt_[y] = new Array(Bounce.COLS);
    }
  }
};

/**
 * Initialize Blockly and the maze.  Called on page load.
 */
Bounce.init = function(config) {

  skin = config.skin;
  level = config.level;
  loadLevel();

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
    if (skin.dirtSound) {
      Blockly.loadAudio_(skin.fillSound, 'fill');
      Blockly.loadAudio_(skin.digSound, 'dig');
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
        }
      }
    }

    resetDirt();

    drawMap();
  };

  config.getDisplayWidth = function() {
    var visualization = document.getElementById('visualization');
    return visualization.getBoundingClientRect().width;
  };

  BlocklyApps.init(config);
};

var dirtPositionToIndex = function(row, col) {
  return Bounce.COLS * row + col;
};

var createDirt = function(row, col) {
  var pegmanIcon = document.getElementById('pegman');
  var svg = document.getElementById('svgBounce');
  var index = dirtPositionToIndex(row, col);
  // Create clip path.
  var clip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
  clip.setAttribute('id', 'dirtClip' + index);
  var rect = document.createElementNS(Blockly.SVG_NS, 'rect');
  rect.setAttribute('x', col * Bounce.DIRT_WIDTH);
  rect.setAttribute('y', row * Bounce.DIRT_HEIGHT);
  rect.setAttribute('width', Bounce.DIRT_WIDTH);
  rect.setAttribute('height', Bounce.DIRT_HEIGHT);
  clip.appendChild(rect);
  svg.insertBefore(clip, pegmanIcon);
  // Create image.
  var img = document.createElementNS(Blockly.SVG_NS, 'image');
  img.setAttributeNS(
      'http://www.w3.org/1999/xlink', 'xlink:href', skin.dirt);
  img.setAttribute('height', Bounce.DIRT_HEIGHT);
  img.setAttribute('width', Bounce.DIRT_WIDTH * Bounce.DIRT_COUNT);
  img.setAttribute('clip-path', 'url(#dirtClip' + index + ')');
  img.setAttribute('id', 'dirt' + index);
  svg.insertBefore(img, pegmanIcon);
};

/**
 * Set the image based on the amount of dirt at the location.
 * @param {number} row Row index.
 * @param {number} col Column index.
 */
var updateDirt = function(row, col) {
  // Calculate spritesheet index.
  var n = Bounce.dirt_[row][col];
  var spriteIndex;
  if (n < -Bounce.DIRT_MAX) {
    spriteIndex = 0;
  } else if (n < 0) {
    spriteIndex = Bounce.DIRT_MAX + n + 1;
  } else if (n > Bounce.DIRT_MAX) {
    spriteIndex = Bounce.DIRT_COUNT - 1;
  } else if (n > 0) {
    spriteIndex = Bounce.DIRT_MAX + n;
  } else {
    throw new Error('Expected non-zero dirt.');
  }
  // Update dirt icon & clip path.
  var dirtIndex = dirtPositionToIndex(row, col);
  var img = document.getElementById('dirt' + dirtIndex);
  var x = Bounce.SQUARE_SIZE * (col - spriteIndex + 0.5) - Bounce.DIRT_HEIGHT / 2;
  var y = Bounce.SQUARE_SIZE * (row + 0.5) - Bounce.DIRT_WIDTH / 2;
  img.setAttribute('x', x);
  img.setAttribute('y', y);
};

var removeDirt = function(row, col) {
  var svg = document.getElementById('svgBounce');
  var index = dirtPositionToIndex(row, col);
  var img = document.getElementById('dirt' + index);
  if (img) {
    svg.removeChild(img);
  }
  var clip = document.getElementById('dirtClip' + index);
  if (clip) {
    svg.removeChild(clip);
  }
};

/**
 * Calculate the y coordinates for pegman sprite.
 */
var getPegmanYCoordinate = function(options) {
  var y = Bounce.SQUARE_SIZE * (options.mazeRow + 0.5) - Bounce.PEGMAN_HEIGHT / 2 -
      (options.pegmanRow || 0) * Bounce.PEGMAN_HEIGHT + Bounce.PEGMAN_Y_OFFSET - 8;
  return Math.floor(y);
};

/**
  * Create sprite assets for pegman.
  * @param options Specify different features of the pegman animation.
  * idStr required identifier for the pegman.
  * pegmanImage required which image to use for the animation.
  * col which column the pegman is at.
  * row which row the pegman is at.
  * direction which direction the pegman is facing at.
  * rowIdx which column of the pegman the animation needs, default is 0.
  * numColPegman number of the pegman in each row, default is 4.
  * numRowPegman number of the pegman in each column, default is 1.
  */
var createPegmanAnimation = function(options) {
  var svg = document.getElementById('svgBounce');
  // Create clip path.
  var clip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
  clip.setAttribute('id', options.idStr + 'PegmanClip');
  var rect = document.createElementNS(Blockly.SVG_NS, 'rect');
  rect.setAttribute('id', options.idStr + 'PegmanClipRect');
  if (options.col !== undefined) {
    rect.setAttribute('x', options.col * Bounce.SQUARE_SIZE + 1);
  }
  if (options.row !== undefined) {
    rect.setAttribute('y', getPegmanYCoordinate({
      mazeRow : options.row
    }));
  }
  rect.setAttribute('width', Bounce.PEGMAN_WIDTH);
  rect.setAttribute('height', Bounce.PEGMAN_HEIGHT);
  clip.appendChild(rect);
  svg.appendChild(clip);
  // Create image.
  // Add a random number to force it to reload everytime.
  var imgSrc = options.pegmanImage + '&time=' + (new Date()).getTime();
  var img = document.createElementNS(Blockly.SVG_NS, 'image');
  img.setAttributeNS(
      'http://www.w3.org/1999/xlink', 'xlink:href', imgSrc);
  img.setAttribute('height', Bounce.PEGMAN_HEIGHT * (options.numRowPegman || 1));
  img.setAttribute('width', Bounce.PEGMAN_WIDTH * (options.numColPegman || 4));
  img.setAttribute('clip-path', 'url(#' + options.idStr + 'PegmanClip)');
  img.setAttribute('id', options.idStr + 'Pegman');
  svg.appendChild(img);
  // Update pegman icon & clip path.
  if (options.col !== undefined && options.direction !== undefined) {
    var x = Bounce.SQUARE_SIZE * options.col -
        options.direction * Bounce.PEGMAN_WIDTH + 1;
    img.setAttribute('x', x);
  }
  if (options.row !== undefined) {
    var y = getPegmanYCoordinate({
      mazeRow : options.row,
      pegmanRow : options.rowIdx
    });
    img.setAttribute('y', y);
  }
};

/**
  * Update sprite assets for pegman.
  * @param options Specify different features of the pegman animation.
  * idStr required identifier for the pegman.
  * col required which column the pegman is at.
  * row required which row the pegman is at.
  * direction required which direction the pegman is facing at.
  * rowIdx which column of the pegman the animation needs, default is 0.
  */
var updatePegmanAnimation = function(options) {
  var rect = document.getElementById(options.idStr + 'PegmanClipRect');
  rect.setAttribute('x', options.col * Bounce.SQUARE_SIZE + 1);
  rect.setAttribute('y', getPegmanYCoordinate({
    mazeRow : options.row
  }));
  var img = document.getElementById(options.idStr + 'Pegman');
  var x = Bounce.SQUARE_SIZE * options.col -
      options.direction * Bounce.PEGMAN_WIDTH + 1;
  img.setAttribute('x', x);
  var y = getPegmanYCoordinate({
    mazeRow : options.row,
    pegmanRow : options.rowIdx
  });
  img.setAttribute('y', y);
  img.setAttribute('visibility', 'visible');
};

/**
 * Reset the maze to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
BlocklyApps.reset = function(first) {
  var i;
  // Kill all tasks.
  for (i = 0; i < Bounce.pidList.length; i++) {
    window.clearTimeout(Bounce.pidList[i]);
  }
  Bounce.pidList = [];

  // Move Pegman into position.
  Bounce.pegmanX = Bounce.start_.x;
  Bounce.pegmanY = Bounce.start_.y;

  // Move Ball into position.
  Bounce.ballX = Bounce.ballStart_.x;
  Bounce.ballY = Bounce.ballStart_.y;
  
  if (first) {
    Bounce.pegmanD = Bounce.startDirection + 1;
    Bounce.scheduleFinish(false);
    Bounce.pidList.push(window.setTimeout(function() {
      stepSpeed = 100;
      Bounce.schedule([Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4],
                    [Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4 - 4]);
      Bounce.pegmanD++;
    }, stepSpeed * 5));
  } else {
    Bounce.pegmanD = Bounce.startDirection;
    Bounce.displayPegman(Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4);
  }
  
  Bounce.ballD = AngleDirection.SOUTHWEST;
  Bounce.displayBall(Bounce.ballX, Bounce.ballY, 0);

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

  // Make 'look' icon invisible and promote to top.
  var lookIcon = document.getElementById('look');
  lookIcon.style.display = 'none';
  lookIcon.parentNode.appendChild(lookIcon);
  var paths = lookIcon.getElementsByTagName('path');
  for (i = 0; i < paths.length; i++) {
    var path = paths[i];
    path.setAttribute('stroke', skin.look);
  }

  // Reset pegman's visibility.
  var pegmanIcon = document.getElementById('pegman');
  if (skin.idlePegmanAnimation) {
    pegmanIcon.setAttribute('visibility', 'hidden');
    var idlePegmanIcon = document.getElementById('idlePegman');
    idlePegmanIcon.setAttribute('visibility', 'visible');
  } else {
    pegmanIcon.setAttribute('visibility', 'visible');
  }

  if (skin.wallPegmanAnimation) {
    var wallPegmanIcon = document.getElementById('wallPegman');
    wallPegmanIcon.setAttribute('visibility', 'hidden');
  }

  if (skin.movePegmanAnimation) {
    var movePegmanIcon = document.getElementById('movePegman');
    movePegmanIcon.setAttribute('visibility', 'hidden');
  }

  // Move the init dirt marker icons into position.
  resetDirt();
  for (var row = 0; row < Bounce.ROWS; row++) {
    for (var col = 0; col < Bounce.COLS; col++) {
      removeDirt(row, col);
      if (getTile(Bounce.dirt_, col, row) !== 0 &&
          getTile(Bounce.dirt_, col, row) !== undefined) {
        createDirt(row, col);
        updateDirt(row, col);
      }
    }
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
  if (!Bounce.waitingForReport && !Bounce.waitingForAnimate) {
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
  Bounce.waitingForAnimate = false;
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
  Bounce.whenWallCollided = codegen.functionFromCode(
                                     codeWallCollided, {
                                      BlocklyApps: BlocklyApps,
                                      Bounce: api } );

  // Try running the user's code.  There are four possible outcomes:
  // 1. If pegman reaches the finish [SUCCESS], true is thrown.
  // 2. If the program is terminated due to running too long [TIMEOUT],
  //    false is thrown.
  // 3. If another error occurs [ERROR], that error is thrown.
  // 4. If the program ended normally but without solving the maze [FAILURE],
  //    no error or exception is thrown.
  // The animation should be fast if execution was successful, slow otherwise
  // to help the user see the mistake.
  BlocklyApps.playAudio('start', {volume: 0.5});
  try {
    codegen.evalWith(code, {
      BlocklyApps: BlocklyApps,
      Bounce: api
    });
    Bounce.checkSuccess();
    // If did not finish, shedule a failure.
    BlocklyApps.log.push(['finish', null]);
    Bounce.result = ResultType.FAILURE;
    stepSpeed = 150;
  } catch (e) {
    // A boolean is thrown for normal termination. XXX Except when it isn't...
    // Abnormal termination is a user error.
    if (e === Infinity) {
      Bounce.result = ResultType.TIMEOUT;
      stepSpeed = 0;  // Go infinitely fast so program ends quickly.
    } else if (e === true) {
      Bounce.result = ResultType.SUCCESS;
      stepSpeed = 100;
    } else if (e === false) {
      Bounce.result = ResultType.ERROR;
      stepSpeed = 150;
    } else {
      // Syntax error, can't happen.
      Bounce.result = ResultType.ERROR;
      window.alert(e);
      return;
    }
  }

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
  Bounce.waitingForAnimate = true;

  // Report result to server.
  BlocklyApps.report({
    app: 'bounce',
    level: level.id,
    result: Bounce.result === ResultType.SUCCESS,
    testResult: Bounce.testResults,
    program: encodeURIComponent(textBlocks),
    onComplete: Bounce.onReportComplete
  });

  // BlocklyApps.log now contains a transcript of all the user's actions.
  // Reset the maze and animate the transcript.
  BlocklyApps.reset(false);


  // Removing the idle animation and replace with pegman sprite
  if (skin.idlePegmanAnimation) {
    var pegmanIcon = document.getElementById('pegman');
    var idlePegmanIcon = document.getElementById('idlePegman');
    idlePegmanIcon.setAttribute('visibility', 'hidden');
    pegmanIcon.setAttribute('visibility', 'visible');
  }

  // Speeding up specific levels
  var scaledStepSpeed =
      stepSpeed * Bounce.scale.stepSpeed * skin.movePegmanAnimationSpeedScale;
  Bounce.pidList.push(window.setTimeout(Bounce.animate,scaledStepSpeed));
};

/**
 * Iterate through the recorded path and animate pegman's actions.
 */
Bounce.animate = function() {
  // All tasks should be complete now.  Clean up the PID list.
  Bounce.pidList = [];

  var action = BlocklyApps.log.shift();
  if (!action) {
    BlocklyApps.highlight(null);
    if (Bounce.result == ResultType.TIMEOUT) {
      Bounce.waitingForAnimate = false;
      displayFeedback();
    } else {
      window.setTimeout(function() {
        Bounce.waitingForAnimate = false;
        displayFeedback();
      }, 1000);
    }
    return;
  }

  BlocklyApps.highlight(action[1]);

  switch (action[0]) {
    case 'north':
      Bounce.schedule([Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4],
                    [Bounce.pegmanX, Bounce.pegmanY - 1, Bounce.pegmanD * 4]);
      Bounce.pegmanY--;
      break;
    case 'east':
      Bounce.schedule([Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4],
                    [Bounce.pegmanX + 1, Bounce.pegmanY, Bounce.pegmanD * 4]);
      Bounce.pegmanX++;
      break;
    case 'south':
      Bounce.schedule([Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4],
                    [Bounce.pegmanX, Bounce.pegmanY + 1, Bounce.pegmanD * 4]);
      Bounce.pegmanY++;
      break;
    case 'west':
      Bounce.schedule([Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4],
                    [Bounce.pegmanX - 1, Bounce.pegmanY, Bounce.pegmanD * 4]);
      Bounce.pegmanX--;
      break;
    case 'look_north':
      Bounce.scheduleLook(Direction.NORTH);
      break;
    case 'look_east':
      Bounce.scheduleLook(Direction.EAST);
      break;
    case 'look_south':
      Bounce.scheduleLook(Direction.SOUTH);
      break;
    case 'look_west':
      Bounce.scheduleLook(Direction.WEST);
      break;
    case 'fail_forward':
      Bounce.scheduleFail(true);
      break;
    case 'fail_backward':
      Bounce.scheduleFail(false);
      break;
    case 'left':
      Bounce.schedule([Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4],
                    [Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4 - 4]);
      Bounce.pegmanD = Bounce.constrainDirection4(Bounce.pegmanD - 1);
      break;
    case 'right':
      Bounce.schedule([Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4],
                    [Bounce.pegmanX, Bounce.pegmanY, Bounce.pegmanD * 4 + 4]);
      Bounce.pegmanD = Bounce.constrainDirection4(Bounce.pegmanD + 1);
      break;
    case 'finish':
      // Only schedule victory animation for certain conditions:
      switch (Bounce.testResults) {
        case BlocklyApps.TestResults.FREE_PLAY:
        case BlocklyApps.TestResults.TOO_MANY_BLOCKS_FAIL:
        case BlocklyApps.TestResults.ALL_PASS:
          Bounce.scheduleFinish(true);
          break;
        default:
          Bounce.pidList.push(window.setTimeout(function() {
            BlocklyApps.playAudio('failure', {volume: 0.5});
          }, stepSpeed));
          break;
      }
      break;
    case 'putdown':
      Bounce.scheduleFill();
      break;
    case 'pickup':
      Bounce.scheduleDig();
      break;
    case 'tile_transparent':
      Bounce.setTileTransparent();
      break;
    default:
      // action[0] is null if generated by BlocklyApps.checkTimeout().
      break;
  }

  // Speeding up specific levels
  var scaledStepSpeed =
      stepSpeed * Bounce.scale.stepSpeed * skin.movePegmanAnimationSpeedScale;
  Bounce.pidList.push(window.setTimeout(Bounce.animate, scaledStepSpeed));
};

/**
 * Schedule the animations for a move or turn.
 * @param {!Array.<number>} startPos X, Y and direction starting points.
 * @param {!Array.<number>} endPos X, Y and direction ending points.
 */
Bounce.schedule = function(startPos, endPos) {
  function updateMoveFrame(frameIdx) {
    Bounce.pidList.push(window.setTimeout(function() {
      pegmanIcon.setAttribute('visibility', 'hidden');
      updatePegmanAnimation({
        idStr: 'move',
        col: startPos[0] + deltaX * frameIdx,
        row: startPos[1] + deltaY * frameIdx,
        direction: direction,
        rowIdx: frameIdx
      });
    }, stepSpeed * 6 / numFrames * frameIdx));
  }

  var deltaX, deltaY, deltaDirection, numFrames;
  if (skin.movePegmanAnimation && endPos[2] - startPos[2] === 0) {
    // If move animation of pegman is set, and this is not a turn.
    // Show the animation.
    var pegmanIcon = document.getElementById('pegman');
    var movePegmanIcon = document.getElementById('movePegman');

    numFrames = skin.movePegmanAnimationFrameNumber;
    deltaX = (endPos[0] - startPos[0]) / numFrames;
    deltaY = (endPos[1] - startPos[1]) / numFrames;
    deltaDirection = (endPos[2] - startPos[2]) / numFrames;
    var direction = startPos[2] / 4;
    var frameIdx;

    for (frameIdx = 0; frameIdx < numFrames; frameIdx++) {
      updateMoveFrame(frameIdx);
    }

    // Hide movePegman and set pegman to the end position.
    Bounce.pidList.push(window.setTimeout(function() {
      movePegmanIcon.setAttribute('visibility', 'hidden');
      pegmanIcon.setAttribute('visibility', 'visible');
      Bounce.displayPegman(endPos[0], endPos[1],
                         Bounce.constrainDirection16(endPos[2]));
    }, stepSpeed * 6 / numFrames * frameIdx));
  } else {
    numFrames = 4;
    deltaX = (endPos[0] - startPos[0]) / numFrames;
    deltaY = (endPos[1] - startPos[1]) / numFrames;
    deltaDirection = (endPos[2] - startPos[2]) / numFrames;
    Bounce.displayPegman(startPos[0] + deltaX,
                       startPos[1] + deltaY,
                       Bounce.constrainDirection16(startPos[2] + deltaDirection));
    Bounce.pidList.push(window.setTimeout(function() {
        Bounce.displayPegman(
            startPos[0] + deltaX * 2,
            startPos[1] + deltaY * 2,
            Bounce.constrainDirection16(startPos[2] + deltaDirection * 2));
    }, stepSpeed));
    Bounce.pidList.push(window.setTimeout(function() {
        Bounce.displayPegman(
            startPos[0] + deltaX * 3,
            startPos[1] + deltaY * 3,
            Bounce.constrainDirection16(startPos[2] + deltaDirection * 3));
    }, stepSpeed * 2));
      Bounce.pidList.push(window.setTimeout(function() {
          Bounce.displayPegman(endPos[0], endPos[1],
                             Bounce.constrainDirection16(endPos[2]));
    }, stepSpeed * 3));
  }

  if (skin.approachingGoalAnimation) {
    var finishIcon = document.getElementById('finish');
    // If pegman is close to the goal
    // Replace the goal file with approachingGoalAnimation
    if (Bounce.finish_ && Math.abs(endPos[0] - Bounce.finish_.x) <= 1 &&
        Math.abs(endPos[1] - Bounce.finish_.y) <= 1) {
      finishIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                                skin.approachingGoalAnimation);
    } else {
      finishIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                                skin.goal);
    }
  }
};

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
 * Schedule the animations and sounds for a failed move.
 * @param {boolean} forward True if forward, false if backward.
 */
Bounce.scheduleFail = function(forward) {
  var deltaX = 0;
  var deltaY = 0;
  switch (Bounce.pegmanD) {
    case Direction.NORTH:
      deltaY = -1;
      break;
    case Direction.EAST:
      deltaX = 1;
      break;
    case Direction.SOUTH:
      deltaY = 1;
      break;
    case Direction.WEST:
      deltaX = -1;
      break;
  }
  if (!forward) {
    deltaX = -deltaX;
    deltaY = -deltaY;
  }

  var targetX = Bounce.pegmanX + deltaX;
  var targetY = Bounce.pegmanY + deltaY;
  var direction16 = Bounce.constrainDirection16(Bounce.pegmanD * 4);
  Bounce.displayPegman(Bounce.pegmanX + deltaX / 4,
                     Bounce.pegmanY + deltaY / 4,
                     direction16);
  // Play sound and animation for hitting wall or obstacle
  var squareType = Bounce.map[targetY] && Bounce.map[targetY][targetX];
  if (squareType === SquareType.WALL || squareType === undefined) {
    // Play the sound
    BlocklyApps.playAudio('wall', {volume: 0.5});
    if (squareType !== undefined) {
      // Check which type of wall pegman is hitting
      BlocklyApps.playAudio('wall' + Bounce.wallMap[targetY][targetX],
                            {volume: 0.5});
    }

    // Play the animation of hitting the wall
    if (skin.hittingWallAnimation) {
      Bounce.pidList.push(window.setTimeout(function() {
        var wallAnimationIcon = document.getElementById('wallAnimation');
        wallAnimationIcon.setAttribute(
            'x',
            Bounce.SQUARE_SIZE * (Bounce.pegmanX + 0.5 + deltaX * 0.5) -
            wallAnimationIcon.getAttribute('width') / 2);
        wallAnimationIcon.setAttribute(
            'y',
            Bounce.SQUARE_SIZE * (Bounce.pegmanY + 1 + deltaY * 0.5) -
            wallAnimationIcon.getAttribute('height'));
        wallAnimationIcon.setAttribute('visibility', 'visible');
        wallAnimationIcon.setAttributeNS(
          'http://www.w3.org/1999/xlink', 'xlink:href',
          skin.hittingWallAnimation);
      }, stepSpeed / 2));
    }
    Bounce.pidList.push(window.setTimeout(function() {
      Bounce.displayPegman(Bounce.pegmanX,
                         Bounce.pegmanY,
                         direction16);
    }, stepSpeed));
    Bounce.pidList.push(window.setTimeout(function() {
      Bounce.displayPegman(Bounce.pegmanX + deltaX / 4,
                         Bounce.pegmanY + deltaY / 4,
                         direction16);
      BlocklyApps.playAudio('failure', {volume: 0.5});
    }, stepSpeed * 2));
    Bounce.pidList.push(window.setTimeout(function() {
      Bounce.displayPegman(Bounce.pegmanX, Bounce.pegmanY, direction16);
    }, stepSpeed * 3));
    if (skin.wallPegmanAnimation) {
      Bounce.pidList.push(window.setTimeout(function() {
        var pegmanIcon = document.getElementById('pegman');
        pegmanIcon.setAttribute('visibility', 'hidden');
        updatePegmanAnimation({
          idStr: 'wall',
          row: Bounce.pegmanY,
          col: Bounce.pegmanX,
          direction: Bounce.pegmanD
        });
      }, stepSpeed * 4));
    }
  } else if (squareType == SquareType.OBSTACLE) {
    // Play the sound
    BlocklyApps.playAudio('obstacle', {volume: 0.5});

    // Play the animation
    var obsId = targetX + Bounce.COLS * targetY;
    var obsIcon = document.getElementById('obstacle' + obsId);
    obsIcon.setAttributeNS(
        'http://www.w3.org/1999/xlink', 'xlink:href',
        skin.obstacleAnimation);
    Bounce.pidList.push(window.setTimeout(function() {
      Bounce.displayPegman(Bounce.pegmanX + deltaX / 2,
                         Bounce.pegmanY + deltaY / 2,
                         direction16);
    }, stepSpeed));

    // Replace the objects around obstacles with broken objects
    if (skin.largerObstacleAnimationTiles) {
      Bounce.pidList.push(window.setTimeout(function() {
        Bounce.updateSurroundingTiles(
            targetY, targetX, skin.largerObstacleAnimationTiles);
      }, stepSpeed));
    }

    // Remove pegman
    if (!skin.nonDisappearingPegmanHittingObstacle) {
      var svgBounce = document.getElementById('svgBounce');
      var pegmanIcon = document.getElementById('pegman');

      Bounce.pidList.push(window.setTimeout(function() {
        pegmanIcon.setAttribute('visibility', 'hidden');
      }, stepSpeed * 2));
    }
    Bounce.pidList.push(window.setTimeout(function() {
      BlocklyApps.playAudio('failure', {volume: 0.5});
    }, stepSpeed));
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
 * Schedule the animations and sound for a victory dance.
 * @param {boolean} sound Play the victory sound.
 */
Bounce.scheduleFinish = function(sound) {
  var direction16 = Bounce.constrainDirection16(Bounce.pegmanD * 4);
  Bounce.displayPegman(Bounce.pegmanX, Bounce.pegmanY, 16);

  // Setting the tiles to be transparent
  if (sound && skin.transparentTileEnding) {
    BlocklyApps.log.push(['tile_transparent', null]);
  }

  // If sound == true, play the goal animation, else reset it
  var finishIcon = document.getElementById('finish');
  if (sound && finishIcon) {
    BlocklyApps.playAudio('winGoal', {volumne: 0.5});
    finishIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                              skin.goalAnimation);
  }

  if (sound) {
    BlocklyApps.playAudio('win', {volume: 0.5});
  }
  stepSpeed = 150;  // Slow down victory animation a bit.
  Bounce.pidList.push(window.setTimeout(function() {
    Bounce.displayPegman(Bounce.pegmanX, Bounce.pegmanY, 18);
  }, stepSpeed));
  Bounce.pidList.push(window.setTimeout(function() {
    Bounce.displayPegman(Bounce.pegmanX, Bounce.pegmanY, 20);
  }, stepSpeed * 2));
  Bounce.pidList.push(window.setTimeout(function() {
    Bounce.displayPegman(Bounce.pegmanX, Bounce.pegmanY, 18);
  }, stepSpeed * 3));
  Bounce.pidList.push(window.setTimeout(function() {
    Bounce.displayPegman(Bounce.pegmanX, Bounce.pegmanY, 20);
  }, stepSpeed * 4));
  Bounce.pidList.push(window.setTimeout(function() {
    Bounce.displayPegman(Bounce.pegmanX, Bounce.pegmanY, direction16);
  }, stepSpeed * 5));
};

/**
 * Display Pegman at the specified location, facing the specified direction.
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 * @param {number} d Direction (0 - 15) or dance (16 - 17).
 */
Bounce.displayPegman = function(x, y, d) {
  var pegmanIcon = document.getElementById('pegman');
  pegmanIcon.setAttribute('x',
      x * Bounce.SQUARE_SIZE - d * Bounce.PEGMAN_WIDTH + 1);
  pegmanIcon.setAttribute('y', getPegmanYCoordinate({
    mazeRow : y
  }));

  var clipRect = document.getElementById('clipRect');
  clipRect.setAttribute('x', x * Bounce.SQUARE_SIZE + 1);
  clipRect.setAttribute('y', pegmanIcon.getAttribute('y'));
};

/**
 * Display Ball at the specified location, facing the specified direction.
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 * @param {number} d Direction (0 - 15) or dance (16 - 17).
 */
Bounce.displayBall = function(x, y, d) {
  // console.log("displayBall x=" + x + " y=" + y + " d=" + d);
  var ballIcon = document.getElementById('ball');
  ballIcon.setAttribute('x',
                        x * Bounce.SQUARE_SIZE - d * Bounce.PEGMAN_WIDTH + 1);
  ballIcon.setAttribute('y',
                        y * Bounce.SQUARE_SIZE + Bounce.PEGMAN_Y_OFFSET - 8);
  
  var ballClipRect = document.getElementById('ballClipRect');
  ballClipRect.setAttribute('x', x * Bounce.SQUARE_SIZE + 1);
  ballClipRect.setAttribute('y', ballIcon.getAttribute('y'));
};

var scheduleDirtChange = function(options) {
  var col = Bounce.pegmanX;
  var row = Bounce.pegmanY;
  var previous = Bounce.dirt_[row][col];
  var current = previous + options.amount;
  Bounce.dirt_[row][col] = current;
  if (previous === 0 && current !== 0) {
    createDirt(row, col);
  }
  if (current === 0) {
    removeDirt(row, col);
  } else {
    updateDirt(row, col);
  }
  BlocklyApps.playAudio(options.sound, {volume: 0.5});
};

/**
 * Schedule to add dirt at pegman's current position.
 */
Bounce.scheduleFill = function() {
  scheduleDirtChange({
    amount: 1,
    sound: 'fill'
  });
};

/**
 * Schedule to remove dirt at pegman's current location.
 */
Bounce.scheduleDig = function() {
  scheduleDirtChange({
    amount: -1,
    sound: 'dig'
  });
};

/**
 * Display the look icon at Pegman's current location,
 * in the specified direction.
 * @param {!Direction} d Direction (0 - 3).
 */
Bounce.scheduleLook = function(d) {
  var x = Bounce.pegmanX;
  var y = Bounce.pegmanY;
  switch (d) {
    case Direction.NORTH:
      x += 0.5;
      break;
    case Direction.EAST:
      x += 1;
      y += 0.5;
      break;
    case Direction.SOUTH:
      x += 0.5;
      y += 1;
      break;
    case Direction.WEST:
      y += 0.5;
      break;
  }
  x *= Bounce.SQUARE_SIZE;
  y *= Bounce.SQUARE_SIZE;
  d = d * 90 - 45;

  var lookIcon = document.getElementById('look');
  lookIcon.setAttribute('transform',
      'translate(' + x + ', ' + y + ') ' +
      'rotate(' + d + ' 0 0) scale(.4)');
  var paths = lookIcon.getElementsByTagName('path');
  lookIcon.style.display = 'inline';
  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    Bounce.scheduleLookStep(path, stepSpeed * i);
  }
};

/**
 * Schedule one of the 'look' icon's waves to appear, then disappear.
 * @param {!Element} path Element to make appear.
 * @param {number} delay Milliseconds to wait before making wave appear.
 */
Bounce.scheduleLookStep = function(path, delay) {
  Bounce.pidList.push(window.setTimeout(function() {
    path.style.display = 'inline';
    window.setTimeout(function() {
      path.style.display = 'none';
    }, stepSpeed * 2);
  }, delay));
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

var isDirtCorrect = function() {
  for (var y = 0; y < Bounce.ROWS; y++) {
    for (var x = 0; x < Bounce.COLS; x++) {
      if (getTile(Bounce.dirt_, x, y) != getTile(Bounce.finalDirtMap, x, y)) {
        return false;
      }
    }
  }
  return true;
};

Bounce.checkSuccess = function() {
  if (atFinish() && isDirtCorrect()) {
    // Finished.  Terminate the user's program.
    BlocklyApps.log.push(['finish', null]);
    throw true;
  }
  return false;
};

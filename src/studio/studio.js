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
var blocks = require('./blocks');
var page = require('../templates/page.html');
var feedback = require('../feedback.js');
var dom = require('../dom');

var Direction = tiles.Direction;
var SquareType = tiles.SquareType;
var Emotions = tiles.Emotions;

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

var SpriteFlags = {
  LOOPING_MOVE_X_PENDING: 1,
  LOOPING_MOVE_Y_PENDING: 2,
  EMOTIONS: 4,
  ANIMATION: 8,
  TURNS: 16,
};

var SF_SKINS_MASK =
  SpriteFlags.EMOTIONS | SpriteFlags.ANIMATION | SpriteFlags.TURNS;

var SpriteOffsets = {
  EMOTIONS: 3,
  ANIMATION: 1,
  TURNS: 7,
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

//The number of blocks to show as feedback.
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = 1;

// Default Scalings
Studio.scale = {
  'snapRadius': 1,
  'stepSpeed': 33
};

Studio.SPEECH_BUBBLE_TIMEOUT = 3000;

var twitterOptions = {
  text: studioMsg.shareStudioTwitter(),
  hashtag: "StudioCode"
};

var loadLevel = function() {
  // Load maps.
  Studio.map = level.map;
  Studio.timeoutFailureTick = level.timeoutFailureTick || Infinity;
  Studio.minWorkspaceHeight = level.minWorkspaceHeight;
  Studio.spriteStartingImage = level.spriteStartingImage;
  Studio.softButtons_ = level.softButtons || [];

  // Override scalars.
  for (var key in level.scale) {
    Studio.scale[key] = level.scale[key];
  }

  // Measure maze dimensions and set sizes.
  // ROWS: Number of tiles down.
  Studio.ROWS = Studio.map.length;
  // COLS: Number of tiles across.
  Studio.COLS = Studio.map[0].length;
  // Pixel height and width of each maze square (i.e. tile).
  Studio.SQUARE_SIZE = 50;
  Studio.SPRITE_HEIGHT = skin.spriteHeight;
  Studio.SPRITE_WIDTH = skin.spriteWidth;
  Studio.SPRITE_Y_OFFSET = skin.spriteYOffset;
  // Height and width of the goal and obstacles.
  Studio.MARKER_HEIGHT = 100;
  Studio.MARKER_WIDTH = 100;

  Studio.MAZE_WIDTH = Studio.SQUARE_SIZE * Studio.COLS;
  Studio.MAZE_HEIGHT = Studio.SQUARE_SIZE * Studio.ROWS;
  Studio.PATH_WIDTH = Studio.SQUARE_SIZE / 3;
};

var drawMap = function() {
  var svg = document.getElementById('svgStudio');
  var i, x, y, k;

  // Adjust outer element size.
  svg.setAttribute('width', Studio.MAZE_WIDTH);
  svg.setAttribute('height', Studio.MAZE_HEIGHT);

  // Adjust visualization and belowVisualization width.
  var visualization = document.getElementById('visualization');
  visualization.style.width = Studio.MAZE_WIDTH + 'px';
  var belowVisualization = document.getElementById('belowVisualization');
  belowVisualization.style.width = Studio.MAZE_WIDTH + 'px';
  if (Studio.minWorkspaceHeight > Studio.MAZE_HEIGHT) {
    belowVisualization.style.minHeight =
      (Studio.minWorkspaceHeight - Studio.MAZE_HEIGHT) + 'px';
  }

  // Adjust button table width.
  var buttonTable = document.getElementById('gameButtons');
  buttonTable.style.width = Studio.MAZE_WIDTH + 'px';

  var hintBubble = document.getElementById('bubble');
  hintBubble.style.width = Studio.MAZE_WIDTH + 'px';

  if (skin.background) {
    var tile = document.createElementNS(Blockly.SVG_NS, 'image');
    tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                        skin.background);
    tile.setAttribute('id', 'background');
    tile.setAttribute('height', Studio.MAZE_HEIGHT);
    tile.setAttribute('width', Studio.MAZE_WIDTH);
    tile.setAttribute('x', 0);
    tile.setAttribute('y', 0);
    svg.appendChild(tile);
  }

  if (Studio.spriteStart_) {
    for (i = 0; i < Studio.spriteCount; i++) {
      // Sprite clipPath element, whose (x, y) is reset by Studio.displaySprite
      var spriteClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
      spriteClip.setAttribute('id', 'spriteClipPath' + i);
      var spriteClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
      spriteClipRect.setAttribute('id', 'spriteClipRect' + i);
      spriteClipRect.setAttribute('width', Studio.SPRITE_WIDTH);
      spriteClipRect.setAttribute('height', Studio.SPRITE_HEIGHT);
      spriteClip.appendChild(spriteClipRect);
      svg.appendChild(spriteClip);
      
      // Add sprite (not setting href attribute or width until displaySprite).
      var spriteIcon = document.createElementNS(Blockly.SVG_NS, 'image');
      spriteIcon.setAttribute('id', 'sprite' + i);
      spriteIcon.setAttribute('height', Studio.SPRITE_HEIGHT);
      spriteIcon.setAttribute('clip-path', 'url(#spriteClipPath' + i + ')');
      svg.appendChild(spriteIcon);
      
      dom.addMouseDownTouchEvent(spriteIcon,
                                 delegate(this,
                                          Studio.onSpriteClicked,
                                          i));
    }
    for (i = 0; i < Studio.spriteCount; i++) {
      var spriteSpeechBubble = document.createElementNS(Blockly.SVG_NS, 'text');
      spriteSpeechBubble.setAttribute('id', 'speechBubble' + i);
      spriteSpeechBubble.setAttribute('class', 'studio-speech-bubble');
      spriteSpeechBubble.appendChild(document.createTextNode(''));
      spriteSpeechBubble.setAttribute('visibility', 'hidden');
      svg.appendChild(spriteSpeechBubble);
    }
  }
  
  if (Studio.sprite0Finish_) {
    for (i = 0; i < Studio.sprite0FinishCount; i++) {
      // Add finish markers.
      var sprite0FinishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
      sprite0FinishMarker.setAttribute('id', 'sprite0finish' + i);
      sprite0FinishMarker.setAttributeNS('http://www.w3.org/1999/xlink',
                                         'xlink:href',
                                         skin.goal);
      sprite0FinishMarker.setAttribute('height', Studio.MARKER_HEIGHT);
      sprite0FinishMarker.setAttribute('width', Studio.MARKER_WIDTH);
      svg.appendChild(sprite0FinishMarker);
    }
  }

  var score = document.createElementNS(Blockly.SVG_NS, 'text');
  score.setAttribute('id', 'score');
  score.setAttribute('class', 'studio-score');
  score.setAttribute('x', Studio.MAZE_WIDTH / 2);
  score.setAttribute('y', 60);
  score.appendChild(document.createTextNode(''));
  score.setAttribute('visibility', 'hidden');
  svg.appendChild(score);
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

//
// Perform Queued Moves in the X and Y axes (called from inside onTick)
//
var performQueuedMoves = function(i)
{
  // Make queued moves in the X axis (fixed to .01 values):
  if (Studio.sprite[i].queuedX) {
    var nextX = Studio.sprite[i].x;
    if (Studio.sprite[i].queuedX < 0) {
      nextX -= Math.min(Math.abs(Studio.sprite[i].queuedX),
                        Studio.sprite[i].speed);
    } else {
      nextX += Math.min(Studio.sprite[i].queuedX, Studio.sprite[i].speed);
    }
    // Clamp nextX to boundaries as newX:
    var newX = Math.min(Studio.COLS - 2, Math.max(0, nextX));
    if (nextX != newX) {
      Studio.sprite[i].queuedX = 0;
    } else {
      var newQX = Studio.sprite[i].queuedX - (nextX - Studio.sprite[i].x);
      Studio.sprite[i].queuedX = newQX;
      // for very small numbers, reset to integer zero
      if ("0.00" === newQX.toFixed(2)) {
        Studio.sprite[i].queuedX = 0;
      }
    }
    Studio.sprite[i].x = newX;
  } else {
    // no X movement, check for queued commands
    var newQueuedX = Studio.sprite[i].xMoveQueue.shift();
    if (newQueuedX) {
      Studio.sprite[i].queuedX = newQueuedX;
    }
    else {
      // flip off async flags and reset any stored context
      Studio.sprite[i].flags &= ~(SpriteFlags.LOOPING_MOVE_X_PENDING);
      Studio.sprite[i].queuedXContext = -1;
    }
  }
  // Make queued moves in the Y axis (fixed to .01 values):
  if (Studio.sprite[i].queuedY) {
    var nextY = Studio.sprite[i].y;
    if (Studio.sprite[i].queuedY < 0) {
      nextY -= Math.min(Math.abs(Studio.sprite[i].queuedY),
                        Studio.sprite[i].speed);
    } else {
      nextY += Math.min(Studio.sprite[i].queuedY, Studio.sprite[i].speed);
    }
    // Clamp nextY to boundaries as newY:
    var newY = Math.min(Studio.ROWS - 2, Math.max(0, nextY));
    if (nextY != newY) {
      Studio.sprite[i].queuedY = 0;
    } else {
      var newQY = Studio.sprite[i].queuedY - (nextY - Studio.sprite[i].y);
      Studio.sprite[i].queuedY = newQY;
      // for very small numbers, reset to integer zero
      if ("0.00" === newQY.toFixed(2)) {
        Studio.sprite[i].queuedY = 0;
      }
    }
    Studio.sprite[i].y = newY;
  } else {
    // no Y movement, check for queued commands
    var newQueuedY = Studio.sprite[i].yMoveQueue.shift();
    if (newQueuedY) {
      Studio.sprite[i].queuedY = newQueuedY;
    }
    else {
      // flip off async flags and reset any stored context
      Studio.sprite[i].flags &= ~(SpriteFlags.LOOPING_MOVE_Y_PENDING);
      Studio.sprite[i].queuedYContext = -1;
    }
  }
};

//
// Show speech bubbles queued in sayQueues (called from inside onTick)
//

var showSpeechBubbles = function() {
  for (var i = 0; i < Studio.eventHandlerNumber; i++) {
    var sayCmd;
    var sayQueue = Studio.sayQueues[i];
    while (sayQueue &&
           (sayCmd = sayQueue[0]) && sayCmd.tickCount <= Studio.tickCount) {
      // Remove this item from the queue
      sayQueue.shift();
      var speechBubble = document.getElementById('speechBubble' + sayCmd.index);
      speechBubble.textContent = sayCmd.text;
      speechBubble.setAttribute('visibility', 'visible');
      window.clearTimeout(Studio.sprite[sayCmd.index].bubbleTimeout);
      Studio.sprite[sayCmd.index].bubbleTimeout = window.setTimeout(
          delegate(this, Studio.hideSpeechBubble, sayCmd),
          Studio.SPEECH_BUBBLE_TIMEOUT);
    }
  }
};

//
// Check to see if all async code executed inside the whenGameIsRunning event
// is complete. This means checking for moveDistance blocks or SaySprite blocks
// that started during a previous whenGameIsRunning event and are still going.
//
// If this function returns true, it is reasonable to fire the event again...
//

var loopingAsyncCodeComplete = function() {
  for (var i = 0; i < Studio.spriteCount; i++) {
    if (Studio.sprite[i].flags & (SpriteFlags.LOOPING_MOVE_X_PENDING |
                                  SpriteFlags.LOOPING_MOVE_Y_PENDING)) {
      return false;
    }
  }
  return Studio.loopingPendingSayCmds === 0;
};

Studio.onTick = function() {
  Studio.tickCount++;

  if (Studio.tickCount === 1) {
    try { Studio.whenGameStarts(BlocklyApps, api); } catch (e) { }
  }

  Studio.calledFromWhenGameRunning = true;
  if (loopingAsyncCodeComplete()) {
    try { Studio.whenGameIsRunning(BlocklyApps, api); } catch (e) { }
  }
  Studio.calledFromWhenGameRunning = false;
  
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
  
  // Do per-sprite tasks:
  for (var i = 0; i < Studio.spriteCount; i++) {
    performQueuedMoves(i);

    // Check for collisions:
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
        if (0 === (Studio.sprite[i].collisionMask & Math.pow(2, j))) {
          Studio.sprite[i].collisionMask |= Math.pow(2, j);
          try {
            Studio.whenSpriteCollided[i][j](BlocklyApps, api);
          } catch (e) { }
        }
      } else {
          Studio.sprite[i].collisionMask &= ~(Math.pow(2, j));
      }
    }
    // Display sprite:
    Studio.displaySprite(i);
  }
  
  showSpeechBubbles();
  
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
      extraControlRows:
          require('./extraControlRows.html')({assetUrl: BlocklyApps.assetUrl}),
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
    
    drawMap();
  };

  config.getDisplayWidth = function() {
    var visualization = document.getElementById('visualization');
    return visualization.getBoundingClientRect().width;
  };

  // TODO: update this for Studio
  // Block placement default (used as fallback in the share levels)
  config.blockArrangement = {
    'studio_whenGameStarts': { x: 20, y: 20},
    'studio_whenLeft': { x: 20, y: 110},
    'studio_whenRight': { x: 180, y: 110},
  };

  config.twitter = twitterOptions;

  // for this app, show make your own button if on share page
  config.makeYourOwn = config.share;

  config.makeString = studioMsg.makeYourOwn();
  config.makeUrl = "http://code.org/studio";
  config.makeImage = BlocklyApps.assetUrl('media/promo.png');

  config.enableShowCode = false;

  config.preventExtraTopLevelBlocks = true;

  Studio.sprite0FinishCount = 0;
  Studio.spriteCount = 0;
  Studio.sprite = [];
  
  // Locate the start and finish squares.
  for (var y = 0; y < Studio.ROWS; y++) {
    for (var x = 0; x < Studio.COLS; x++) {
      if (Studio.map[y][x] & SquareType.SPRITE0FINISH) {
        if (0 === Studio.sprite0FinishCount) {
          Studio.sprite0Finish_ = [];
        }
        Studio.sprite0Finish_[Studio.sprite0FinishCount] = {x: x, y: y};
        Studio.sprite0FinishCount++;
      } else if (Studio.map[y][x] & SquareType.SPRITESTART) {
        if (0 === Studio.spriteCount) {
          Studio.spriteStart_ = [];
        }
        Studio.sprite[Studio.spriteCount] = [];
        Studio.spriteStart_[Studio.spriteCount] = {x: x, y: y};
        Studio.spriteCount++;
      }
    }
  }
  
  // Update the sprite count in the blocks:
  blocks.setSpriteCount(Blockly, Studio.spriteCount);
    
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
  Studio.whenDown = null;
  Studio.whenLeft = null;
  Studio.whenRight = null;
  Studio.whenUp = null;
  Studio.whenGameIsRunning = null;
  Studio.whenGameStarts = null;
  Studio.whenSpriteClicked = [];
  Studio.whenSpriteCollided = [];
  if (Studio.intervalId) {
    window.clearInterval(Studio.intervalId);
  }
  Studio.intervalId = 0;
  for (var i = 0; i < Studio.spriteCount; i++) {
    window.clearTimeout(Studio.sprite[i].bubbleTimeout);
  }
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
  Studio.setBackground('cave');
  
  // Reset the eventHandlerNumber, say queues, pending, and complete counts:
  Studio.eventHandlerNumber = 0;
  Studio.sayQueues = [];
  Studio.sayComplete = 0;
  Studio.loopingPendingSayCmds = 0;

  var spriteStartingSkins = [ "witch", "green", "purple", "pink", "orange" ];
  var numStartingSkins = spriteStartingSkins.length;
  var skinBias = Studio.spriteStartingImage || 0;

  // Move sprites into position.
  for (i = 0; i < Studio.spriteCount; i++) {
    Studio.sprite[i].x = Studio.spriteStart_[i].x;
    Studio.sprite[i].y = Studio.spriteStart_[i].y;
    Studio.sprite[i].speed = tiles.DEFAULT_SPRITE_SPEED;
    Studio.sprite[i].collisionMask = 0;
    Studio.sprite[i].queuedX = 0;
    Studio.sprite[i].queuedXContext = -1;
    Studio.sprite[i].queuedY = 0;
    Studio.sprite[i].queuedYContext = -1;
    Studio.sprite[i].flags = 0;
    Studio.sprite[i].emotion = Emotions.NORMAL;
    Studio.sprite[i].xMoveQueue = [];
    Studio.sprite[i].yMoveQueue = [];
    
    Studio.setSprite(i, spriteStartingSkins[(i + skinBias) % numStartingSkins]);
    Studio.displaySprite(i);
    document.getElementById('speechBubble' + i)
      .setAttribute('visibility', 'hidden');
  }

  var svg = document.getElementById('svgStudio');

  if (Studio.sprite0Finish_) {
    for (i = 0; i < Studio.sprite0FinishCount; i++) {
      // Mark each finish as incomplete.
      Studio.sprite0Finish_[i].finished = false;

      // Move the finish icons into position.
      var sprite0FinishIcon = document.getElementById('sprite0finish' + i);
      sprite0FinishIcon.setAttribute(
          'x',
          Studio.SQUARE_SIZE * Studio.sprite0Finish_[i].x);
      sprite0FinishIcon.setAttribute(
          'y',
          Studio.SQUARE_SIZE * Studio.sprite0Finish_[i].y);
      sprite0FinishIcon.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'xlink:href',
          skin.goal);
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
  
  if (level.showZeroZeroScore) {
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
                                    'studio_whenGameIsRunning');
  var whenGameIsRunningFunc = codegen.functionFromCode(
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

  var x;
  var block;
  var blocks = Blockly.mainWorkspace.getTopBlocks(true);

  var whenSpriteClickedFunc = [];
  for (i = 0; i < Studio.spriteCount; i++) {
    for (x = 0; blocks[x]; x++) {
      block = blocks[x];
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
      for (x = 0; blocks[x]; x++) {
        block = blocks[x];
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
  Studio.whenLeft = whenLeftFunc;
  Studio.whenRight = whenRightFunc;
  Studio.whenUp = whenUpFunc;
  Studio.whenDown = whenDownFunc;
  Studio.whenGameIsRunning = whenGameIsRunningFunc;
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

var spriteFrameNumber = function (index) {
  var showThisAnimFrame = 0;
  if ((Studio.sprite[index].flags & SpriteFlags.ANIMATION) &&
      Studio.tickCount &&
      Math.round(Studio.tickCount / 20) % 2) {
    // BUGBUG: +2 is temporary until we get a new PNG
    showThisAnimFrame = (Studio.sprite[index].flags & SpriteFlags.EMOTIONS) ?
                         SpriteOffsets.EMOTIONS + 2 : 0;
  }
  if (Studio.sprite[index].emotion !== Emotions.NORMAL &&
      Studio.sprite[index].flags & SpriteFlags.EMOTIONS) {
    return showThisAnimFrame ? showThisAnimFrame : Studio.sprite[index].emotion;
  }
  return showThisAnimFrame;
};

var spriteTotalFrames = function (index) {
  var frames = 1;
  if (Studio.sprite[index].flags & SpriteFlags.EMOTIONS) {
    frames += SpriteOffsets.EMOTIONS;
  }
  if (Studio.sprite[index].flags & SpriteFlags.ANIMATION) {
    frames += SpriteOffsets.ANIMATION;
  }
  if (Studio.sprite[index].flags & SpriteFlags.TURNS) {
    frames += SpriteOffsets.TURNS;
  }
  return frames;
};

Studio.displaySprite = function(i) {
  var xCoord = Studio.sprite[i].x * Studio.SQUARE_SIZE;
  var yCoord = Studio.sprite[i].y * Studio.SQUARE_SIZE + Studio.SPRITE_Y_OFFSET;
  
  // BUGBUG: -2 is temporary until we get a fixed bitmap
  var xOffset = (Studio.SPRITE_WIDTH - 2.083333) * spriteFrameNumber(i);

  var spriteIcon = document.getElementById('sprite' + i);
  spriteIcon.setAttribute('x', xCoord - xOffset);
  spriteIcon.setAttribute('y', yCoord);
  
  var spriteClipRect = document.getElementById('spriteClipRect' + i);
  spriteClipRect.setAttribute('x', xCoord);
  spriteClipRect.setAttribute('y', yCoord);

  var speechBubble = document.getElementById('speechBubble' + i);
  speechBubble.setAttribute('x', xCoord);
  speechBubble.setAttribute('y', yCoord);
};

Studio.displayScore = function() {
  var score = document.getElementById('score');
  score.textContent = studioMsg.scoreText({
    playerScore: Studio.playerScore,
    opponentScore: Studio.opponentScore
  });
  score.setAttribute('visibility', 'visible');
};

var skinTheme = function (value) {
  if (value === 'witch') {
    return skin;
  }
  return skin[value];
};

Studio.setBackground = function (value) {
  var element = document.getElementById('background');
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
    skinTheme(value).background);
};

Studio.setSprite = function (index, value) {
  // Inherit some flags from the skin:
  Studio.sprite[index].flags &= ~SF_SKINS_MASK;
  Studio.sprite[index].flags |= skinTheme(value).spriteFlags;
  
  var element = document.getElementById('sprite' + index);
  element.setAttribute('visibility',
                       (value === 'hidden') ? 'hidden' : 'visible');
  if (value != 'hidden') {
    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                           skinTheme(value).sprite);
    element.setAttribute('width',
                         (Studio.SPRITE_WIDTH - 2.083333) * spriteTotalFrames(index));
    // call display right away since the frame number may have changed:
    Studio.displaySprite(index);
  }
};

Studio.hideSpeechBubble = function (sayCmd) {
  var speechBubble = document.getElementById('speechBubble' + sayCmd.index);
  speechBubble.setAttribute('visibility', 'hidden');
  Studio.sayComplete++;
  if (sayCmd.calledFromWhenGameRunning) {
    Studio.loopingPendingSayCmds--;
  }
};

var stampNextQueuedSayTick = function (executionCtx) {
  var tickCount = Studio.tickCount;
  var sayQueue = Studio.sayQueues[executionCtx];
  if (sayQueue) {
    // Use the last item in this event handler's queue of say commands,
    // clone that tickCount and add the SPEECH_BUBBLE_TIMEOUT (in ticks)
    var sayCmd = sayQueue.slice(-1)[0];
    if (sayCmd) {
      tickCount = sayCmd.tickCount +
          Math.round(Studio.SPEECH_BUBBLE_TIMEOUT / Studio.scale.stepSpeed);
    }
  }
  return tickCount;
};

Studio.saySprite = function (executionCtx, index, text) {
  if (!Studio.sayQueues[executionCtx]) {
    Studio.sayQueues[executionCtx] = [];
  }
  
  var sayCmd = {
      'tickCount': stampNextQueuedSayTick(executionCtx),
      'calledFromWhenGameRunning': Studio.calledFromWhenGameRunning,
      'index': index,
      'text': text
  };
  if (Studio.calledFromWhenGameRunning) {
    Studio.loopingPendingSayCmds++;
  }
  Studio.sayQueues[executionCtx].push(sayCmd);
};

Studio.moveSingle = function (spriteIndex, dir) {
  switch (dir) {
    case Direction.NORTH:
      Studio.sprite[spriteIndex].y -= Studio.sprite[spriteIndex].speed;
      if (Studio.sprite[spriteIndex].y < 0) {
        Studio.sprite[spriteIndex].y = 0;
      }
      break;
    case Direction.EAST:
      Studio.sprite[spriteIndex].x += Studio.sprite[spriteIndex].speed;
      if (Studio.sprite[spriteIndex].x > (Studio.COLS - 2)) {
        Studio.sprite[spriteIndex].x = Studio.COLS - 2;
      }
      break;
    case Direction.SOUTH:
      Studio.sprite[spriteIndex].y += Studio.sprite[spriteIndex].speed;
      if (Studio.sprite[spriteIndex].y > (Studio.ROWS - 2)) {
        Studio.sprite[spriteIndex].y = Studio.ROWS - 2;
      }
      break;
    case Direction.WEST:
      Studio.sprite[spriteIndex].x -= Studio.sprite[spriteIndex].speed;
      if (Studio.sprite[spriteIndex].x < 0) {
        Studio.sprite[spriteIndex].x = 0;
      }
      break;
  }
};

Studio.moveDistance = function (executionCtx, index, dir, distance) {
  var loopingFlag;

  switch (dir) {
    case Direction.NORTH:
    case Direction.SOUTH:
      loopingFlag = SpriteFlags.LOOPING_MOVE_Y_PENDING;
      if (dir === Direction.NORTH) {
        distance *= -1;
      }
      var queuedY = distance / Studio.SQUARE_SIZE;
      if ((0 !== Studio.sprite[index].queuedY) &&
          (executionCtx === Studio.sprite[index].queuedYContext)) {
        // Only queue a move if it is the same sprite, in the same direction,
        // and in the same execution context:
        Studio.sprite[index].yMoveQueue.push(queuedY);
      } else {
        // Reset any queued movement of this sprite on this axis
        Studio.sprite[index].queuedYContext = executionCtx;
        Studio.sprite[index].queuedY = queuedY;
        Studio.sprite[index].yMoveQueue = [];
      }
      break;
    case Direction.EAST:
    case Direction.WEST:
      loopingFlag = SpriteFlags.LOOPING_MOVE_X_PENDING;
      if (dir === Direction.WEST) {
        distance *= -1;
      }
      var queuedX = distance / Studio.SQUARE_SIZE;
      if ((0 !== Studio.sprite[index].queuedX) &&
          (executionCtx === Studio.sprite[index].queuedXContext)) {
        // Only queue a move if it is the same sprite, in the same direction,
        // and in the same execution context:
        Studio.sprite[index].xMoveQueue.push(queuedX);
      } else {
        // Reset any queued movement of this sprite on this axis
        Studio.sprite[index].queuedXContext = executionCtx;
        Studio.sprite[index].queuedX = queuedX;
        Studio.sprite[index].xMoveQueue = [];
      }
      break;
  }
  if (Studio.calledFromWhenGameRunning) {
    Studio.sprite[index].flags |= loopingFlag;
  } else {
    Studio.sprite[index].flags &= ~loopingFlag;
  }
};

Studio.timedOut = function() {
  return Studio.tickCount > Studio.timeoutFailureTick;
};

Studio.allFinishesComplete = function() {
  var i;
  if (Studio.sprite0Finish_) {
    var finished, playSound;
    for (i = 0, finished = 0; i < Studio.sprite0FinishCount; i++) {
      if (!Studio.sprite0Finish_[i].finished) {
        if (essentiallyEqual(Studio.sprite[0].x,
                             Studio.sprite0Finish_[i].x,
                             tiles.FINISH_COLLIDE_DISTANCE) &&
            essentiallyEqual(Studio.sprite[0].y,
                             Studio.sprite0Finish_[i].y,
                             tiles.FINISH_COLLIDE_DISTANCE)) {
          Studio.sprite0Finish_[i].finished = true;
          finished++;
          playSound = true;

          // Change the finish icon to goalSuccess.
          var sprite0FinishIcon = document.getElementById('sprite0finish' + i);
          sprite0FinishIcon.setAttributeNS(
              'http://www.w3.org/1999/xlink',
              'xlink:href',
              skin.goalSuccess);
        }
      } else {
        finished++;
      }
    }
    if (playSound && finished != Studio.sprite0FinishCount) {
      // Play a sound unless we've hit the last flag
      BlocklyApps.playAudio('flag', {volume: 0.5});
    }
    return (finished == Studio.sprite0FinishCount);
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

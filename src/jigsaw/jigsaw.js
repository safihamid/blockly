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

var level;
var skin;

//TODO: Make configurable.
BlocklyApps.CHECK_FOR_EMPTY_BLOCKS = true;
//The number of blocks to show as feedback.
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = 1;

Blockly.BlockSvg.NOTCH_WIDTH = 50;

var notchHeight = 8;
var notchWidthA = 6;
var notchWidthB = 10;

Blockly.BlockSvg.NOTCH_PATH_WIDTH = notchWidthA * 2 + notchWidthB;

Blockly.BlockSvg.NOTCH_PATH_LEFT = 'l ' +
  notchWidthA + ',' + notchHeight + ' ' +
  notchWidthB + ',0 ' +
  notchWidthA + ',-' + notchHeight;
Blockly.BlockSvg.NOTCH_PATH_RIGHT = 'l ' +
  '-' + notchWidthA + ',' + notchHeight + ' ' +
  '-' + notchWidthB + ',0 ' +
  '-' + notchWidthA + ',-' + notchHeight;
// Blockly.BlockSvg.NOTCH_PATH_LEFT = 'l 6,4 3,0 6,-4';
// Blockly.BlockSvg.NOTCH_PATH_RIGHT = 'l -6,4 -3,0 -6,-4';

var notchHighlightHeight = notchHeight; //4;
var notchHighlightWidthA = notchWidthA + 0.5; //6.5;
var notchHighlightWidthB = notchWidthB - 1; //2;

Blockly.BlockSvg.NOTCH_PATH_LEFT_HIGHLIGHT = 'l ' +
  notchHighlightWidthA + ',' + notchHighlightHeight + ' ' +
  notchHighlightWidthB + ',0 ' +
  notchHighlightWidthA + ',-' + notchHighlightHeight;
// Blockly.BlockSvg.NOTCH_PATH_LEFT_HIGHLIGHT = 'l 6.5,4 2,0 6.5,-4';


// Default Scalings
Jigsaw.scale = {
  'snapRadius': 1,
  'stepSpeed': 33
};

var loadLevel = function() {
  // Load maps.
  BlocklyApps.IDEAL_BLOCK_NUM = level.ideal || Infinity;
  BlocklyApps.REQUIRED_BLOCKS = level.requiredBlocks;

  // Override scalars.
  for (var key in level.scale) {
    Jigsaw.scale[key] = level.scale[key];
  }

  Jigsaw.MAZE_WIDTH = 400;
  Jigsaw.MAZE_HEIGHT = 400;
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

  // todo (brent) : per level
  if (skin.image1) {
    var background = Blockly.createSvgElement('image', {
      id: 'arena',
      height: Jigsaw.MAZE_HEIGHT,
      width: Jigsaw.MAZE_WIDTH,
      x: 0,
      y: 0,
      class: 'transparent'
    }, svg);
    background.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      skin.image1);
  }
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
 * Initialize Blockly and the Jigsaw app.  Called on page load.
 */
Jigsaw.init = function(config) {
  // Jigsaw.clearEventHandlersKillTickLoop();
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
  config.scrollbars = false;

  config.makeString = commonMsg.makeYourOwnFlappy();
  config.makeUrl = "http://code.org/Jigsaw";
  config.makeImage = BlocklyApps.assetUrl('media/Jigsaw_promo.png');

  config.enableShowCode = false;

  config.preventExtraTopLevelBlocks = true;

  BlocklyApps.init(config);

  Blockly.addChangeListener(function(evt) {
    // todo (brent): i think this is the right place to check for win condition
    var success = level.goal.successCondition();
    if (success) {
      var arena = document.getElementById('arena');
      var attribute = arena.getAttribute('class');
      arena.setAttribute('class', attribute.replace('transparent', ''));
    }
  });
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
      level: level
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
};

Jigsaw.onPuzzleComplete = function() {
  if (level.freePlay) {
    Jigsaw.result = ResultType.SUCCESS;
  }

  // Stop everything on screen
  // Jigsaw.clearEventHandlersKillTickLoop();

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

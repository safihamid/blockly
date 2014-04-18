/**
 * Blockly App: Jigsaw
 *
 * Copyright 2013 Code.org
 *
 */

'use strict';

var BlocklyApps = require('../base');
var skins = require('../skins');
var page = require('../templates/page.html');
var feedback = require('../feedback.js');
var dom = require('../dom');

/**
 * Create a namespace for the application.
 */
var Jigsaw = module.exports;

var level;
var skin;

BlocklyApps.CHECK_FOR_EMPTY_BLOCKS = true;
//The number of blocks to show as feedback.
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = 1;

Blockly.BlockSvg.NOTCH_WIDTH = 50;
Blockly.SNAP_RADIUS = 90;

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
  // Override scalars.
  for (var key in level.scale) {
    Jigsaw.scale[key] = level.scale[key];
  }

  Jigsaw.MAZE_WIDTH = 0;
  Jigsaw.MAZE_HEIGHT = 0;
};

var drawMap = function() {
  var i, x, y, k, tile;

  // Adjust outer element size.
  // Adjust visualization and belowVisualization width.
  var visualization = document.getElementById('visualization');
  visualization.style.width = Jigsaw.MAZE_WIDTH + 'px';
  var belowVisualization = document.getElementById('belowVisualization');
  belowVisualization.style.width = Jigsaw.MAZE_WIDTH + 'px';
  belowVisualization.style.display = 'none';

  // account for toolbox if there
  var toolboxWidth = -Blockly.mainWorkspace.getMetrics().viewLeft;

  var svg = document.querySelectorAll(".blocklySvg")[0];
  var image = Blockly.createSvgElement('rect', {
    fill: "url(#pat_" + level.id + "A)",
    "fill-opacity": "0.2",
    width: level.image.width,
    height: level.image.height,
    transform: "translate(" + (toolboxWidth + level.ghost.x) + ", " +
      level.ghost.y + ")"
  });
  // we want it to be first, so it's behind everything
  svg.insertBefore(image, svg.childNodes[0]);
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
      controls: require('./controls.html')({assetUrl: BlocklyApps.assetUrl}),
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

    drawMap();
  };

  config.getDisplayWidth = function() {
    var visualization = document.getElementById('visualization');
    return visualization.getBoundingClientRect().width;
  };

  config.trashcan = false;
  config.scrollbars = false;
  config.concreteBlocks = true;

  config.enableShowCode = false;

  BlocklyApps.init(config);

  document.getElementById('runButton').style.display = 'none';
  Blockly.addChangeListener(function(evt) {
    BlocklyApps.runButtonClick();
  });
};

BlocklyApps.runButtonClick = function() {
  var success = level.goal.successCondition();
  if (success) {
    Jigsaw.result = ResultType.SUCCESS;

    Jigsaw.onPuzzleComplete();
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
      app: 'Jigsaw',
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
  // execute is a no-op for jigsaw
};

Jigsaw.onPuzzleComplete = function() {

  // If we know they succeeded, mark levelComplete true
  // Note that we have not yet animated the succesful run
  BlocklyApps.levelComplete = (Jigsaw.result == ResultType.SUCCESS);

  Jigsaw.testResults = BlocklyApps.getTestResults();

  if (Jigsaw.testResults >= BlocklyApps.TestResults.FREE_PLAY) {
    BlocklyApps.playAudio('win', {volume : 0.5});
  } else {
    BlocklyApps.playAudio('failure', {volume : 0.5});
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

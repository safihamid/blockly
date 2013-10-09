/**
 * Blockly Apps: Common code
 *
 * Copyright 2013 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Common support code for Blockly apps.
 * @author fraser@google.com (Neil Fraser)
 */
"use strict";
var BlocklyApps = module.exports;
var msg = require('../build/en_us/i18n/common');
var dialog = require('./dialog');
var parseXmlElement = require('./xml').parseElement;
var codegen = require('./codegen');
var readonly = require('./readonly.hbs');

//TODO: These should be members of a BlocklyApp instance.
var onAttempt;
var onContinue;

/**
 * The parent directory of the apps. Contains common.js.
 */
BlocklyApps.BASE_URL = undefined;

/**
 * If the user presses backspace, stop propagation - this prevents blockly
 * from eating the backspace key
 * @param {!Event} e Keyboard event.
 */
var codeKeyDown = function(e) {
  if (e.keyCode == 8) {
    e.stopPropagation();
  }
};

/**
 * Common startup tasks for all apps.
 */
BlocklyApps.init = function(config) {
  if (!config) {
    config = {};
  }
  // Store configuration.
  onAttempt = config.onAttempt || function(report) {
    console.log('Attempt!');
    console.log(report);
  };
  onContinue = config.onContinue || function() {
    console.log('Continue!');
  };

  // Record time at initialization.
  BlocklyApps.initTime = new Date().getTime();

  // Fixes viewport for small screens.
  var viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && screen.availWidth < 725) {
    viewport.setAttribute('content',
        'width=725, initial-scale=.35, user-scalable=no');
  }
  
  if (config.level.editCode) {
    document.getElementById('codeTextbox').addEventListener('keydown',
        codeKeyDown, true);
    BlocklyApps.editCode = true;
  }
};

/**
 * @param {Object} options Configuration parameters for Blockly. Parameters are
 * optional and include:
 *  - {string} path The root path to the /blockly directory, defaults to the
 *    the directory in which this script is located.
 *  - {boolean} rtl True if the current language right to left.
 *  - {DomElement} toolbox The element in which to insert the toolbox,
 *    defaults to the element with 'toolbox'.
 *  - {boolean} trashcan True if the trashcan should be displayed, defaults to
 *    true.
 * @param {DomElement} div The parent div in which to insert Blockly.
 */
exports.inject = function(div, options) {
  if (!options) {
    options = {};
  }

  var finalOptions = {  // Defaults, to be overriden.
    path: BlocklyApps.BASE_URL,
    rtl: BlocklyApps.isRtl(),
    toolbox: document.getElementById('toolbox'),
    trashcan: true
  };
  for (var key in options) {
    finalOptions[key] = options[key];  // Override anything passed in.
  }
  Blockly.inject(div, finalOptions);
};

/**
 * Returns true if the current HTML page is in right-to-left language mode.
 */
BlocklyApps.isRtl = function() {
  return document.head.parentElement.getAttribute('dir') == 'rtl';
};

/**
 * Initialize Blockly for a readonly iframe.  Called on page load.
 * XML argument may be generated from the console with:
 * Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)).slice(5, -6)
 */
BlocklyApps.initReadonly = function(options) {
  Blockly.inject(document.getElementById('blockly'), {
    path: options.baseUrl,
    readOnly: true,
    rtl: BlocklyApps.isRtl(),
    scrollbars: false
  });
  BlocklyApps.loadBlocks(options.blocks);
};

/**
 * Load the editor with blocks.
 * @param {string} blocksXml Text representation of blocks.
 */
BlocklyApps.loadBlocks = function(blocksXml) {
  var xml = parseXmlElement(blocksXml);
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
};

/**
 *  Resizes the blockly workspace.
 */
BlocklyApps.onResize = function() {
  var blocklyDiv = document.getElementById('blockly');
  var visualization = document.getElementById('visualization');
  var codeTextbox = document.getElementById('codeTextbox');
  var top = visualization.offsetTop;
  var scrollY = window.pageYOffset;
  var svg = document.getElementById('svgMaze');

  // resize either blockly or codetextbox
  var div = BlocklyApps.editCode ? codeTextbox : blocklyDiv;
  
  var blocklyDivParent = blocklyDiv.parentNode;
  var parentStyle = window.getComputedStyle ?
                    window.getComputedStyle(blocklyDivParent) :
                    blocklyDivParent.currentStyle.width;  // IE
  var parentWidth = parseInt(parentStyle.width, 10);
  var parentHeight = window.innerHeight - parseInt(div.style.top, 10) +
    scrollY - 20;
  
  div.style.top = Math.max(top, scrollY) + 'px';
  div.style.width = (parentWidth - svg.clientWidth - 40) + 'px';
  div.style.height = parentHeight + 'px';
  div.style.marginLeft = (svg.clientWidth + 15) + 'px';
};

/**
 * Highlight the block (or clear highlighting).
 * @param {?string} id ID of block that triggered this action.
 */
BlocklyApps.highlight = function(id) {
  if (id) {
    var m = id.match(/^block_id_(\d+)$/);
    if (m) {
      id = m[1];
    }
  }
  Blockly.mainWorkspace.highlightBlock(id);
};

/**
 * If the user has executed too many actions, we're probably in an infinite
 * loop.  Sadly I wasn't able to solve the Halting Problem.
 * @param {?string} opt_id ID of loop block to highlight.
 * @throws {Infinity} Throws an error to terminate the user's program.
 */
BlocklyApps.checkTimeout = function(opt_id) {
  if (opt_id) {
    BlocklyApps.log.push([null, opt_id]);
  }
  if (BlocklyApps.ticks-- < 0) {
    throw Infinity;
  }
};

/**
 * Hide the dialog pop-up.
 * @param {boolean} opt_animate Animate the dialog closing.  Defaults to true.
 *     Requires that origin was not null when dialog was opened.
 */
BlocklyApps.hideDialog = function(opt_animate) {
  dialog.hide(opt_animate);
};

/**
 * Retrieve a string containing the user's generated Javascript code.
 */
BlocklyApps.getGeneratedCodeString = function() {
  if (BlocklyApps.editCode) {
    var codeTextbox = document.getElementById('codeTextbox');
    return (codeTextbox.innerText || codeTextbox.textContent);
  }
  else {
    return codegen.workspaceCode(Blockly);
  }
};

/**
 * Retrieve a DOM text node containing the user's generated Javascript code.
 */
BlocklyApps.getGeneratedCodeElement = function() {
  // Inject the code as a textNode, then extract with innerHTML, thus escaping.
  var unescapedCodeString = BlocklyApps.getGeneratedCodeString();
  var codeNode = document.createTextNode(unescapedCodeString);
  return codeNode;
};

 /**
  * Show the user's code in raw JavaScript in its own modal popup.
  * @param {Element} origin Animate the dialog opening/closing from/to this
  *     DOM element.  If null, don't show any animations for opening or closing.
  */
BlocklyApps.showGeneratedCode = function(origin) {
  var pre = document.getElementById('containerCode');
  pre.appendChild(BlocklyApps.getGeneratedCodeElement());
  var content = document.getElementById('dialogCode');
  var style = {
    width: '40%',
    left: '30%',
    top: '5em'
  };
  dialog.show(content, origin, true, true, style);
};

/**
 * Show the user's code in raw JavaScript in the feedback modal popup.
 * @param {Element} showLinkElement The link element from which the code display is triggered.
 */
BlocklyApps.showGeneratedCodeInFeedback = function(showLinkElement) {
  var pre = document.getElementById('generatedCodeContainer');
  pre.appendChild(BlocklyApps.getGeneratedCodeElement());
  pre.parentNode.style.display = 'block';
  showLinkElement.style.display = 'none';
};

/**
 * Reset the link to show generated code in the feedback modal popup.
 * @param {Element} showLinkElement The link element from which the code display is triggered.
 */
BlocklyApps.resetGeneratedCodeInFeedback = function(showLinkElement) {
  var pre = document.getElementById('generatedCodeContainer');
  pre.innerHTML = "";
  pre.parentNode.style.display = 'none';
  showLinkElement.style.display = 'block';
};

/**
 * On touch enabled browsers, add touch-friendly variants of event handlers
 * for elements such as buttons whose event handlers are specified in the
 * markup. For example, ontouchend is treated as equivalent to onclick.
 */
BlocklyApps.addTouchEvents = function() {
  // Do nothing if the browser doesn't support touch.
  if (!('ontouchstart' in document.documentElement)) {
    return;
  }
  // Treat ontouchend as equivalent to onclick for buttons.
  var buttons = document.getElementsByTagName('button');
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    if (!button.ontouchend) {
      button.ontouchend = button.onclick;
    }
  }
};

// Add events for touch devices when the window is done loading.
window.addEventListener('load', BlocklyApps.addTouchEvents, false);

// The following properties get their non-default values set by the application.

/**
 * Whether to alert user to empty blocks, short-circuiting all other tests.
 */
BlocklyApps.CHECK_FOR_EMPTY_BLOCKS = undefined;

/**
 * The ideal number of blocks to solve this level.  Users only get 2
 * stars if they use more than this number.
 * @type {!number=}
 */
BlocklyApps.IDEAL_BLOCK_NUM = undefined;

/**
 * An array of dictionaries representing required blocks.  Keys are:
 * - test (required): A test whether the block is present, either:
 *   - A string, in which case the string is searched for in the generated code.
 *   - A single-argument function is called on each user-added block
 *     individually.  If any call returns true, the block is deemed present.
 *     "User-added" blocks are ones that are neither disabled or undeletable.
 * - type (required): The type of block to be produced for display to the user
 *   if the test failed.
 * - titles (optional): A dictionary, where, for each KEY-VALUE pair, this is
 *   added to the block definition: <title name="KEY">VALUE</title>.
 * - value (optional): A dictionary, where, for each KEY-VALUE pair, this is
 *   added to the block definition: <value name="KEY">VALUE</value>
 * - extra (optional): A string that should be blacked between the "block"
 *   start and end tags.
 * @type {!Array=}
 */
BlocklyApps.REQUIRED_BLOCKS = undefined;

/**
 * The number of required blocks to give hints about at any one time.
 * Set this to Infinity to show all.
 * @type {!number=}
 */
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = undefined;

/**
 * Flag indicating whether the last program run completed the level.
 * @type {?boolean}
 */
BlocklyApps.levelComplete = null;

/**
 * Transcript of user's actions.  The format is application-dependent.
 * @type {?Array.<Array>}
 */
BlocklyApps.log = null;

/**
 * The number of steps remaining before the currently running program
 * is deemed to be in an infinite loop and terminated.
 * @type {?number}
 */
BlocklyApps.ticks = null;

/**
 * The number of attempts (how many times the run button has been pressed)
 * @type {?number}
 */
BlocklyApps.attempts = 0;

/**
 * Stores the time at init. The delta to current time is used for logging
 * and reporting to capture how long it took to arrive at an attempt.
 * @type {?number}
 */
BlocklyApps.initTime = undefined;

/**
 * Reset the playing field to the start position and kill any pending
 * animation tasks.  This will benerally be replaced by an application.
 * @param {boolean} first True if an opening animation is to be played.
 */
BlocklyApps.reset = function(first) {};

/**
 * Enumeration of test results.
 * BlocklyApps.getTestResults() runs checks in the below order.
 * EMPTY_BLOCKS_FAIL can only occur if BlocklyApps.CHECK_FOR_EMPTY_BLOCKS true.
 */
BlocklyApps.TestResults = {
  NO_TESTS_RUN: -1,           // Default.
  FREE_PLAY: 0,               // 0 stars, try again or continue.
  EMPTY_BLOCK_FAIL: 1,        // 0 stars.
  TOO_FEW_BLOCKS_FAIL: 2,     // 0 stars.
  LEVEL_INCOMPLETE_FAIL: 3,   // 0 stars.
  MISSING_BLOCK_UNFINISHED: 4,// 0 star.
  MISSING_BLOCK_FINISHED: 10, // 1 star.
  OTHER_1_STAR_FAIL: 11,      // Application-specific 1-star failure.
  TOO_MANY_BLOCKS_FAIL: 20,   // 2 stars.
  OTHER_2_STAR_FAIL: 21,      // Application-specific 2-star failure.
  ALL_PASS: 100               // 3 stars.
};

/**
 * Updates the document's 'capacity' element's innerHTML with a message
 * indicating how many more blocks are permitted.  The capacity
 * is retrieved from Blockly.mainWorkspace.remainingCapacity().
 */
BlocklyApps.updateCapacity = function() {
  var cap = Blockly.mainWorkspace.remainingCapacity();
  var p = document.getElementById('capacity');
  if (cap == Infinity) {
    p.style.display = 'none';
  } else {
    p.style.display = 'inline';
    if (cap === 0) {
      p.innerHTML = msg.capacity0();
    } else if (cap === 1) {
      p.innerHTML = msg.capacity1();
    } else {
      cap = Number(cap);
      p.innerHTML = msg.capacity2().replace('%1', cap);
    }
  }
};

// Methods for determining and displaying feedback.

/**
 * Display feedback based on test results.  The test results must be
 * explicitly provided.
 * @param {{feedbackType: number}} Test results (a constant property of
 *     BlocklyApps.TestResults).
 */
BlocklyApps.displayFeedback = function(options) {
  BlocklyApps.hideFeedback();
  BlocklyApps.setLevelFeedback(options);
  BlocklyApps.prepareFeedback(options);
  BlocklyApps.displayCloseDialogButtons(options.feedbackType);
  BlocklyApps.showHelp(options.feedbackType);
};

/**
 * Check user's code for empty top-level blocks e.g. 'repeat'.
 * @return {boolean} true if block is empty (no blocks are nested inside).
 */
BlocklyApps.hasEmptyTopLevelBlocks = function() {
  var code = codegen.workspaceCode(Blockly);
  return (/\{\s*\}/).test(code);
};

/**
 * Check whether the user code has all the blocks required for the level.
 * @return {boolean} true if all blocks are present, false otherwise.
 */
BlocklyApps.hasAllRequiredBlocks = function() {
  return BlocklyApps.getMissingRequiredBlocks().length === 0;
};

/**
 * Get blocks that the user intends in the program, namely any that
 * are not disabled and can be deleted.
 * @return {Array<Object>} The blocks.
 */
BlocklyApps.getUserBlocks_ = function() {
  var allBlocks = Blockly.mainWorkspace.getAllBlocks();
  var blocks = allBlocks.filter(
      function(block) {
        return !block.disabled && block.isDeletable();
      });
  return blocks;
};

/**
 * Check to see if the user's code contains the required blocks for a level.
 * This never returns more than BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG.
 * @return {!Array} array of array of strings where each array of strings is
 * a set of blocks that at least one of them should be used. Each block is
 * represented as the prefix of an id in the corresponding template.soy.
 */
BlocklyApps.getMissingRequiredBlocks = function() {
  var missingBlocks = [];
  var code = null;  // JavaScript code, which is initalized lazily.
  if (BlocklyApps.REQUIRED_BLOCKS && BlocklyApps.REQUIRED_BLOCKS.length) {
    var blocks = BlocklyApps.getUserBlocks_();
    // For each list of required blocks
    // Keep track of the number of the missing block lists. It should not be
    // bigger than BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG
    var missingBlockNum = 0;
    for (var i = 0;
         i < BlocklyApps.REQUIRED_BLOCKS.length &&
             missingBlockNum < BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG;
         i++) {
      var tests = BlocklyApps.REQUIRED_BLOCKS[i];
      // For each of the test
      // If at least one of the tests succeeded, we consider the required block
      // is used
      var usedRequiredBlock = false;
      for (var testId = 0; testId < tests.length; testId++) {
        var test = tests[testId].test;
        if (typeof test === 'string') {
          if (!code) {
            code = Blockly.Generator.workspaceToCode('JavaScript');
          }
          if (code.indexOf(test) !== -1) {
            // Succeeded, moving to the next list of tests
            usedRequiredBlock = true;
            break;
          }
        } else if (typeof test === 'function') {
          if (blocks.some(test)) {
            // Succeeded, moving to the next list of tests
            usedRequiredBlock = true;
            break;
          }
        } else {
          window.alert('Bad test: ' + test);
        }
      }
      if (!usedRequiredBlock) {
        missingBlockNum++;
        missingBlocks = missingBlocks.concat(BlocklyApps.REQUIRED_BLOCKS[i]);
      }
    }
  }
  return missingBlocks;
};

/**
 * Counts the number of blocks used.  Blocks are only counted if they are
 * not disabled, are deletable, and match BlocklyApps.FREE_BLOCKS_FILTER,
 * if defined.
 * @return {number} Number of blocks used.
 */
BlocklyApps.getNumBlocksUsed = function() {
  if (BlocklyApps.editCode) {
    var codeLines = 0;
    // quick and dirty method to count non-blank lines that don't start with //
    var lines = BlocklyApps.getGeneratedCodeString().split("\n");
    for (var i = 0; i < lines.length; i++) {
      if ((lines[i].length > 1) && (lines[i][0] != '/' || lines[i][1] != '/')) {
        codeLines++;
      }
    }
    return codeLines;
  }
  var blocks = BlocklyApps.getUserBlocks_();
  if (!BlocklyApps.FREE_BLOCKS) {
    return blocks.length;
  }
  var count = 0;
  for (var i = 0; i < blocks.length; i++) {
    if (!blocks[i].type.match(BlocklyApps.FREE_BLOCKS)) {
      count++;
    }
  }
  return count;
};

/**
 * Runs the tests and returns results.
 * @return {number} The appropriate property of BlocklyApps.TestResults.
 */
BlocklyApps.getTestResults = function() {
  if (BlocklyApps.CHECK_FOR_EMPTY_BLOCKS &&
      BlocklyApps.hasEmptyTopLevelBlocks()) {
    return BlocklyApps.TestResults.EMPTY_BLOCK_FAIL;
  }
  if (!BlocklyApps.hasAllRequiredBlocks()) {
    if (BlocklyApps.levelComplete) {
      return BlocklyApps.TestResults.MISSING_BLOCK_FINISHED;
    } else {
      return BlocklyApps.TestResults.MISSING_BLOCK_UNFINISHED;
    }
  }
  var numBlocksUsed = BlocklyApps.getNumBlocksUsed();
  if (!BlocklyApps.levelComplete) {
    if (BlocklyApps.IDEAL_BLOCK_NUM &&
        numBlocksUsed < BlocklyApps.IDEAL_BLOCK_NUM) {
      return BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL;
    }
    return BlocklyApps.TestResults.LEVEL_INCOMPLETE_FAIL;
  }
  if (BlocklyApps.IDEAL_BLOCK_NUM &&
      numBlocksUsed > BlocklyApps.IDEAL_BLOCK_NUM) {
    return BlocklyApps.TestResults.TOO_MANY_BLOCKS_FAIL;
  } else {
    return BlocklyApps.TestResults.ALL_PASS;
  }
};

/**
 * Creates the XML for blocks to be displayed in a read-only frame.
 * @param {Array} blocks An array of blocks to display (with optional args).
 * @return {string} The generated string of XML.
 */
var generateXMLForBlocks = function(blocks) {
  var blockXMLStrings = [];
  var blockX = 10;  // Prevent left output plugs from being cut off.
  var blockY = 0;
  var blockXPadding = 200;
  var blockYPadding = 120;
  var blocksPerLine = 2;
  var iframeHeight = parseInt(document.getElementById('feedbackBlocks')
          .style.height, 10);
  var k, name;
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    blockXMLStrings.push('<block', ' type="', block.type, '" x="',
                        blockX.toString(), '" y="', blockY, '">');
    if (block.titles) {
      var titleNames = Object.keys(block.titles);
      for (k = 0; k < titleNames.length; k++) {
        name = titleNames[k];
        blockXMLStrings.push('<title name="', name, '">',
                            block.titles[name], '</title>');
      }
    }
    if (block.values) {
      var valueNames = Object.keys(block.values);
      for (k = 0; k < valueNames.length; k++) {
        name = valueNames[k];
        blockXMLStrings.push('<value name="', name, '">',
                            block.values[name], '</value>');
      }
    }
    if (block.extra) {
      blockXMLStrings.push(block.extra);
    }
    blockXMLStrings.push('</block>');
    if ((i + 1) % blocksPerLine === 0) {
      blockY += blockYPadding;
      iframeHeight += blockYPadding;
      blockX = 0;
    } else {
      blockX += blockXPadding;
    }
    document.getElementById('feedbackBlocks').style.height =
        iframeHeight + 'px';
  }
  return blockXMLStrings.join('');
};

var showFeedbackBlocks = function(options) {
  var missingBlocks = BlocklyApps.getMissingRequiredBlocks();
  if (missingBlocks.length === 0) {
    return;
  }
  document.getElementById('missingBlocksError').style.display = 'block';
  var html = readonly({
    baseUrl: BlocklyApps.BASE_URL,
    app: options.app,
    skinId: options.skin,
    blocks: generateXMLForBlocks(missingBlocks)
  });
  // Fill in the iframe on the next event tick.
  window.setTimeout(function() {
    var iframe = document.getElementById('feedbackBlocks');
    iframe.style.display = 'block';
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }, 1);
};

/**
 * Sets appropriate feedback for when the modal dialog is displayed.
 * @param {number} feedbackType A constant property of BlocklyApps.TestResults,
 *     typically produced by BlocklyApps.getTestResults().
 */
BlocklyApps.setLevelFeedback = function(options) {
  switch (options.feedbackType) {
    // Give hint, not stars, for empty block or not finishing level.
    case BlocklyApps.TestResults.EMPTY_BLOCK_FAIL:
      document.getElementById('emptyBlocksError').style.display = 'block';
      break;
    case BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL:
      document.getElementById('tooFewBlocksError').style.display = 'block';
      break;
    case BlocklyApps.TestResults.LEVEL_INCOMPLETE_FAIL:
      document.getElementById('levelIncompleteError')
          .style.display = 'block';
      break;

    // For completing level, user gets at least one star.
    case BlocklyApps.TestResults.OTHER_1_STAR_FAIL:
      document.getElementById('appSpecificOneStarFeedback')
            .style.display = 'block';
      break;
    // Zero star for failing to use required blocks and not completed level.
    case BlocklyApps.TestResults.MISSING_BLOCK_UNFINISHED:
      showFeedbackBlocks(options);
      break;
    // One star for failing to use required blocks but only if level completed.
    case BlocklyApps.TestResults.MISSING_BLOCK_FINISHED:
      showFeedbackBlocks(options);
      break;

    // Two stars for using too many blocks.
    case BlocklyApps.TestResults.TOO_MANY_BLOCKS_FAIL:
      BlocklyApps.setTextForElement(
          'tooManyBlocksError',
          msg.numBlocksNeeded().replace(
              '%1', BlocklyApps.IDEAL_BLOCK_NUM).replace(
                  '%2', BlocklyApps.getNumBlocksUsed())).style.display =
                      'block';
      break;
    case BlocklyApps.TestResults.OTHER_2_STAR_FAIL:
      document.getElementById('appSpecificTwoStarFeedback')
            .style.display = 'block';
      break;

    // Three stars!
    case BlocklyApps.TestResults.ALL_PASS:
      break;

    // Free plays
    case BlocklyApps.TestResults.FREE_PLAY:
      document.getElementById('reinfFeedbackMsg').style.display = 'block';
      break;
  }
  if (BlocklyApps.canContinueToNextLevel(options.feedbackType)) {
    BlocklyApps.resetGeneratedCodeInFeedback(document.getElementById('showLinesOfCodeLink'));
    document.getElementById('generatedCodeInfoContainer').style.display = 'inline';
    BlocklyApps.setTextForElement('linesOfCodeFeedbackMsg', msg.numLinesOfCodeWritten({numLines: BlocklyApps.getNumBlocksUsed()}));
    BlocklyApps.setTextForElement('showLinesOfCodeLink', msg.showGeneratedCode());
    BlocklyApps.setTextForElement('generatedCodeInfoMsg', BlocklyApps.editCode ?
        "" : msg.generatedCodeInfo());
  }
};

/**
 * Determines whether the user can proceed to the next level, based on the level feedback
 * @param {number} feedbackType A constant property of BlocklyApps.TestResults,
 *     typically produced by BlocklyApps.getTestResults().
 */
BlocklyApps.canContinueToNextLevel = function(feedbackType) {
  return (feedbackType === BlocklyApps.TestResults.ALL_PASS ||
    feedbackType === BlocklyApps.TestResults.TOO_MANY_BLOCKS_FAIL ||
    feedbackType ===  BlocklyApps.TestResults.OTHER_2_STAR_FAIL ||
    feedbackType ===  BlocklyApps.TestResults.FREE_PLAY);
};

/**
 * Report back to the server, if available.
 * @param {string} app The name of the application.
 * @param {number} id A unique identifier generated when the page was loaded.
 * @param {string} levelId The ID of the current level.
 * @param {number} result An indicator of the success of the code.
 * @param {number} testResult More specific data on success or failure of code.
 * @param {string} program The user program, which will get URL-encoded.
 */
BlocklyApps.report = function(app, levelId, result, testResult, program) {
  var report = {
    app: app,
    level: levelId,
    result: result,
    testResult: testResult,
    program: encodeURIComponent(program),
    attempt: BlocklyApps.attempts,
    time: ((new Date().getTime()) - BlocklyApps.initTime)
  };
  onAttempt(report);
};

/**
 * Prepare feedback to display after the user's program has finished running.
 * Specifically, set colours and buttons of feedback added through
 * BlocklyApps.displayFeedback();
 * @param {number} options.feedbackType A constant property of BlocklyApps.TestResults.
 */
BlocklyApps.prepareFeedback = function(options) {
  if (!options) {
    options = {};
  }
  // Determine buttons.
  if (options.feedbackType == BlocklyApps.TestResults.ALL_PASS) {
    document.getElementById('hintTitle').style.display = 'none';
    if (options.finalLevel) {
      document.getElementById('finalLevelMsg').style.display = 'block';
    } else {
      document.getElementById('nextLevelMsg').style.display = 'block';
    }
  } else {
    document.getElementById('hintTitle').style.display = 'inline';
  }
  document.getElementById('levelFeedbackText').style.display = 'inline';
};

/**
 * Hide end of level feedback.
 */
BlocklyApps.hideFeedback = function() {
  document.getElementById('levelFeedbackText').style.display = 'none';
  var feedbackArray = document.querySelectorAll('.feedback');
  for (var i = 0; i < feedbackArray.length; i++) {
    var feedback = feedbackArray[i];
    feedback.style.display = 'none';
  }
  document.getElementById('tryAgainButton').style.display = 'none';
  document.getElementById('continueButton').style.display = 'none';
};

/**
 * Hide the feedback dialog and raise the continue event.
 */
BlocklyApps.continueClicked = function() {
  BlocklyApps.hideDialog(false);
  onContinue();
};

/**
 * Close the dialog so the user can try again.
 */
BlocklyApps.tryAgainClicked = function() {
  BlocklyApps.hideDialog(true);
};

/**
 * Show the close dialog buttons depending on the state of the level.
 * @param {number} feedbackType The results of block tests.
 */
BlocklyApps.displayCloseDialogButtons = function(feedbackType) {
  var continueButton = document.getElementById('continueButton');
  var tryAgainButton = document.getElementById('tryAgainButton');
  var returnToLevelButton = document.getElementById('returnToLevelButton');
  if (BlocklyApps.canContinueToNextLevel(feedbackType)) {
    continueButton.style.display = 'inline';
    returnToLevelButton.style.display = 'none';
    if (feedbackType === BlocklyApps.TestResults.ALL_PASS) {
      tryAgainButton.style.display = 'none';
    } else {
      tryAgainButton.style.display = 'inline';
    }
  } else {
    continueButton.style.display = 'none';
    if (feedbackType === BlocklyApps.TestResults.MISSING_BLOCK_FINISHED ||
      feedbackType === BlocklyApps.TestResults.OTHER_1_STAR_FAIL) {
      tryAgainButton.style.display = 'inline';
      returnToLevelButton.style.display = 'none';
    } else {
      returnToLevelButton.style.display = 'block';
      tryAgainButton.style.display = 'none';
    }
  }
};

/**
 * Click the reset button.  Reset the application.
 */
BlocklyApps.resetButtonClick = function() {
  document.getElementById('runButton').style.display = 'inline';
  document.getElementById('resetButton').style.display = 'none';
  Blockly.mainWorkspace.traceOn(false);
  BlocklyApps.reset(false);
};

/**
 * Show the help pop-up.
 * @param {number} feedbackType If defined, the results of end of level tests.
 */
BlocklyApps.showHelp = function(feedbackType) {
  feedbackType = typeof feedbackType !== 'undefined' ?
      feedbackType : BlocklyApps.NO_TESTS_RUN;
  var help = document.getElementById('help');

  var style = {
    width: '50%',
    right: '25%',
    top: '3em'
  };
  if (document.getElementById('reinfMsg')) {
    var reinfMSG = document.getElementById('reinfMsg').innerHTML.match(/\S/);
    var interstitial = document.getElementById('interstitial').style.display;
    if (reinfMSG && interstitial == 'none') {
      BlocklyApps.showInterstitial();
    }
  }
  BlocklyApps.displayCloseDialogButtons(feedbackType);
  dialog.show(help, null, false, true, style);
};

/**
 * Place text in the specified element, if found.  This eliminates
 * any other children of the element and creates a child text node.
 * @param {string} id The identifier of the element.
 * @param {string} text The text to display.
 * @return {Object} The element.
 */
BlocklyApps.setTextForElement = function(id, text) {
  var element = document.getElementById(id);
  if (element) {
    element.innerHTML = '';  // Remove existing children or text.
    element.appendChild(document.createTextNode(text));
  }
  return element;
};

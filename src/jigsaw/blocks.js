/**
 * Blockly App: Bounce
 *
 * Copyright 2013 Code.org
 *
 */
'use strict';

var msg = require('../../locale/current/Jigsaw');

var patterns = [];

/**
 * Add an svg pattern for the given image. If document is not yet fully loaded,
 * it will add to pattern to a list for later.
 *
 * @param {string} id Pattern name
 * @param {string} imagePath Url of the image
 * @param {number} width Width of the image
 * @param {number} height Height of the image
 * @param {number|function} offsetX Offset of the image to start pattern
 * @param {number|function} offsetY Offset of the image to start pattern
 */
var addPattern = function (id, imagePath, width, height, offsetX, offsetY) {
  var x, y, pattern, patternImage;

  if (document.readyState != "complete") {
    // queue it up
    patterns.push({
      id: id,
      imagePath: imagePath,
      width: width,
      height: height,
      offsetX: offsetX,
      offsetY: offsetY
    });
  } else {
    x = typeof(offsetX) === "function" ? -offsetX() : -offsetX;
    y = typeof(offsetY) === "function" ? -offsetY() : -offsetY;
    pattern = Blockly.createSvgElement('pattern', {
      id: id,
      patternUnits: 'userSpaceOnUse',
      width: "100%",
      height: "100%",
      x: x,
      y: y
    }, document.getElementById('blocklySvgDefs'));
    patternImage = Blockly.createSvgElement('image', {
      width: width,
      height: height
    }, pattern);
    patternImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      imagePath);
  }

  return id;
};

/**
 * Add all the svg patterns we've queued up.
 */
var addQueuedPatterns = function () {
  if (document.readyState !== "complete") {
    throw new Error('Should only add queued patterns after fully loaded');
  }
  for (var i = 0; i < patterns.length; i++) {
    var pattern = patterns[i];
    addPattern(pattern.id, pattern.imagePath, pattern.width, pattern.height,
      pattern.offsetX, pattern.offsetY);
  }
  patterns = [];
};

/**
 * Search the workspace for a block of the given type
 *
 * @param {string} type The type of the block to search for
 */
var blockOfType = function (type) {
  var blocks = Blockly.mainWorkspace.getAllBlocks();
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].type === type) {
      return blocks[i];
    }
  }
  return null;
};

/**
 * Get the height of the main portion of the block, ignoring the heighted added
 * by the bottom notch, if it exists
 *
 * @param {string} type The type of the block to search for
 */
var blockHeight = function (type) {
  var block = blockOfType(type);
  var height = block.getHeightWidth().height;
  if (block.nextConnection) {
    var notchHeight = Blockly.BlockSvg.NOTCH_PATH_LEFT.split(' ')[1].split(',')[1];
    height -= notchHeight;
  }
  return height
};

/**
 * Get the width of the block of the given type
 *
 * @param {string} type The type of the block to search for
 */
var blockWidth = function (type) {
  return blockOfType(type).getHeightWidth().width;
};

// Install extensions to Blockly's language and JavaScript generator.
exports.install = function(blockly, skin) {
  // don't add patterns until ready
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      addQueuedPatterns();
      clearInterval(readyStateCheckInterval);
    }
  }, 10);

  level1(blockly, skin);

  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

function level1(blockly, skin) {
  var img = skin.image1;
  var imgWidth = 300;
  var imgHeight = 300;

  var title = "                                                                     ";

  blockly.Blocks.jigsaw_one = {
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(title);
      this.appendDummyInput();
      this.appendDummyInput();
      this.appendDummyInput();
      this.setPreviousStatement(false);
      this.setNextStatement(true);
      this.setFillPattern(
        addPattern('backgroundImage1', img, imgWidth, imgHeight, 0, 0));
    }
  };

  blockly.Blocks.jigsaw_two = {
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(title);
      this.appendDummyInput();
      this.appendDummyInput();
      this.appendDummyInput();
      this.setPreviousStatement(true);
       this.setNextStatement(true);
      this.setFillPattern(addPattern('backgroundImage2', img,
        imgWidth, imgHeight, 0, blockHeight('jigsaw_one')));
    }
  };

  var jigsaw1And2Height = function () {
    return blockHeight('jigsaw_one') + blockHeight('jigsaw_two');
  };

  blockly.Blocks.jigsaw_four = {
    helpUrl: '',
    init: function () {
      this.setHSV(140, 1.00, 0.74);
      this.appendDummyInput()
        .appendTitle(title);
      this.appendDummyInput();
      this.appendDummyInput();
      this.appendDummyInput();
      this.setPreviousStatement(true);
      this.setNextStatement(false);
      this.setFillPattern(addPattern('backgroundImage4', img,
        imgWidth, imgHeight, 0, jigsaw1And2Height));
    }
  };
}

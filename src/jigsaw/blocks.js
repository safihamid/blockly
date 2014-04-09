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

  var existingBlocks = Object.keys(blockly.Blocks);

  generateBlocksForLevel(blockly, skin, {
     image: skin.smiley,
     width: 200,
     height: 200,
     numBlocks: 2,
     level: 1
   });

  generateBlocksForLevel(blockly, skin, {
     image: skin.smiley,
     width: 300,
     height: 300,
     numBlocks: 3,
     level: 2
   });

  generateBlocksForLevel(blockly, skin, {
     image: skin.smiley,
     width: 200,
     height: 200,
     numBlocks: 2,
     level: 3
   });

  generateBlocksForLevel(blockly, skin, {
     image: skin.smiley,
     width: 250,
     height: 250,
     numBlocks: 5,
     level: 4
   });

  // Go through all added blocks, and add empty generators for those that
  // weren't already given generators
  var generator = blockly.Generator.get('JavaScript');
  blockly.JavaScript = generator;
  Object.keys(blockly.Blocks).forEach(function (block) {
    if (existingBlocks.indexOf(block) === -1 && !generator[block]) {
      generator[block] = function () {
        return '\n';
      };
    }
  });

  delete blockly.Blocks.procedures_defreturn;
  delete blockly.Blocks.procedures_ifreturn;
};

function generateBlocksForLevel(blockly, skin, options) {
  var image = options.image;
  var width = options.width;
  var height = options.height;
  var numBlocks = options.numBlocks;
  var level = options.level;

  var blockHeight = height / numBlocks;
  var titleWidth = width - 20;
  var titleHeight = blockHeight - 10;

  var letters = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (var i = 1; i <= numBlocks; i++) {
    (function (blockNum) {
      var blockName = 'jigsaw_' + level + letters[blockNum];
      var patternName = 'pat_' + level + letters[blockNum];
      blockly.Blocks[blockName] = {
        helpUrl: '',
        init: function () {
          this.setHSV(0, 1.00, 0.98);
          this.appendDummyInput()
            .appendTitle(new blockly.FieldImage(skin.blank, titleWidth, titleHeight));
          this.setPreviousStatement(blockNum !== 1);
          this.setNextStatement(blockNum !== numBlocks);
          this.setFillPattern(
            addPattern(patternName, image, width, height, 0,
              blockHeight * (blockNum - 1)));
        }
      };
    })(i);
  }
}

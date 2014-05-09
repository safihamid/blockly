var xml = require('./xml');

exports.shallowCopy = function(source) {
  var result = {};
  for (var prop in source) {
    result[prop] = source[prop];
  }

  return result;
};

/**
 * Returns a new object with the properties from defaults overriden by any
 * properties in options. Leaves defaults and options unchanged.
 */
exports.extend = function(defaults, options) {
  var finalOptions = exports.shallowCopy(defaults);
  for (var prop in options) {
    finalOptions[prop] = options[prop];
  }

  return finalOptions;
};

exports.escapeHtml = function(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Version of modulo which, unlike javascript's `%` operator,
 * will always return a positive remainder.
 * @param number
 * @param mod
 */
exports.mod = function(number, mod) {
  return ((number % mod) + mod) % mod;
};

/**
 * Generates an array of integers from start to end inclusive
 */
exports.range = function(start, end) {
  var ints = [];
  for (var i = start; i <= end; i++) {
    ints.push(i);
  }
  return ints;
};

exports.parseRequiredBlocks = function(blocks, blockDefinitions) {
  var blocksXml = xml.parseElement(blocks);

  var parsedBlocks = [];
  for (var i = 0; i < blocksXml.children.length; i++) {
    var block = blocksXml.children[i];
    for (var blockTest in blockDefinitions) {
      if (blockList[blockTest].type === block.getAttribute('type')) {
        parsedBlocks.push([blockList[blockTest]]);  // Test blocks get wrapped in an array.
      }
    };
  };

  return parsedBlocks;
};

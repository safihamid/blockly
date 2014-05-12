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

// Returns an array of required blocks by comparing a list of blocks with
// a list of app specific block tests (defined in <app>/requiredBlocks.js)
exports.parseRequiredBlocks = function(requiredBlocks, blockTests) {
  var blocksXml = xml.parseElement(requiredBlocks);

  var blocks = [];
  Array.prototype.forEach.call(blocksXml.children, function(block) {
    for (var testKey in blockTests) {
      var test = blockTests[testKey];
      if (typeof test === 'function') { test = test(); }
      if (test.type === block.getAttribute('type')) {
        blocks.push([test]);  // Test blocks get wrapped in an array.
        break;
      }
    }
  });

  return blocks;
};

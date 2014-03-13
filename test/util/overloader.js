/**
 * Wraps require to do path replacement so that we can require files in our
 * src directory, and still properly require descendants
 */

var Module = require('module');

function Overloader(baseDir, mapping, context) {
  this.baseDir = baseDir;
  this.mapping = mapping;
  this.verbose = false;
  this.context = context;
};

Overloader.prototype.clearMap = function () {
  this.mapping = [];
};

Overloader.prototype.addMapping = function (search, replace) {
  this.mapping.push({search: search, replace: replace});
};

Overloader.prototype.require = function (path) {
  var self = this;

  // store actual require
  var originalRequire = Module.prototype.require;

  // wrap require with our mapped version
  Module.prototype.require = function (path) {
    if (path === 'messageformat') {
      debugger;
    }

    var mappedPath = path;
    self.mapping.forEach(function (pair) {
      mappedPath = mappedPath.replace(pair.search, pair.replace);
    });
    mappedPath = self.baseDir + mappedPath;

    if (exports.verbose) {
      console.log("mapped " + path + " to " + mappedPath);
    }

    return originalRequire.call(self.context, path[0] === '.' ? mappedPath : path);
  };

  // call our mapped version
  var module = require(path);

  // restore unmapped versin
  Module.prototype.require = originalRequire;

  // return the module we got
  return module;
};

module.exports = Overloader;



/*
// Behave as if we're doing our requires from src dir
var basePath = '../src/';

exports.verbose = false;

exports.clearMap = function () {
  map = [];
};

exports.addMapping = function (search, replace) {
  map.push({search: search, replace: replace});
};

exports.require = function (path) {
  // store actual require
  var originalRequire = Module.prototype.require;

  // wrap require with our mapped version
  Module.prototype.require = function(path) {
    var mappedPath = path;
    map.forEach(function (pair) {
      mappedPath = mappedPath.replace(pair.search, pair.replace);
    });
    if (mappedPath[0] === '.') {
      mappedPath = basePath + mappedPath;
    }

    if (exports.verbose) {
      console.log("mapped " + path + " to " + mappedPath);
    }

    return originalRequire(mappedPath);
  };

  // call our mapped version
  var module = require(path);

  // restore unmapped versin
  Module.prototype.require = originalRequire;

  // return the module we got
  return module;
};
*/

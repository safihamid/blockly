var appMain = require('../appMain');
window.Maze = require('./wordsearch');
if (typeof global !== 'undefined') {
  global.Maze = window.Maze;
}
var blocks = require('./blocks');
var levels = require('./levels');
var skins = require('./skins');

window.wordsearchMain = function(options) {
  options.skinsModule = skins;
  options.blocksModule = blocks;
  appMain(window.Maze, levels, options);
};

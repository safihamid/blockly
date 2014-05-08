var appMain = require('../appMain');
window.Maze = require('./maze');
if (typeof global !== 'undefined') {
  global.Maze = window.Maze;
}
var blocks = require('./blocks');
var levels = require('./levels');
var skins = require('./skins');
var reqBlocks = require('./requiredBlocks');

window.mazeMain = function(options) {
  options.skinsModule = skins;
  options.blocksModule = blocks;

  appMain(window.Maze, levels, options, reqBlocks);
};

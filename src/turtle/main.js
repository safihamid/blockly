var appMain = require('../appMain');
window.Turtle = require('./turtle');
var blocks = require('./blocks');
var skins = require('../skins');
var levels = require('./levels');
var requiredBlocks = require('./requiredBlocks');

window.turtleMain = function(options) {
  options.skinsModule = skins;
  options.blocksModule = blocks;
  appMain(window.Turtle, levels, options, requiredBlocks);
};

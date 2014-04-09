/**
 * Load Skin for Jigsaw.
 */
// background: Number of 400x400 background images. Randomly select one if
// specified, otherwise, use background.png.
// graph: Colour of optional grid lines, or false.

var skinsBase = require('../skins');

var CONFIGS = {

  jigsaw: {
  }

};

exports.load = function(assetUrl, id) {
  var skin = skinsBase.load(assetUrl, id);
  var config = CONFIGS[skin.id];

  skin.smiley = skin.assetUrl('smiley.png');
  skin.artist = skin.assetUrl('artist.png');

  skin.blank = skin.assetUrl('blank.png');

  // Settings
  skin.graph = config.graph;
  skin.background = skin.assetUrl('background.png');

  return skin;
};

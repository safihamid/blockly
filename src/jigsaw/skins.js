/**
 * Load Skin for Jigsaw.
 */

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
  skin.blocks = skin.assetUrl('blocks.png');

  skin.blank = skin.assetUrl('blank.png');

  // Settings
  skin.graph = config.graph;
  skin.background = skin.assetUrl('background.png');

  return skin;
};

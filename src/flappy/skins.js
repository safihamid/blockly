/**
 * Load Skin for Flappy.
 */
// tiles: A 250x200 set of 20 map images.
// goal: A 20x34 goal image.
// background: Number of 400x400 background images. Randomly select one if
// specified, otherwise, use background.png.
// graph: Colour of optional grid lines, or false.

var skinsBase = require('../skins');

var CONFIGS = {

  flappy: {
    transparentTileEnding: true,
    nonDisappearingPegmanHittingObstacle: true,
    additionalSound: true,
    background: 4
  }

};

exports.load = function(assetUrl, id) {
  var skin = skinsBase.load(assetUrl, id);
  var config = CONFIGS[skin.id];
  // Images
  skin.tiles = skin.assetUrl('tiles.png');
  skin.goal = skin.assetUrl('goal.png');
  skin.goalSuccess = skin.assetUrl('goal_success.png');
  skin.goalAnimation = skin.assetUrl('goal.gif');
  skin.obstacle = skin.assetUrl('obstacle.png');
  skin.obstacleAnimation = skin.assetUrl('obstacle.gif');
  if (config.transparentTileEnding) {
    skin.transparentTileEnding = true;
  } else {
    skin.transparentTileEnding = false;
  }
  if (config.nonDisappearingPegmanHittingObstacle) {
    skin.nonDisappearingPegmanHittingObstacle = true;
  } else {
    skin.nonDisappearingPegmanHittingObstacle = false;
  }
  skin.obstacleScale = config.obstacleScale || 1.0;
  skin.largerObstacleAnimationTiles =
      skin.assetUrl(config.largerObstacleAnimationTiles);
  skin.hittingWallAnimation =
      skin.assetUrl(config.hittingWallAnimation);
  skin.approachingGoalAnimation =
      skin.assetUrl(config.approachingGoalAnimation);
  // Sounds
  skin.obstacleSound =
      [skin.assetUrl('obstacle.mp3'), skin.assetUrl('obstacle.ogg')];
  skin.wallSound = [skin.assetUrl('wall.mp3'), skin.assetUrl('wall.ogg')];
  skin.winGoalSound = [skin.assetUrl('win_goal.mp3'),
                       skin.assetUrl('win_goal.ogg')];
  skin.wall0Sound = [skin.assetUrl('wall0.mp3'), skin.assetUrl('wall0.ogg')];
  skin.wall1Sound = [skin.assetUrl('wall1.mp3'), skin.assetUrl('wall1.ogg')];
  skin.wall2Sound = [skin.assetUrl('wall2.mp3'), skin.assetUrl('wall2.ogg')];
  skin.wall3Sound = [skin.assetUrl('wall3.mp3'), skin.assetUrl('wall3.ogg')];
  skin.wall4Sound = [skin.assetUrl('wall4.mp3'), skin.assetUrl('wall4.ogg')];
  skin.additionalSound = config.additionalSound;
  // Settings
  skin.graph = config.graph;
  if (config.background !== undefined) {
    var index = Math.floor(Math.random() * config.background);
    skin.background = skin.assetUrl('background' + index + '.png');
  } else {
    skin.background = skin.assetUrl('background.png');
  }
  skin.pegmanHeight = config.pegmanHeight || 52;
  skin.pegmanWidth = config.pegmanWidth || 49;
  skin.pegmanYOffset = config.pegmanYOffset || 0;
  return skin;
};

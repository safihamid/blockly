/**
 * Load Skin for Bounce.
 */
// tiles: A 250x200 set of 20 map images.
// goal: A 20x34 goal image.
// background: Number of 400x400 background images. Randomly select one if
// specified, otherwise, use background.png.
// graph: Colour of optional grid lines, or false.
// look: Colour of sonar-like look icon.

var skinsBase = require('../skins');

var CONFIGS = {

  bounce: {
    look: '#FFF',
    transparentTileEnding: true,
    nonDisappearingPegmanHittingObstacle: true,
    background: 4,
    dirtSound: true
  }

};

exports.load = function(assetUrl, id) {
  var skin = skinsBase.load(assetUrl, id);
  var config = CONFIGS[skin.id];
  // Images
  skin.tiles = skin.assetUrl('tiles.png');
  skin.goal = skin.assetUrl('goal.png');
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
  skin.idlePegmanAnimation =
      skin.assetUrl(config.idlePegmanAnimation);
  skin.wallPegmanAnimation =
      skin.assetUrl(config.wallPegmanAnimation);
  skin.movePegmanAnimation =
      skin.assetUrl(config.movePegmanAnimation);
  skin.movePegmanAnimationSpeedScale =
      config.movePegmanAnimationSpeedScale || 1;
  // This is required when move pegman animation is set
  skin.movePegmanAnimationFrameNumber = config.movePegmanAnimationFrameNumber;
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
  skin.fillSound = [skin.assetUrl('fill.mp3'), skin.assetUrl('fill.ogg')];
  skin.digSound = [skin.assetUrl('dig.mp3'), skin.assetUrl('dig.ogg')];
  skin.additionalSound = config.additionalSound;
  skin.dirtSound = config.dirtSound;
  // Settings
  skin.graph = config.graph;
  skin.look = config.look;
  skin.dirt = skin.assetUrl('dirt.png');
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

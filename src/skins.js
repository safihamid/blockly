// avatar: A 1029x51 set of 21 avatar images.

exports.load = function(assetUrl, id) {
  var skinUrl = function(path) {
    if (path !== undefined) {
      return assetUrl('media/skins/' + id + '/' + path);
    } else {
      return null;
    }
  };
  var skin = {
    id: id,
    assetUrl: skinUrl,
    // Images
    avatar: skinUrl('avatar.png'),
    tiles: skinUrl('tiles.png'),
    goal: skinUrl('goal.png'),
    obstacle: skinUrl('obstacle.png'),
    smallStaticAvatar: skinUrl('small_static_avatar.png'),
    staticAvatar: skinUrl('static_avatar.png'),
    winAvatar: skinUrl('win_avatar.png'),
    failureAvatar: skinUrl('failure_avatar.png'),
    repeatImage: assetUrl('media/common_images/repeat-arrows.png'),
    leftArrow: assetUrl('media/common_images/move-west-arrow.png'),
    downArrow: assetUrl('media/common_images/move-south-arrow.png'),
    upArrow: assetUrl('media/common_images/move-north-arrow.png'),
    rightArrow: assetUrl('media/common_images/move-east-arrow.png'),
    leftJumpArrow: assetUrl('media/common_images/jump-west-arrow.png'),
    downJumpArrow: assetUrl('media/common_images/jump-south-arrow.png'),
    upJumpArrow: assetUrl('media/common_images/jump-north-arrow.png'),
    rightJumpArrow: assetUrl('media/common_images/jump-east-arrow.png'),
    shortLineDraw: assetUrl('media/common_images/draw-short-line-crayon.png'),
    longLineDraw: assetUrl('media/common_images/draw-long-line-crayon.png'),
    // Sounds
    startSound: [skinUrl('start.mp3'), skinUrl('start.ogg')],
    winSound: [skinUrl('win.mp3'), skinUrl('win.ogg')],
    failureSound: [skinUrl('failure.mp3'), skinUrl('failure.ogg')]
  };
  return skin;
};

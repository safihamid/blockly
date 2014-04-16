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
    leftArrow: skinUrl('left.png'),
    downArrow: skinUrl('down.png'),
    upArrow: skinUrl('up.png'),
    rightArrow: skinUrl('right.png'),
    leftJumpArrow: skinUrl('left_jump.png'),
    downJumpArrow: skinUrl('down_jump.png'),
    upJumpArrow: skinUrl('up_jump.png'),
    rightJumpArrow: skinUrl('right_jump.png'),
    shortLine: skinUrl('shortLine.png'),
    longLine: skinUrl('longLine.png'),
    // Sounds
    startSound: [skinUrl('start.mp3'), skinUrl('start.ogg')],
    winSound: [skinUrl('win.mp3'), skinUrl('win.ogg')],
    failureSound: [skinUrl('failure.mp3'), skinUrl('failure.ogg')]
  };
  return skin;
};


exports.SpriteSpeed = {
  VERY_SLOW: 0.04,
  SLOW: 0.06,
  NORMAL: 0.1,
  FAST: 0.15,
  VERY_FAST: 0.23
};

exports.random = function (values) {
  var key = Math.floor(Math.random() * values.length); 
  return values[key];
};

exports.setBackground = function (id, value) {
  BlocklyApps.highlight(id);
  Studio.setBackground(value);
};

exports.setSprite = function (id, spriteIndex, value) {
  BlocklyApps.highlight(id);
  Studio.setSprite(spriteIndex, value);
};

exports.saySprite = function (id, spriteIndex, text) {
  BlocklyApps.highlight(id);
  Studio.saySprite(spriteIndex, text);
};

exports.setBackground = function (id, value) {
  BlocklyApps.highlight(id);
  Studio.setBackground(value);
};

exports.setSpriteSpeed = function (id, spriteIndex, value) {
  BlocklyApps.highlight(id);
  Studio.sprite[spriteIndex].speed = value;
};

exports.playSound = function(id, soundName) {
  BlocklyApps.highlight(id);
  BlocklyApps.playAudio(soundName, {volume: 0.5});
};

exports.move = function(id, spriteIndex, dir) {
  BlocklyApps.highlight(id);
  Studio.moveSingle(spriteIndex, dir);
};

exports.moveDistance = function(id, spriteIndex, dir, distance) {
  BlocklyApps.highlight(id);
  Studio.moveDistance(spriteIndex, dir, distance);
};

exports.incrementScore = function(id, player) {
  BlocklyApps.highlight(id);
  if (player == "opponent") {
    Studio.opponentScore++;
  } else {
    Studio.playerScore++;
  }
  Studio.displayScore();
};

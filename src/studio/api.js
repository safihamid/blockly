var tiles = require('./tiles');
var Direction = tiles.Direction;
var SquareType = tiles.SquareType;

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

exports.moveLeft = function(id, spriteIndex) {
  BlocklyApps.highlight(id);
  Studio.sprite[spriteIndex].x -= Studio.sprite[spriteIndex].speed;
  if (Studio.sprite[spriteIndex].x < 0) {
    Studio.sprite[spriteIndex].x = 0;
  }
};

exports.moveRight = function(id, spriteIndex) {
  BlocklyApps.highlight(id);
  Studio.sprite[spriteIndex].x += Studio.sprite[spriteIndex].speed;
  if (Studio.sprite[spriteIndex].x > (Studio.COLS - 1)) {
    Studio.sprite[spriteIndex].x = Studio.COLS - 1;
  }
};

exports.moveUp = function(id, spriteIndex) {
  BlocklyApps.highlight(id);
  Studio.sprite[spriteIndex].y -= Studio.sprite[spriteIndex].speed;
  if (Studio.sprite[spriteIndex].y < 0) {
    Studio.sprite[spriteIndex].y = 0;
  }
};

exports.moveDown = function(id, spriteIndex) {
  BlocklyApps.highlight(id);
  Studio.sprite[spriteIndex].y += Studio.sprite[spriteIndex].speed;
  if (Studio.sprite[spriteIndex].y > (Studio.ROWS - 1)) {
    Studio.sprite[spriteIndex].y = Studio.ROWS - 1;
  }
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

var tiles = require('./tiles');
var Direction = tiles.Direction;
var SquareType = tiles.SquareType;

exports.PaddleSpeed = {
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

exports.setPaddle = function (id, value) {
  BlocklyApps.highlight(id);
  Studio.setPaddle(value);
};

exports.setBackground = function (id, value) {
  BlocklyApps.highlight(id);
  Studio.setBackground(value);
};

exports.setPaddleSpeed = function (id, value) {
  BlocklyApps.highlight(id);
  Studio.paddleSpeed = value;
};

exports.playSound = function(id, soundName) {
  BlocklyApps.highlight(id);
  BlocklyApps.playAudio(soundName, {volume: 0.5});
};

exports.moveLeft = function(id) {
  BlocklyApps.highlight(id);
  Studio.paddleX -= Studio.paddleSpeed;
  if (Studio.paddleX < 0) {
    Studio.paddleX = 0;
  }
};

exports.moveRight = function(id) {
  BlocklyApps.highlight(id);
  Studio.paddleX += Studio.paddleSpeed;
  if (Studio.paddleX > (Studio.COLS - 1)) {
    Studio.paddleX = Studio.COLS - 1;
  }
};

exports.moveUp = function(id) {
  BlocklyApps.highlight(id);
  Studio.paddleY -= Studio.paddleSpeed;
  if (Studio.paddleY < 0) {
    Studio.paddleY = 0;
  }
};

exports.moveDown = function(id) {
  BlocklyApps.highlight(id);
  Studio.paddleY += Studio.paddleSpeed;
  if (Studio.paddleY > (Studio.ROWS - 1)) {
    Studio.paddleY = Studio.ROWS - 1;
  }
};

exports.incrementOpponentScore = function(id) {
  BlocklyApps.highlight(id);
  Studio.opponentScore++;
  Studio.displayScore();
};

exports.incrementPlayerScore = function(id) {
  BlocklyApps.highlight(id);
  Studio.playerScore++;
  Studio.displayScore();
};

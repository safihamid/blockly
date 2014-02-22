var tiles = require('./tiles');
var Direction = tiles.Direction;
var SquareType = tiles.SquareType;

exports.FlapHeight = {
  VERY_SMALL: -6,
  SMALL: -8,
  NORMAL: -11,
  LARGE: -14,
  VERY_LARGE: -17
};

exports.LevelSpeed = {
  VERY_SLOW: 1,
  SLOW: 3,
  NORMAL: 4,
  FAST: 6,
  VERY_FAST: 8
};

exports.GapHeight = {
  VERY_SMALL: 50,
  SMALL: 75,
  NORMAL: 100,
  LARGE: 125,
  VERY_LARGE: 150
};

exports.setGround = function (id, value) {
  BlocklyApps.highlight(id);
  Flappy.setGround(value);
};

exports.setObstacle = function (id, value) {
  BlocklyApps.highlight(id);
  Flappy.setObstacle(value);
};

exports.setPlayer = function (id, value) {
  BlocklyApps.highlight(id);
  Flappy.setPlayer(value);
};

exports.setGapHeight = function (id, value) {
  BlocklyApps.highlight(id);
  Flappy.setGapHeight(value);
};

exports.setBackground = function (id, value) {
  BlocklyApps.highlight(id);
  Flappy.setBackground(value);
};

exports.setSpeed = function (id, value) {
  BlocklyApps.highlight(id);
  Flappy.SPEED = value;
};

exports.playSound = function(id, soundName) {
  BlocklyApps.highlight(id);
  BlocklyApps.playAudio(soundName, {volume: 0.5});
};

exports.flap = function (id, amount) {
  BlocklyApps.highlight(id);
  Flappy.avatarVelocity = amount || this.FlapHeight.NORMAL;
};

exports.endGame = function (id) {
  BlocklyApps.highlight(id);
  Flappy.gameState = Flappy.GameStates.ENDING;
}

exports.incrementPlayerScore = function(id) {
  BlocklyApps.highlight(id);
  Flappy.playerScore++;
  Flappy.displayScore();
};

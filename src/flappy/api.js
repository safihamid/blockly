var tiles = require('./tiles');
var Direction = tiles.Direction;
var SquareType = tiles.SquareType;

exports.setFlapHeight = function (id, value) {
  BlocklyApps.highlight(id);
  Flappy.FLAP_VELOCITY = value;
};

exports.setSpeed = function (id, value) {
  BlocklyApps.highlight(id);
  Flappy.SPEED = value;
};

exports.playSound = function(id, soundName) {
  BlocklyApps.highlight(id);
  BlocklyApps.playAudio(soundName, {volume: 0.5});
};

exports.flap = function (id) {
  BlocklyApps.highlight(id);
  Flappy.birdVelocity = Flappy.FLAP_VELOCITY;
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

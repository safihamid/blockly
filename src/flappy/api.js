var tiles = require('./tiles');
var Direction = tiles.Direction;
var SquareType = tiles.SquareType;

exports.playSound = function(id, soundName) {
  BlocklyApps.highlight(id);
  BlocklyApps.playAudio(soundName, {volume: 0.5});
};

exports.moveLeft = function(id) {
  BlocklyApps.highlight(id);
  Flappy.paddleX -= 0.1;
  if (Flappy.paddleX < 0) {
    Flappy.paddleX = 0;
  }
};

exports.moveRight = function(id) {
  BlocklyApps.highlight(id);
  Flappy.paddleX += 0.1;
  if (Flappy.paddleX > (Flappy.COLS - 1)) {
    Flappy.paddleX = Flappy.COLS - 1;
  }
};

exports.moveUp = function(id) {
  BlocklyApps.highlight(id);
  Flappy.paddleY -= 0.1;
  if (Flappy.paddleY < 0) {
    Flappy.paddleY = 0;
  }
};

exports.moveDown = function(id) {
  BlocklyApps.highlight(id);
  Flappy.paddleY += 0.1;
  if (Flappy.paddleY > (Flappy.ROWS - 1)) {
    Flappy.paddleY = Flappy.ROWS - 1;
  }
};

exports.incrementOpponentScore = function(id) {
  BlocklyApps.highlight(id);
  Flappy.opponentScore++;
  Flappy.displayScore();
};

exports.incrementPlayerScore = function(id) {
  BlocklyApps.highlight(id);
  Flappy.playerScore++;
  Flappy.displayScore();
};

exports.bounceBall = function(id) {
  BlocklyApps.highlight(id);

  var i;
  for (i = 0; i < Flappy.ballCount; i++) {
    if (Flappy.ballX[i] < 0) {
      Flappy.ballX[i] = 0;
      Flappy.ballD[i] = 2 * Math.PI - Flappy.ballD[i];
    } else if (Flappy.ballX[i] > (Flappy.COLS - 1)) {
      Flappy.ballX[i] = Flappy.COLS - 1;
      Flappy.ballD[i] = 2 * Math.PI - Flappy.ballD[i];
    }

    if (Flappy.ballY[i] < 0) {
      Flappy.ballY[i] = 0;
      Flappy.ballD[i] = Math.PI - Flappy.ballD[i];
    }

    var xPaddleBall = Flappy.ballX[i] - Flappy.paddleX;
    var yPaddleBall = Flappy.ballY[i] - Flappy.paddleY;
    var distPaddleBall = Flappy.calcDistance(xPaddleBall, yPaddleBall);

    if (distPaddleBall < tiles.PADDLE_BALL_COLLIDE_DISTANCE) {
      // paddle ball collision
      if (Math.cos(Flappy.ballD[i]) < 0) {
        // rather than just bounce the ball off a flat paddle, we offset the
        // angle after collision based on whether you hit the left or right side
        // of the paddle.  And then we cap the resulting angle to be in a
        // certain range of radians so the resulting angle isn't too flat
        var paddleAngleBias = (3 * Math.PI / 8) *
            (xPaddleBall / tiles.PADDLE_BALL_COLLIDE_DISTANCE);
        // Add 5 PI instead of PI to ensure that the resulting angle is positive
        // to simplify the ternary operation in the next statement
        Flappy.ballD[i] = ((Math.PI * 5) + paddleAngleBias - Flappy.ballD[i]) %
                           (Math.PI * 2);
        Flappy.ballD[i] = (Flappy.ballD[i] < Math.PI) ?
                            Math.min((Math.PI / 2) - 0.2, Flappy.ballD[i]) :
                            Math.max((3 * Math.PI / 2) + 0.2, Flappy.ballD[i]);
      }
    }
  }
};


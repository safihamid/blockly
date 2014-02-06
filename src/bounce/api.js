var tiles = require('./tiles');
var Direction = tiles.Direction;
var AngleDirection = tiles.AngleDirection;
var SquareType = tiles.SquareType;

exports.playSound = function(id) {
  BlocklyApps.highlight(id);
  BlocklyApps.playAudio('wall', {volume: 0.5});
};

exports.moveLeft = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleX -= 0.1;
  if (Bounce.paddleX < 0) {
    Bounce.paddleX = 0;
  }
};

exports.moveRight = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleX += 0.1;
  if (Bounce.paddleX > (Bounce.COLS - 1)) {
    Bounce.paddleX = Bounce.COLS - 1;
  }
};

exports.moveUp = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleY -= 0.1;
  if (Bounce.paddleY < 0) {
    Bounce.paddleY = 0;
  }
};

exports.moveDown = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleY += 0.1;
  if (Bounce.paddleY > (Bounce.ROWS - 1)) {
    Bounce.paddleY = Bounce.ROWS - 1;
  }
};

exports.bounceBall = function(id) {
  BlocklyApps.highlight(id);

  var i;
  for (i = 0; i < Bounce.ballCount; i++) {
    if (Bounce.ballX[i] < 0) {
      Bounce.ballX[i] = 0;
      Bounce.ballD[i] = (Bounce.ballD[i] == AngleDirection.NORTHWEST) ?
                          AngleDirection.NORTHEAST :
                          AngleDirection.SOUTHEAST;
    } else if (Bounce.ballX[i] > (Bounce.COLS - 1)) {
      Bounce.ballX[i] = Bounce.COLS - 1;
      Bounce.ballD[i] = (Bounce.ballD[i] == AngleDirection.NORTHEAST) ?
                          AngleDirection.NORTHWEST :
                          AngleDirection.SOUTHWEST;
    }

    if (Bounce.ballY[i] < 0) {
      Bounce.ballY[i] = 0;
      Bounce.ballD[i] = (Bounce.ballD[i] == AngleDirection.NORTHEAST) ?
                          AngleDirection.SOUTHEAST :
                          AngleDirection.SOUTHWEST;
    }

    var xPaddleBall = Bounce.ballX[i] - Bounce.paddleX;
    var yPaddleBall = Bounce.ballY[i] - Bounce.paddleY;
    var distPaddleBall = Bounce.calcDistance(xPaddleBall, yPaddleBall);
    
    if (distPaddleBall < tiles.PADDLE_BALL_COLLIDE_DISTANCE) {
      // paddle ball collision
      if ((Bounce.ballD[i] == AngleDirection.SOUTHEAST) ||
          (Bounce.ballD[i] == AngleDirection.SOUTHWEST)) {
        Bounce.ballD[i] = (Bounce.ballD[i] == AngleDirection.SOUTHEAST) ?
                        AngleDirection.NORTHEAST :
                        AngleDirection.NORTHWEST;
      }
    }
  }
};


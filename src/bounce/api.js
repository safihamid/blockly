var tiles = require('./tiles');
var Direction = tiles.Direction;
var SquareType = tiles.SquareType;

/**
 * Is there a path next to pegman?
 * @param {number} direction Direction to look
 *     (0 = forward, 1 = right, 2 = backward, 3 = left).
 * @param {?string} id ID of block that triggered this action.
 *     Null if called as a helper function in Maze.move().
 * @return {boolean} True if there is a path.
 */
var isPath = function(direction, id) {
  var effectiveDirection = Bounce.pegmanD + direction;
  var square;
  var command;
  switch (Bounce.constrainDirection4(effectiveDirection)) {
    case Direction.NORTH:
      square = Bounce.map[Bounce.pegmanY - 1] &&
               Bounce.map[Bounce.pegmanY - 1][Bounce.pegmanX];
      command = 'look_north';
      break;
    case Direction.EAST:
      square = Bounce.map[Bounce.pegmanY][Bounce.pegmanX + 1];
      command = 'look_east';
      break;
    case Direction.SOUTH:
      square = Bounce.map[Bounce.pegmanY + 1] &&
              Bounce.map[Bounce.pegmanY + 1][Bounce.pegmanX];
      command = 'look_south';
      break;
    case Direction.WEST:
      square = Bounce.map[Bounce.pegmanY][Bounce.pegmanX - 1];
      command = 'look_west';
      break;
  }
  if (id) {
    BlocklyApps.log.push([command, id]);
  }
  return square !== SquareType.WALL &&
         square !== SquareType.OBSTACLE &&
         square !== undefined;
};

/**
 * Attempt to move pegman forward or backward.
 * @param {number} direction Direction to move (0 = forward, 2 = backward).
 * @param {string} id ID of block that triggered this action.
 * @throws {true} If the end of the maze is reached.
 * @throws {false} If Pegman collides with a wall.
 */
var move = function(direction, id) {
  if (!isPath(direction, null)) {
    BlocklyApps.log.push(['fail_' + (direction ? 'backward' : 'forward'), id]);
    throw false;
  }
  // If moving backward, flip the effective direction.
  var effectiveDirection = Bounce.pegmanD + direction;
  var command;
  switch (Bounce.constrainDirection4(effectiveDirection)) {
    case Direction.NORTH:
      Bounce.pegmanY--;
      command = 'north';
      break;
    case Direction.EAST:
      Bounce.pegmanX++;
      command = 'east';
      break;
    case Direction.SOUTH:
      Bounce.pegmanY++;
      command = 'south';
      break;
    case Direction.WEST:
      Bounce.pegmanX--;
      command = 'west';
      break;
  }
  BlocklyApps.log.push([command, id]);
  Bounce.checkSuccess();
};

exports.moveForward = function(id) {
  move(0, id);
};

exports.playSound = function(id) {
  BlocklyApps.highlight(id);
  BlocklyApps.playAudio('wall', {volume: 0.5});
}

exports.moveLeft = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleX -= 0.05;
  if (Bounce.paddleX < 0) {
    Bounce.paddleX = 0;
  }
}

exports.moveRight = function(id) {
  BlocklyApps.highlight(id);
  Bounce.paddleX += 0.05;
  if (Bounce.paddleX > (Bounce.COLS - 1)) {
    Bounce.paddleX = Bounce.COLS - 1;
  }
}

exports.isWall = function(id) {
  return true;
};

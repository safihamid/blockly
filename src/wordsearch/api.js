var tiles = require('./tiles');
var Direction = tiles.Direction;
var MoveDirection = tiles.MoveDirection;
var TurnDirection = tiles.TurnDirection;
var SquareType = tiles.SquareType;

//TODO: This file should be void of logic like turtle/api.js
// Mentions of `Maze.` is bad.

/**
 * Is there a path next to pegman?
 * @param {number} direction Direction to look
 *     (0 = forward, 1 = right, 2 = backward, 3 = left).
 * @param {?string} id ID of block that triggered this action.
 *     Null if called as a helper function in Maze.move().
 * @return {boolean} True if there is a path.
 */
var isPath = function(direction, id) {
  var effectiveDirection = Maze.pegmanD + direction;
  var square;
  var command;
  switch (tiles.constrainDirection4(effectiveDirection)) {
    case Direction.NORTH:
      square = Maze.map[Maze.pegmanY - 1] &&
          Maze.map[Maze.pegmanY - 1][Maze.pegmanX];
      command = 'look_north';
      break;
    case Direction.EAST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX + 1];
      command = 'look_east';
      break;
    case Direction.SOUTH:
      square = Maze.map[Maze.pegmanY + 1] &&
          Maze.map[Maze.pegmanY + 1][Maze.pegmanX];
      command = 'look_south';
      break;
    case Direction.WEST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX - 1];
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
  var effectiveDirection = Maze.pegmanD + direction;
  var command;
  switch (tiles.constrainDirection4(effectiveDirection)) {
    case Direction.NORTH:
      Maze.pegmanY--;
      command = 'north';
      break;
    case Direction.EAST:
      Maze.pegmanX++;
      command = 'east';
      break;
    case Direction.SOUTH:
      Maze.pegmanY++;
      command = 'south';
      break;
    case Direction.WEST:
      Maze.pegmanX--;
      command = 'west';
      break;
  }
  BlocklyApps.log.push([command, id]);
  Maze.checkSuccess();
};

/**
 * Turn pegman left or right.
 * @param {number} direction Direction to turn (0 = left, 1 = right).
 * @param {string} id ID of block that triggered this action.
 */
var turn = function(direction, id) {
  if (direction == TurnDirection.RIGHT) {
    // Right turn (clockwise).
    Maze.pegmanD += TurnDirection.RIGHT;
    BlocklyApps.log.push(['right', id]);
  } else {
    // Left turn (counterclockwise).
    Maze.pegmanD += TurnDirection.LEFT;
    BlocklyApps.log.push(['left', id]);
  }
  Maze.pegmanD = tiles.constrainDirection4(Maze.pegmanD);
};

/**
 * Turn pegman towards a given direction, turning through stage front (south)
 * when possible.
 * @param {number} newDirection Direction to turn to (e.g., Direction.NORTH)
 * @param {string} id ID of block that triggered this action.
 */
var turnTo = function(newDirection, id) {
  var currentDirection = Maze.pegmanD;
  if (isTurnAround(currentDirection, newDirection)) {
    var shouldTurnCWToPreferStageFront = currentDirection - newDirection < 0;
    var relativeTurnDirection = shouldTurnCWToPreferStageFront ? TurnDirection.RIGHT : TurnDirection.LEFT;
    turn(relativeTurnDirection, id);
    turn(relativeTurnDirection, id);
  } else if (isRightTurn(currentDirection, newDirection)) {
    turn(TurnDirection.RIGHT, id);
  } else if (isLeftTurn(currentDirection, newDirection)) {
    turn(TurnDirection.LEFT, id);
  }
};

function isLeftTurn(direction, newDirection) {
  return newDirection === tiles.constrainDirection4(direction + TurnDirection.LEFT);
}

function isRightTurn(direction, newDirection) {
  return newDirection === tiles.constrainDirection4(direction + TurnDirection.RIGHT);
}

/**
 * Returns whether turning from direction to newDirection would be a 180° turn
 * @param {number} direction
 * @param {number} newDirection
 * @returns {boolean}
 */
function isTurnAround(direction, newDirection) {
  return Math.abs(direction - newDirection) == MoveDirection.BACKWARD;
}

function moveAbsoluteDirection(direction, id) {
  turnTo(direction, id);
  move(MoveDirection.FORWARD, id);
}

exports.moveForward = function(id) {
  move(MoveDirection.FORWARD, id);
};

exports.moveBackward = function(id) {
  move(MoveDirection.BACKWARD, id);
};

exports.moveNorth = function(id) {
  moveAbsoluteDirection(Direction.NORTH, id);
};

exports.moveSouth = function(id) {
  moveAbsoluteDirection(Direction.SOUTH, id);
};

exports.moveEast = function(id) {
  moveAbsoluteDirection(Direction.EAST, id);
};

exports.moveWest = function(id) {
  moveAbsoluteDirection(Direction.WEST, id);
};

exports.turnLeft = function(id) {
  turn(TurnDirection.LEFT, id);
};

exports.turnRight = function(id) {
  turn(TurnDirection.RIGHT, id);
};

exports.isPathForward = function(id) {
  return isPath(MoveDirection.FORWARD, id);
};
exports.noPathForward = function(id) {
  return !isPath(MoveDirection.FORWARD, id);
};

exports.isPathRight = function(id) {
  return isPath(MoveDirection.RIGHT, id);
};

exports.isPathBackward = function(id) {
  return isPath(MoveDirection.BACKWARD, id);
};

exports.isPathLeft = function(id) {
  return isPath(MoveDirection.LEFT, id);
};

exports.pilePresent = function(id) {
  var x = Maze.pegmanX;
  var y = Maze.pegmanY;
  return Maze.dirt_[y][x] > 0;
};

exports.holePresent = function(id) {
  var x = Maze.pegmanX;
  var y = Maze.pegmanY;
  return Maze.dirt_[y][x] < 0;
};

exports.currentPositionNotClear = function(id) {
  var x = Maze.pegmanX;
  var y = Maze.pegmanY;
  return Maze.dirt_[y][x] !== 0;
};

exports.fill = function(id) {
  BlocklyApps.log.push(['putdown', id]);
  var x = Maze.pegmanX;
  var y = Maze.pegmanY;
  Maze.dirt_[y][x] = Maze.dirt_[y][x] + 1;
};

exports.dig = function(id) {
  BlocklyApps.log.push(['pickup', id]);
  var x = Maze.pegmanX;
  var y = Maze.pegmanY;
  Maze.dirt_[y][x] = Maze.dirt_[y][x] - 1;
};

exports.notFinished = function() {
  return !Maze.checkSuccess();
};

'use strict';

/**
 * Constants for cardinal directions.  Subsequent code assumes these are
 * in the range 0..3 and that opposites have an absolute difference of 2.
 * @enum {number}
 */
exports.Direction = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3
};

/**
 * The types of squares in the maze, which is represented
 * as a 2D array of SquareType values.
 * @enum {number}
 */
exports.SquareType = {
  WALL: 0,
  OPEN: 1,
  START: 2,
  FINISH: 3,
  OBSTACLE: 4,
  STARTANDFINISH: 5
};

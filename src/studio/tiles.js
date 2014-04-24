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

exports.Emotions = {
  NORMAL: 0,
  HAPPY: 1,
  ANGRY: 2,
  SAD: 3,
};

exports.FINISH_COLLIDE_DISTANCE = 1.5;
exports.SPRITE_COLLIDE_DISTANCE = 1.5;
exports.DEFAULT_SPRITE_SPEED = 0.1;

/**
 * The types of squares in the maze, which is represented
 * as a 2D array of SquareType values.
 * @enum {number}
 */
exports.SquareType = {
  OPEN: 0,
  SPRITE0FINISH: 1,
  SPRITESTART: 16,
};

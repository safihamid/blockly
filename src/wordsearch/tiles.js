'use strict';

var utils = require('../utils');

var Tiles = module.exports;

/**
 * Constants for cardinal directions.  Subsequent code assumes these are
 * in the range 0..3 and that opposites have an absolute difference of 2.
 * @enum {number}
 */
Tiles.Direction = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3
};

/**
 * The types of squares in the Maze, which is represented
 * as a 2D array of SquareType values.
 * @enum {number}
 */
Tiles.SquareType = {
  WALL: 0,
  OPEN: 1,
  START: 2,
  FINISH: 3,
  OBSTACLE: 4,
  STARTANDFINISH: 5,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  I: 18,
  J: 19,
  K: 20,
  L: 21,
  M: 22,
  N: 23,
  O: 24,
  P: 25,
  Q: 26,
  R: 27,
  S: 28,
  T: 29,
  U: 30,
  V: 31,
  W: 32,
  X: 33,
  Y: 34,
  Z: 35,
  AEND: 40,
  BEND: 41,
  CEND: 42,
  DEND: 43,
  EEND: 44,
  FEND: 45,
  GEND: 46,
  HEND: 47,
  IEND: 48,
  JEND: 49,
  KEND: 50,
  LEND: 51,
  MEND: 52,
  NEND: 53,
  OEND: 54,
  PEND: 55,
  QEND: 56,
  REND: 57,
  SEND: 58,
  TEND: 59,
  UEND: 60,
  VEND: 61,
  WEND: 62,
  XEND: 63,
  YEND: 64,
  ZEND: 65
};

Tiles.TurnDirection = { LEFT: -1, RIGHT: 1};
Tiles.MoveDirection = { FORWARD: 0, RIGHT: 1, BACKWARD: 2, LEFT: 3};

Tiles.directionToDxDy = function(direction) {
  switch (direction) {
    case Tiles.Direction.NORTH:
      return {dx: 0, dy: -1};
    case Tiles.Direction.EAST:
      return {dx: 1, dy: 0};
    case Tiles.Direction.SOUTH:
      return {dx: 0, dy: 1};
    case Tiles.Direction.WEST:
      return {dx: -1, dy: 0};
  }
  throw new Error('Invalid direction value' + direction);
};

Tiles.direction4to16 = function(direction4) {
  return direction4 * 4;
};

/**
 * Keep the direction within 0-3, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Tiles.constrainDirection4 = function(d) {
  return utils.mod(d, 4);
};

/**
 * Keep the direction within 0-15, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Tiles.constrainDirection16 = function(d) {
  return utils.mod(d, 16);
};

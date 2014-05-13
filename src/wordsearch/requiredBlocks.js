var MOVE_FORWARD = {'test': 'moveForward', 'type': 'maze_moveForward'};
var TURN_LEFT = {'test': 'turnLeft', 'type': 'maze_turn', 'titles': {'DIR': 'turnLeft'}};
var TURN_RIGHT = {'test': 'turnRight', 'type': 'maze_turn', 'titles': {'DIR': 'turnRight'}};
var WHILE_LOOP = {'test': 'while', 'type': 'maze_forever'};
var IS_PATH_LEFT = {'test': 'isPathLeft', 'type': 'maze_if', 'titles': {'DIR': 'isPathLeft'}};
var IS_PATH_RIGHT = {'test': 'isPathRight', 'type': 'maze_if', 'titles': {'DIR': 'isPathRight'}};
var IS_PATH_FORWARD = {'test': 'isPathForward', 'type': 'maze_ifElse', 'titles': {'DIR': 'isPathForward'}};
var FOR_LOOP = {'test': 'for', 'type': 'controls_repeat', titles: {TIMES: '???'}};

var MOVE_EAST = { 'test': 'moveEast', 'type': 'maze_moveEast' };
var MOVE_NORTH = { 'test': 'moveNorth', 'type': 'maze_moveNorth' };
var MOVE_WEST = { 'test': 'moveWest', 'type': 'maze_moveWest' };
var MOVE_SOUTH = { 'test': 'moveSouth', 'type': 'maze_moveSouth' };

module.exports = {
  MOVE_FORWARD: MOVE_FORWARD,
  TURN_LEFT: TURN_LEFT,
  TURN_RIGHT: TURN_RIGHT,
  WHILE_LOOP: WHILE_LOOP,
  IS_PATH_LEFT: IS_PATH_LEFT,
  IS_PATH_RIGHT: IS_PATH_RIGHT,
  IS_PATH_FORWARD: IS_PATH_FORWARD,
  FOR_LOOP: FOR_LOOP,
  MOVE_EAST: MOVE_EAST,
  MOVE_NORTH: MOVE_NORTH,
  MOVE_WEST: MOVE_WEST,
  MOVE_SOUTH: MOVE_SOUTH,
    };
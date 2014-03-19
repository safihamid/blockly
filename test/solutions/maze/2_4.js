var reqBlocks = function () {
  // stick this inside a function so that it's only loaded when needed
  return require('../../../src/maze/requiredBlocks.js');
};

module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "2_4",
  tests: [
    {
      description: "Verify solution",
      expected: {
        result: true,
        testResult: 100
      },
      missingBlocks: [],
      xml: '<xml><block type="maze_turn"><title name="DIR">turnRight</title><next><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnLeft</title><next><block type="maze_moveForward"><next><block type="maze_moveForward"><next><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnLeft</title><next><block type="maze_moveForward" /></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
    },
    {
      description: "Empty workspace",
      expected: {
        result: false,
        testResult: 4
      },
      missingBlocks: [reqBlocks().MOVE_FORWARD],
      xml: ''
    }
  ]
};

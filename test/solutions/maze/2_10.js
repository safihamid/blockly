var reqBlocks = function () {
  // stick this inside a function so that it's only loaded when needed
  return require('../../../src/maze/requiredBlocks.js');
};

module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "2_10",
  tests: [
    {
      description: "Verify solution",
      expected: {
        result: true,
        testResult: 100
      },
      missingBlocks: [],
      xml: '<xml><block type="maze_forever"><statement name="DO"><block type="maze_moveForward"><next><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnLeft</title></block></next></block></next></block></statement></block></xml>'
    },
    {
      description: "No while loop",
      expected: {
        result: false,
        testResult: 4
      },
      missingBlocks: [reqBlocks().WHILE_LOOP],
      xml: '<xml><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnLeft</title></block></next></block></xml>'
    }
  ]
};

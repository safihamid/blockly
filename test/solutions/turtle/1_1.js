var req = function () {
  // stick this inside a function so that it's only loaded when needed
  return require('../../../src/turtle/requiredBlocks.js');
};

module.exports = {
  app: "turtle",
  levelFile: "levels",
  levelId: "1_1",
  tests: [
    {
      description: "Expected solution",
      expected: {
        result: true,
        testResult: 100
      },
      missingBlocks: [],
      xml: '<xml><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant_restricted"><title name="DIR">turnRight</title><title name="VALUE">90</title><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title></block></next></block></next></block></xml>'
    },
    {
      description: "User doesnt add any blocks.  Should fail.",
      expected: {
        result: false,
        testResult: 4
      },
      xml: '<xml><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title></block></xml>'
    }
  ]
};

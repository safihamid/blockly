module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "1_5",
  tests: [
    {
      description: "Verify solution",
      expected: {
        result: true,
        testResult: 100
      },
      xml: '<xml><block type="maze_forever" x="-6" y="135"><statement name="DO"><block type="maze_if"><title name="DIR">isPathLeft</title><statement name="DO"><block type="maze_turn"><title name="DIR">turnLeft</title></block></statement><next><block type="maze_moveForward" /></next></block></statement></block></xml>'
    }
  ]
};

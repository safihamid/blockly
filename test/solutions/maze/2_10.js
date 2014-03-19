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
      xml: '<xml><block type="maze_forever"><statement name="DO"><block type="maze_moveForward"><next><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnLeft</title></block></next></block></next></block></statement></block></xml>'
    }
  ]
};

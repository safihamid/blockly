module.exports = {
  app: "maze",
  levelFile: "karelLevels",
  levelId: "1_8",
  tests: [
    {
      description: "Top Solve: Repeat 7x { MoveForward } Fill1",
      expected: {
        result: true,
        testResult: 100,
      },
      missingBlocks: [],
      xml: '<xml><block type="controls_repeat"><title name="TIMES">7</title><statement name="DO"><block type="maze_moveForward"></block></statement><next><block type="maze_fill"></block></next></block></xml>'
    }
  ]
};

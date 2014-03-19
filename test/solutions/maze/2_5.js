module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "2_5",
  tests: [
    {
      description: "Verify solution",
      expected: {
        result: true,
        testResult: 100
      },
      xml: '<xml><block type="controls_repeat" x="39" y="50"><title name="TIMES">5</title><statement name="DO"><block type="maze_moveForward" /></statement></block></xml>'
    }
  ]
};

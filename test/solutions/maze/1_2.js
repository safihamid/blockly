module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "1_2",
  tests: [
    {
      description: "Verify solution",
      expected: {
        result: true,
        testResult: 100
      },
      "missingBlocks": [],
      xml: '<xml><block type="maze_moveForward" x="70" y="70"><next><block type="maze_turn"><title name="DIR">turnLeft</title><next><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnRight</title><next><block type="maze_moveForward" /></next></block></next></block></next></block></next></block></xml>'
    },
    {
      description: "Empty workspace",
      expected: {
        result: false,
        testResult: 4
      },
      "missingBlocks": [{
        "test": "moveForward",
        "type": "maze_moveForward"
      }],
      xml: ""
    },
    {
      description: "Just move forward",
      expected: {
        result: false,
        testResult: 4
      },
      "missingBlocks": [{
        "test": "turnLeft",
        "type": "maze_turn",
        "titles": {
          "DIR": "turnLeft"
        }
      }],
      xml: '<xml><block type="maze_moveForward" x="70" y="70"></block></xml>'
    }
  ]
};

module.exports = {
  "app": "maze",    
  "levelFile": "levels",
  "levelId": "1_8",
  "tests" : [
    {
      "description": "Verify solution",
      "expected": {
        "result": true,
        "testResult": 100
      },
      "xml": '<xml><block type="maze_forever" x="40" y="45"><statement name="DO"><block type="maze_moveForward"><next><block type="maze_if"><title name="DIR">isPathLeft</title><statement name="DO"><block type="maze_turn"><title name="DIR">turnLeft</title></block></statement><next><block type="maze_if"><title name="DIR">isPathRight</title><statement name="DO"><block type="maze_turn"><title name="DIR">turnRight</title></block></statement></block></next></block></next></block></statement></block></xml>'
    }
  ]
}

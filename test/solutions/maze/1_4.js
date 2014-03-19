module.exports = {
  "app": "maze",    
  "levelFile": "levels",
  "levelId": "1_4",
  "tests" : [
    {
      "description": "Verify solution",
      "expected": {
        "result": true,
        "testResult": 100
      },
      "xml": '<xml><block type="maze_forever" x="22" y="48"><statement name="DO"><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnLeft</title><next><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnRight</title></block></next></block></next></block></next></block></statement></block></xml>'
    }
  ]
}

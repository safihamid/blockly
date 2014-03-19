module.exports = {
  "app": "maze",    
  "levelFile": "levels",
  "levelId": "2_6",
  "tests" : [
    {
      "description": "Verify solution",
      "expected": {
        "result": true,
        "testResult": 100
      },
      "xml": '<xml><block type="maze_turn" x="8" y="98"><title name="DIR">turnRight</title><next><block type="controls_repeat"><title name="TIMES">5</title><statement name="DO"><block type="maze_moveForward" /></statement></block></next></block></xml>'
    }
  ]
}

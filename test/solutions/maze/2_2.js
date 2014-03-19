module.exports = {
  "app": "maze",    
  "levelFile": "levels",
  "levelId": "2_2",
  "tests" : [
    {
      "description": "Verify solution",
      "expected": {
        "result": true,
        "testResult": 100
      },
      "xml": '<xml><block type="maze_moveForward" x="70" y="70"><next><block type="maze_moveForward"></block></next></block></xml>'
    }
  ]
}

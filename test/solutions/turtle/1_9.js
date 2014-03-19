module.exports = {
  "app": "turtle",
  "levelFile": "levels",
  "levelId": "1_9",
  "tests" : [
    {
      "description": "Top solve: 360x {Forward 1, Right 1}",
      "timeout": 9000,
      "expected": {
        "result": true,
        "testResult": 100
      },
      "xml": '<xml><block type="controls_repeat" deletable="false" movable="false"><title name="TIMES">360</title><statement name="DO"><block type="draw_move" inline="true" deletable="false" movable="false" editable="false"><title name="DIR">moveForward</title><value name="VALUE"><block type="math_number" deletable="false" movable="false" editable="false"><title name="NUM">1</title></block></value><next><block type="draw_turn" inline="true" deletable="false" movable="false" editable="false"><title name="DIR">turnRight</title><value name="VALUE"><block type="math_number" deletable="false" movable="false" editable="false"><title name="NUM">1</title></block></value></block></next></block></statement></block></xml>'
    },
    {
      "description": "Top failure: Same as top solve, but with no loop",
      "expected": {
        "result": false,
        "testResult": 3
      },
      "xml": '<xml><block type="draw_colour" inline="true"><value name="COLOUR"><block type="colour_random"></block></value><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_move_by_constant"><title name="DIR">moveBackward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant"><title name="DIR">turnRight</title><title name="VALUE">45</title></block></next></block></next></block></next></block></xml>'
    }
  ]
}

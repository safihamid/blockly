module.exports = {
  "app": "turtle",    
  "levelFile": "levels",
  "levelId": "1_8",
  "tests" : [
    {
      "description": "Top solve: 8x {Random color, Forward 100, Backward 100, Right 45}",
      "expected": {
        "result": true,
        "testResult": 100
      },
      "xml": '<xml><block type="controls_repeat"><title name="TIMES">8</title><statement name="DO"><block type="draw_colour" inline="true"><value name="COLOUR"><block type="colour_random"></block></value><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_move_by_constant"><title name="DIR">moveBackward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant"><title name="DIR">turnRight</title><title name="VALUE">45</title></block></next></block></next></block></next></block></statement></block></xml>'
    },
    {
      "description": "Top failure: unspecified count for loop",
      "expected": {
        "result": false,
        "testResult": 4
      },
      "xml": '<xml><block type="controls_repeat" deletable="false" movable="false"><title name="TIMES">??</title><statement name="DO"><block type="draw_move" inline="true" deletable="false" movable="false" editable="false"><title name="DIR">moveForward</title><value name="VALUE"><block type="math_number" deletable="false" movable="false" editable="false"><title name="NUM">1</title></block></value><next><block type="draw_turn" inline="true" deletable="false" movable="false" editable="false"><title name="DIR">turnRight</title><value name="VALUE"><block type="math_number" deletable="false" movable="false" editable="false"><title name="NUM">1</title></block></value></block></next></block></statement></block></xml>'
    }
  ]
}

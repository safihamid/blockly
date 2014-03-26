module.exports = {
  app: "turtle",
  levelFile: "levels",
  levelId: "4_2",
  tests: [
    {
      description: "Top Solve: Insert Turn Right 90",
      expected: {
        result: true,
        testResult: 100
      },
      missingBlocks: [],
      xml: '<xml><block type="draw_colour" inline="true" deletable="false" movable="false" editable="false"><value name="COLOUR"><block type="colour_random" deletable="false" movable="false" editable="false"></block></value><next><block type="controls_repeat" deletable="false" movable="false" editable="false"><title name="TIMES">3</title><statement name="DO"><block type="draw_move_by_constant" deletable="false" movable="false" editable="false"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant" deletable="false" movable="false" editable="false"><title name="DIR">turnRight</title><title name="VALUE">120</title></block></next></block></statement><next><block type="draw_turn_by_constant"><title name="DIR">turnRight</title><title name="VALUE">90</title><next><block type="draw_colour" inline="true" deletable="false" movable="false" editable="false"><value name="COLOUR"><block type="colour_random" deletable="false" movable="false" editable="false"></block></value><next><block type="controls_repeat" deletable="false" movable="false" editable="false"><title name="TIMES">3</title><statement name="DO"><block type="draw_move_by_constant" deletable="false" movable="false" editable="false"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant" deletable="false" movable="false" editable="false"><title name="DIR">turnRight</title><title name="VALUE">120</title></block></next></block></statement></block></next></block></next></block></next></block></next></block></xml>'
    }
  ]
};
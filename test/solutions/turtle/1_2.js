module.exports = {
  app: "turtle",
  levelFile: "levels",
  levelId: "1_2",
  tests: [
    {
      description: "Top solve: Red, Forward, Right, Forward, Right, Forward, Right, Forward",
      expected: {
        result: true,
        testResult: 100
      },
      missingBlocks: [],
      xml: '<xml><block type="draw_colour" inline="true"><value name="COLOUR"><block type="colour_picker"><title name="COLOUR">#ff0000</title></block></value><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant_restricted"><title name="DIR">turnRight</title><title name="VALUE">90</title><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant_restricted"><title name="DIR">turnRight</title><title name="VALUE">90</title><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant_restricted"><title name="DIR">turnRight</title><title name="VALUE">90</title><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
    },
    {
      description: "Top failure: Missing last right and forward",
      expected: {
        result: false,
        testResult: 2
      },
      missingBlocks: [],
      xml: '<xml><block type="draw_colour" inline="true"><value name="COLOUR"><block type="colour_picker"><title name="COLOUR">#ff0000</title></block></value><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant_restricted"><title name="DIR">turnRight</title><title name="VALUE">90</title><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant_restricted"><title name="DIR">turnRight</title><title name="VALUE">90</title><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title></block></next></block></next></block></next></block></next></block></next></block></xml>'
    }
  ]
};

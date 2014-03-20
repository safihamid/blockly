module.exports = {
  app: "flappy",
  levelFile: "levels",
  levelId: "3",
  tests: [
    // currently only testing missing blocks
    {
      description: "Expected solution",
      missingBlocks: [],
      xml: '<xml><block type="flappy_whenClick" deletable="false"><next><block type="flappy_flap"></block></next></block><block type="flappy_whenRunButtonClick" deletable="false"><next><block type="flappy_setSpeed"><title name="VALUE">Flappy.LevelSpeed.NORMAL</title></block></next></block></xml>'
    },
    {
      description: "start blocks (missing set speed)",
      missingBlocks: [
        {'test': 'setSpeed', 'type': 'flappy_setSpeed'}
      ],
      xml: '<xml><block type="flappy_whenClick" deletable="false"><next><block type="flappy_flap"></block></next></block><block type="flappy_whenRunButtonClick" deletable="false"></block></xml>'
    }
  ]
};

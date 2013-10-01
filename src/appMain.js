window.BlocklyApps = require('./base');

module.exports = function(app, options) {

  BlocklyApps.BASE_URL = options.baseUrl;

  options.blocksModule.install(Blockly, options.skin);

  window.addEventListener('load', function() {
    if (options.readonly) {
      BlocklyApps.initReadonly(options);
    } else {
      app.init(options);
      if (options.onInitialize) {
        options.onInitialize();
      }
    }
  });

};

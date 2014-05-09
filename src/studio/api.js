var tiles = require('./tiles');
var xFromPosition = tiles.xFromPosition;
var yFromPosition = tiles.yFromPosition;

exports.SpriteSpeed = {
  VERY_SLOW: 0.04,
  SLOW: 0.06,
  NORMAL: 0.1,
  FAST: 0.15,
  VERY_FAST: 0.23
};

exports.random = function (values) {
  var key = Math.floor(Math.random() * values.length); 
  return values[key];
};

exports.setBackground = function (id, value) {
  Studio.queueCmd(id, 'setBackground', {'value': value});
};

exports.setSprite = function (id, spriteIndex, value) {
  Studio.queueCmd(id,
                  'setSprite',
                  {'index': spriteIndex, 'value': value});
};

exports.saySprite = function (id, spriteIndex, text) {
  Studio.queueCmd(id, 'saySprite', {'spriteIndex': spriteIndex, 'text': text});
};

exports.setSpriteEmotion = function (id, spriteIndex, value) {
  Studio.queueCmd(id,
                  'setSpriteEmotion',
                  {'spriteIndex': spriteIndex, 'value': value});
};

exports.setSpriteSpeed = function (id, spriteIndex, value) {
  Studio.queueCmd(id,
                  'setSpriteSpeed',
                  {'spriteIndex': spriteIndex, 'value': value});
};

exports.setSpritePosition = function (id, spriteIndex, value) {
  Studio.queueCmd(id,
                  'setSpritePosition',
                  {'spriteIndex': spriteIndex,
                   'x': xFromPosition[value],
                   'y': yFromPosition[value]});
};

exports.playSound = function(id, soundName) {
  Studio.queueCmd(id, 'playSound', {'soundName': soundName});
};

exports.stop = function(id, spriteIndex) {
  Studio.queueCmd(id, 'stop', {'spriteIndex': spriteIndex});
};

exports.move = function(id, spriteIndex, dir) {
  Studio.queueCmd(id, 'move', {'spriteIndex': spriteIndex, 'dir': dir});
};

exports.moveDistance = function(id, spriteIndex, dir, distance) {
  Studio.queueCmd(
      id,
      'moveDistance',
      {'spriteIndex': spriteIndex, 'dir': dir, 'distance': distance});
};

exports.incrementScore = function(id, player) {
  Studio.queueCmd(id, 'incrementScore', {'player': player});
};

var list = [];

/**
 * call setTimeout and track the returned id
 */
exports.setTimeout = function (fn, time) {
  list.push(window.setTimeout(fn, time));
};

/**
 * Clears all timeouts in our list and resets the list
 */
exports.clearTimeouts = function () {
  list.forEach(window.clearTimeout);
  list = [];
};

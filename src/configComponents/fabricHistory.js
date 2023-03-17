/**
 * fabric历史记录
 * https://github.com/alimozdemir/fabric-history
 * */
export default function fabricHistory() {
  /**
   * Override the initialize function for the _historyInit();
   */
  fabric.Canvas.prototype.initialize = (function (originalFn) {
    return function (...args) {
      originalFn.call(this, ...args);
      this._historyInit();
      return this;
    };
  })(fabric.Canvas.prototype.initialize);

  /**
   * Initialization of the plugin
   */
  fabric.Canvas.prototype._historyInit = function () {
    this.history = [];
  };
  fabric.Canvas.prototype.undo = function (callback) {
    if (this.history.length <= 1) return;
    this.history.pop();
    let json = this.history[this.history.length - 1];
    callback && callback(json);
  };

  fabric.Canvas.prototype.saveHistory = function () {
    this.history.push(myCanvas.toJSON());
  };

  /**
   * Clear undo and redo history stacks
   */
  fabric.Canvas.prototype.clearHistory = function () {
    this.history = [];
  };
}

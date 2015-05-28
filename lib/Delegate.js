'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var Delegate = (function () {
  function Delegate(context, hooks) {
    _classCallCheck(this, Delegate);

    this._context = context;
    this._hooks = hooks;

    if (this._hooks.valueOf) {
      this.valueOf = this._hooks.valueOf;
    }

    this.listeners = [];
    this.event = new _Event2['default'](this);
  }

  _createClass(Delegate, [{
    key: 'raise',
    value: function raise() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (this._hooks.raise) {
        this._hooks.raise.apply(this._context, args);
      } else {
        var run = this.listeners.slice();
        var i = 0,
            len = run.length;
        for (; i < len; i++) {
          run[i].apply(this._context, args);
        }
      }
    }
  }, {
    key: 'addListener',

    /**
     * Adds a listener to the delegate.
     * @param {Function} listener
     */
    value: function addListener(listener) {
      if (this._hooks.add) {
        this._hooks.add.call(this._context, listener);
      } else {
        this.listeners.push(listener);
        this._didChange();
      }
    }
  }, {
    key: 'addListenerOnce',

    /**
     * Adds a listener to the delegate that automatically removes itself when
     * invoked.
     * @param {Function} listener
     */
    value: function addListenerOnce(listener) {
      var self = this;
      this.addListener(function wrapper() {
        self.removeListener(wrapper);
        listener.apply(self._context, arguments);
      });
    }
  }, {
    key: 'removeListener',

    /**
     * Removes a listener from the delegate if it exists.
     * @param {Function} listener
     */
    value: function removeListener(listener) {
      if (this._hooks.remove) {
        this._hooks.remove.call(this._context, listener);
      } else {
        var index = this.listeners.indexOf(listener);
        if (index > -1) {
          this.listeners.splice(index, 1);
          this._didChange();
        }
      }
    }
  }, {
    key: 'clearListeners',

    /**
     * Removes all listeners.
     */
    value: function clearListeners() {
      if (this._hooks.clear) {
        this._hooks.clear.call(this._context);
      } else {
        if (this.listeners.length > 0) {
          this.listeners.length = 0;
          this._didChange();
        }
      }
    }
  }, {
    key: '_didChange',
    value: function _didChange() {
      if (this._hooks.didChange) {
        this._hooks.didChange.call(this._context, this.listeners.length);
      }
    }
  }]);

  return Delegate;
})();

exports['default'] = Delegate;
;
module.exports = exports['default'];
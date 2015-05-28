(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.event = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./Event":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = (function () {
  function Event(delegate) {
    _classCallCheck(this, Event);

    this._delegate = delegate;
  }

  _createClass(Event, [{
    key: "valueOf",
    value: function valueOf() {
      return this._delegate.valueOf.apply(this._delegate, arguments);
    }
  }, {
    key: "addListener",
    value: function addListener() {
      return this._delegate.addListener.apply(this._delegate, arguments);
    }
  }, {
    key: "addListenerOnce",
    value: function addListenerOnce() {
      return this._delegate.addListenerOnce.apply(this._delegate, arguments);
    }
  }, {
    key: "removeListener",
    value: function removeListener() {
      return this._delegate.removeListener.apply(this._delegate, arguments);
    }
  }, {
    key: "clearListeners",
    value: function clearListeners() {
      return this._delegate.clearListeners.apply(this._delegate, arguments);
    }
  }]);

  return Event;
})();

exports["default"] = Event;
;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = event;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Delegate = require('./Delegate');

var _Delegate2 = _interopRequireDefault(_Delegate);

/**
 * C#-style events implemented via fake operator overloading.
 * http://www.2ality.com/2011/12/fake-operator-overloading.html
 */

var operands = [];
var _valueOf;
var kDelegatesKey = Symbol();

function event(prototype, name, descriptor) {
  Object.defineProperty(prototype, '_' + name, {
    configurable: true,
    enumerable: false,
    get: function get() {
      return delegateForObject(this, name, descriptor.initializer);
    },
    set: function set(value) {
      delegateForObject(this, name, descriptor.initializer).set(value);
    }
  });
  return {
    configurable: true,
    enumerable: false,
    get: function get() {
      return delegateForObject(this, name, descriptor.initializer).event;
    },
    set: function set(value) {
      _set(delegateForObject(this, name, descriptor.initializer), value);
    }
  };
}

function delegateForObject(context, name, initializer) {
  if (!context[kDelegatesKey]) {
    context[kDelegatesKey] = {};
  }
  var delegates = context[kDelegatesKey];
  if (!delegates[name]) {
    var hooks = initializer && initializer() || {};
    hooks.valueOf = valueOf;
    delegates[name] = new _Delegate2['default'](context, hooks);
  }
  return delegates[name];
}

function reset() {
  operands = [];
  Function.prototype.valueOf = _valueOf;
}

function valueOf() {
  // Only keep the last two operands.
  if (operands.length === 2) {
    operands.shift();
  }
  operands.push(this);

  // Temporarily override the valueOf method so that we can use the += and -=
  // syntax for adding and removing event listeners.
  if (Function.prototype.valueOf !== valueOf) {
    _valueOf = Function.prototype.valueOf;
    Function.prototype.valueOf = valueOf;
  }
  return 3;
}

function _set(delegate, value) {
  // Make sure the operands are valid, and that the left operand is us.
  if (operands.length === 2 && (operands[0] === delegate || operands[0] === delegate.event) && typeof operands[1] === 'function') {
    var listener = operands[1];
    // The '+=' operator was used (eg. 3 + 3 = 6).
    if (value === 6) {
      delegate.addListener(listener);
    }
    // The '-=' operator was used (eg. 3 - 3 = 0).
    else if (value === 0) {
      delegate.removeListener(listener);
    }
  }
  reset();
}
module.exports = exports['default'];

},{"./Delegate":1}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RlcGhlbi9jb2RlL3N0ZXBoZW5idW5jaC9ldmVudC9zcmMvRGVsZWdhdGUuanMiLCIvVXNlcnMvc3RlcGhlbi9jb2RlL3N0ZXBoZW5idW5jaC9ldmVudC9zcmMvRXZlbnQuanMiLCIvVXNlcnMvc3RlcGhlbi9jb2RlL3N0ZXBoZW5idW5jaC9ldmVudC9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7cUJDQWtCLFNBQVM7Ozs7SUFFTixRQUFRO0FBQ2hCLFdBRFEsUUFBUSxDQUNkLE9BQU8sRUFBRSxLQUFLLEVBQUc7MEJBRFgsUUFBUTs7QUFFekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDeEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7O0FBRXBCLFFBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUc7QUFDekIsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztLQUNwQzs7QUFFRCxRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNwQixRQUFJLENBQUMsS0FBSyxHQUFHLHVCQUFXLElBQUksQ0FBRSxDQUFDO0dBQ2hDOztlQVhrQixRQUFROztXQWF0QixpQkFBWTt3Q0FBUCxJQUFJO0FBQUosWUFBSTs7O0FBQ1osVUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRztBQUN2QixZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUUsQ0FBQztPQUNoRCxNQUFNO0FBQ0wsWUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqQyxZQUFJLENBQUMsR0FBRyxDQUFDO1lB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SyxFQUFFLENBQUM7R0FDbEI7QUFDRCxVQUFRLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxDQUFDOzs7O0FBSXRCLE1BQUssUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFHO0FBQzVDLFlBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUN0QyxZQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7R0FDdEM7QUFDRCxTQUFPLENBQUMsQ0FBQztDQUNWOztBQUVELFNBQVMsSUFBRyxDQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUc7O0FBRTlCLE1BQ0UsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEtBQ25CLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUEsQUFBRSxJQUM5RCxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQ2pDO0FBQ0EsUUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUzQixRQUFLLEtBQUssS0FBSyxDQUFDLEVBQUc7QUFDakIsY0FBUSxDQUFDLFdBQVcsQ0FBRSxRQUFRLENBQUUsQ0FBQztLQUNsQzs7U0FFSSxJQUFLLEtBQUssS0FBSyxDQUFDLEVBQUc7QUFDdEIsY0FBUSxDQUFDLGNBQWMsQ0FBRSxRQUFRLENBQUUsQ0FBQztLQUNyQztHQUNGO0FBQ0QsT0FBSyxFQUFFLENBQUM7Q0FDVCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgRXZlbnQgZnJvbSAnLi9FdmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlbGVnYXRlIHtcbiAgY29uc3RydWN0b3IoIGNvbnRleHQsIGhvb2tzICkge1xuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuX2hvb2tzID0gaG9va3M7XG5cbiAgICBpZiAoIHRoaXMuX2hvb2tzLnZhbHVlT2YgKSB7XG4gICAgICB0aGlzLnZhbHVlT2YgPSB0aGlzLl9ob29rcy52YWx1ZU9mO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgdGhpcy5ldmVudCA9IG5ldyBFdmVudCggdGhpcyApO1xuICB9XG5cbiAgcmFpc2UoIC4uLmFyZ3MgKSB7XG4gICAgaWYgKCB0aGlzLl9ob29rcy5yYWlzZSApIHtcbiAgICAgIHRoaXMuX2hvb2tzLnJhaXNlLmFwcGx5KCB0aGlzLl9jb250ZXh0LCBhcmdzICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBydW4gPSB0aGlzLmxpc3RlbmVycy5zbGljZSgpO1xuICAgICAgbGV0IGkgPSAwLCBsZW4gPSBydW4ubGVuZ3RoO1xuICAgICAgZm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgICAgIHJ1blsgaSBdLmFwcGx5KCB0aGlzLl9jb250ZXh0LCBhcmdzICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0byB0aGUgZGVsZWdhdGUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gICAqL1xuICBhZGRMaXN0ZW5lciggbGlzdGVuZXIgKSB7XG4gICAgaWYgKCB0aGlzLl9ob29rcy5hZGQgKSB7XG4gICAgICB0aGlzLl9ob29rcy5hZGQuY2FsbCggdGhpcy5fY29udGV4dCwgbGlzdGVuZXIgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaCggbGlzdGVuZXIgKTtcbiAgICAgIHRoaXMuX2RpZENoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gdGhlIGRlbGVnYXRlIHRoYXQgYXV0b21hdGljYWxseSByZW1vdmVzIGl0c2VsZiB3aGVuXG4gICAqIGludm9rZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gICAqL1xuICBhZGRMaXN0ZW5lck9uY2UoIGxpc3RlbmVyICkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmFkZExpc3RlbmVyKCBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgICAgc2VsZi5yZW1vdmVMaXN0ZW5lciggd3JhcHBlciApO1xuICAgICAgbGlzdGVuZXIuYXBwbHkoIHNlbGYuX2NvbnRleHQsIGFyZ3VtZW50cyApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmcm9tIHRoZSBkZWxlZ2F0ZSBpZiBpdCBleGlzdHMuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lciggbGlzdGVuZXIgKSB7XG4gICAgaWYgKCB0aGlzLl9ob29rcy5yZW1vdmUgKSB7XG4gICAgICB0aGlzLl9ob29rcy5yZW1vdmUuY2FsbCggdGhpcy5fY29udGV4dCwgbGlzdGVuZXIgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGluZGV4ID0gdGhpcy5saXN0ZW5lcnMuaW5kZXhPZiggbGlzdGVuZXIgKTtcbiAgICAgIGlmICggaW5kZXggPiAtMSApIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuc3BsaWNlKCBpbmRleCwgMSApO1xuICAgICAgICB0aGlzLl9kaWRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzLlxuICAgKi9cbiAgY2xlYXJMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKCB0aGlzLl9ob29rcy5jbGVhciApIHtcbiAgICAgIHRoaXMuX2hvb2tzLmNsZWFyLmNhbGwoIHRoaXMuX2NvbnRleHQgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCB0aGlzLmxpc3RlbmVycy5sZW5ndGggPiAwICkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9kaWRDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZGlkQ2hhbmdlKCkge1xuICAgIGlmICggdGhpcy5faG9va3MuZGlkQ2hhbmdlICkge1xuICAgICAgdGhpcy5faG9va3MuZGlkQ2hhbmdlLmNhbGwoIHRoaXMuX2NvbnRleHQsIHRoaXMubGlzdGVuZXJzLmxlbmd0aCApO1xuICAgIH1cbiAgfVxufTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50IHtcbiAgY29uc3RydWN0b3IoIGRlbGVnYXRlICkge1xuICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XG4gIH1cblxuICB2YWx1ZU9mKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZS52YWx1ZU9mLmFwcGx5KCB0aGlzLl9kZWxlZ2F0ZSwgYXJndW1lbnRzICk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGUuYWRkTGlzdGVuZXIuYXBwbHkoIHRoaXMuX2RlbGVnYXRlLCBhcmd1bWVudHMgKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyT25jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGUuYWRkTGlzdGVuZXJPbmNlLmFwcGx5KCB0aGlzLl9kZWxlZ2F0ZSwgYXJndW1lbnRzICk7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGUucmVtb3ZlTGlzdGVuZXIuYXBwbHkoIHRoaXMuX2RlbGVnYXRlLCBhcmd1bWVudHMgKTtcbiAgfVxuXG4gIGNsZWFyTGlzdGVuZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZS5jbGVhckxpc3RlbmVycy5hcHBseSggdGhpcy5fZGVsZWdhdGUsIGFyZ3VtZW50cyApO1xuICB9XG59O1xuIiwiaW1wb3J0IERlbGVnYXRlIGZyb20gJy4vRGVsZWdhdGUnO1xuXG4vKipcbiAqIEMjLXN0eWxlIGV2ZW50cyBpbXBsZW1lbnRlZCB2aWEgZmFrZSBvcGVyYXRvciBvdmVybG9hZGluZy5cbiAqIGh0dHA6Ly93d3cuMmFsaXR5LmNvbS8yMDExLzEyL2Zha2Utb3BlcmF0b3Itb3ZlcmxvYWRpbmcuaHRtbFxuICovXG5cbnZhciBvcGVyYW5kcyA9IFtdO1xudmFyIF92YWx1ZU9mO1xudmFyIGtEZWxlZ2F0ZXNLZXkgPSBTeW1ib2woKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXZlbnQoIHByb3RvdHlwZSwgbmFtZSwgZGVzY3JpcHRvciApIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBwcm90b3R5cGUsICdfJyArIG5hbWUsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkZWxlZ2F0ZUZvck9iamVjdCggdGhpcywgbmFtZSwgZGVzY3JpcHRvci5pbml0aWFsaXplciApO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiggdmFsdWUgKSB7XG4gICAgICBkZWxlZ2F0ZUZvck9iamVjdCggdGhpcywgbmFtZSwgZGVzY3JpcHRvci5pbml0aWFsaXplciApLnNldCggdmFsdWUgKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGRlbGVnYXRlRm9yT2JqZWN0KCB0aGlzLCBuYW1lLCBkZXNjcmlwdG9yLmluaXRpYWxpemVyICkuZXZlbnQ7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcbiAgICAgIHNldCggZGVsZWdhdGVGb3JPYmplY3QoIHRoaXMsIG5hbWUsIGRlc2NyaXB0b3IuaW5pdGlhbGl6ZXIgKSwgdmFsdWUgKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRlbGVnYXRlRm9yT2JqZWN0KCBjb250ZXh0LCBuYW1lLCBpbml0aWFsaXplciApIHtcbiAgaWYgKCAhY29udGV4dFsga0RlbGVnYXRlc0tleSBdICkge1xuICAgIGNvbnRleHRbIGtEZWxlZ2F0ZXNLZXkgXSA9IHt9O1xuICB9XG4gIHZhciBkZWxlZ2F0ZXMgPSBjb250ZXh0WyBrRGVsZWdhdGVzS2V5IF07XG4gIGlmICggIWRlbGVnYXRlc1sgbmFtZSBdICkge1xuICAgIHZhciBob29rcyA9IGluaXRpYWxpemVyICYmIGluaXRpYWxpemVyKCkgfHwge307XG4gICAgaG9va3MudmFsdWVPZiA9IHZhbHVlT2Y7XG4gICAgZGVsZWdhdGVzWyBuYW1lIF0gPSBuZXcgRGVsZWdhdGUoIGNvbnRleHQsIGhvb2tzICk7XG4gIH1cbiAgcmV0dXJuIGRlbGVnYXRlc1sgbmFtZSBdO1xufVxuXG5mdW5jdGlvbiByZXNldCgpIHtcbiAgb3BlcmFuZHMgPSBbXTtcbiAgRnVuY3Rpb24ucHJvdG90eXBlLnZhbHVlT2YgPSBfdmFsdWVPZjtcbn1cblxuZnVuY3Rpb24gdmFsdWVPZigpIHtcbiAgLy8gT25seSBrZWVwIHRoZSBsYXN0IHR3byBvcGVyYW5kcy5cbiAgaWYgKCBvcGVyYW5kcy5sZW5ndGggPT09IDIgKSB7XG4gICAgb3BlcmFuZHMuc2hpZnQoKTtcbiAgfVxuICBvcGVyYW5kcy5wdXNoKCB0aGlzICk7XG5cbiAgLy8gVGVtcG9yYXJpbHkgb3ZlcnJpZGUgdGhlIHZhbHVlT2YgbWV0aG9kIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGUgKz0gYW5kIC09XG4gIC8vIHN5bnRheCBmb3IgYWRkaW5nIGFuZCByZW1vdmluZyBldmVudCBsaXN0ZW5lcnMuXG4gIGlmICggRnVuY3Rpb24ucHJvdG90eXBlLnZhbHVlT2YgIT09IHZhbHVlT2YgKSB7XG4gICAgX3ZhbHVlT2YgPSBGdW5jdGlvbi5wcm90b3R5cGUudmFsdWVPZjtcbiAgICBGdW5jdGlvbi5wcm90b3R5cGUudmFsdWVPZiA9IHZhbHVlT2Y7XG4gIH1cbiAgcmV0dXJuIDM7XG59XG5cbmZ1bmN0aW9uIHNldCggZGVsZWdhdGUsIHZhbHVlICkge1xuICAvLyBNYWtlIHN1cmUgdGhlIG9wZXJhbmRzIGFyZSB2YWxpZCwgYW5kIHRoYXQgdGhlIGxlZnQgb3BlcmFuZCBpcyB1cy5cbiAgaWYgKFxuICAgIG9wZXJhbmRzLmxlbmd0aCA9PT0gMiAmJlxuICAgICggb3BlcmFuZHNbMF0gPT09IGRlbGVnYXRlIHx8IG9wZXJhbmRzWzBdID09PSBkZWxlZ2F0ZS5ldmVudCApICYmXG4gICAgdHlwZW9mIG9wZXJhbmRzWzFdID09PSAnZnVuY3Rpb24nXG4gICkge1xuICAgIHZhciBsaXN0ZW5lciA9IG9wZXJhbmRzWzFdO1xuICAgIC8vIFRoZSAnKz0nIG9wZXJhdG9yIHdhcyB1c2VkIChlZy4gMyArIDMgPSA2KS5cbiAgICBpZiAoIHZhbHVlID09PSA2ICkge1xuICAgICAgZGVsZWdhdGUuYWRkTGlzdGVuZXIoIGxpc3RlbmVyICk7XG4gICAgfVxuICAgIC8vIFRoZSAnLT0nIG9wZXJhdG9yIHdhcyB1c2VkIChlZy4gMyAtIDMgPSAwKS5cbiAgICBlbHNlIGlmICggdmFsdWUgPT09IDAgKSB7XG4gICAgICBkZWxlZ2F0ZS5yZW1vdmVMaXN0ZW5lciggbGlzdGVuZXIgKTtcbiAgICB9XG4gIH1cbiAgcmVzZXQoKTtcbn1cbiJdfQ==

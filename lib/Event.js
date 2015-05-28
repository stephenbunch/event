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
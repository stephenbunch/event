/**
 * C#-style events implemented via fake operator overloading.
 * http://www.2ality.com/2011/12/fake-operator-overloading.html
 */

var gOperands = [];
var _valueOf;
var kDelegatesKey = Symbol();

export default function event( prototype, name, descriptor ) {
  Object.defineProperty( prototype, '_' + name, {
    configurable: true,
    enumerable: false,
    get: function() {
      return getDelegate( this, name, descriptor.initializer );
    },
    set: function( value ) {
      getDelegate( this, name, descriptor.initializer ).set( value );
    }
  });
  return {
    configurable: true,
    enumerable: false,
    get: function() {
      return getEvent( this, name, descriptor.initializer );
    },
    set: function( value ) {
      getDelegate( this, name, descriptor.initializer ).set( value );
    }
  };
}

function getEvent( context, name, initializer ) {
  return getDelegate( context, name, initializer ).event;
}

function getDelegate( context, name, initializer ) {
  if ( !context[ kDelegatesKey ] ) {
    context[ kDelegatesKey ] = {};
  }
  var delegates = context[ kDelegatesKey ];
  if ( !delegates[ name ] ) {
    delegates[ name ] = makeDelegate( context, initializer );
  }
  return delegates[ name ];
}

function makeDelegate( context, initializer ) {
  var hooks = initializer && initializer() || {};

  var delegate = function() {
    delegate.raise.apply( undefined, arguments );
  };

  function didChange() {
    if ( hooks.didChange ) {
      hooks.didChange.call( context, delegate.listeners.length );
    }
  }

  delegate.listeners = [];
  delegate.valueOf = valueOf;

  delegate.raise = function() {
    if ( hooks.raise ) {
      hooks.raise.apply( context, arguments );
    } else {
      let run = delegate.listeners.slice();
      let i = 0, len = run.length;
      for ( ; i < len; i++ ) {
        run[ i ].apply( context, arguments );
      }
    }
  };

  delegate.addListener = function( listener ) {
    if ( hooks.add ) {
      hooks.add.call( context, listener );
    } else {
      delegate.listeners.push( listener );
      didChange();
    }
  };

  delegate.removeListener = function( listener ) {
    if ( hooks.remove ) {
      hooks.remove.call( context, listener );
    } else {
      let index = delegate.listeners.indexOf( listener );
      if ( index > -1 ) {
        delegate.listeners.splice( index, 1 );
        didChange();
      }
    }
  };

  delegate.addListenerOnce = function( listener ) {
    delegate.addListener( function self() {
      delegate.removeListener( self );
      listener.apply( this, arguments );
    });
  };

  delegate.clearListeners = function() {
    if ( hooks.clear ) {
      hooks.clear.call( context );
    } else {
      if ( delegate.listeners.length > 0 ) {
        delegate.listeners.length = 0;
        didChange();
      }
    }
  };

  delegate.event = {
    valueOf: valueOf.bind( delegate ),
    addListener: delegate.addListener,
    addListenerOnce: delegate.addListenerOnce,
    removeListener: delegate.removeListener,
    clearListeners: delegate.clearListeners
  };

  delegate.set = function( value ) {
    // Make sure the operands are valid, and that the left operand is us.
    if (
      gOperands.length === 2 &&
      ( gOperands[0] === delegate || gOperands[0] === delegate.event ) &&
      typeof gOperands[1] === 'function'
    ) {
      var listener = gOperands[1];
      // The '+=' operator was used (eg. 3 + 3 = 6).
      if ( value === 6 ) {
        delegate.addListener( listener );
      }
      // The '-=' operator was used (eg. 3 - 3 = 0).
      else if ( value === 0 ) {
        delegate.removeListener( listener );
      }
    }
    reset();
  };

  return delegate;
}

function valueOf() {
  // Only keep the last two operands.
  if ( gOperands.length === 2 ) {
    gOperands.shift();
  }
  gOperands.push( this );

  // Temporarily override the valueOf method so that we can use the += and -=
  // syntax for adding and removing event listeners.
  if ( Function.prototype.valueOf !== valueOf ) {
    _valueOf = Function.prototype.valueOf;
    Function.prototype.valueOf = valueOf;
  }
  return 3;
}

function reset() {
  gOperands = [];
  Function.prototype.valueOf = _valueOf;
}

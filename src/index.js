/**
 * C#-style events implemented via fake operator overloading.
 * http://www.2ality.com/2011/12/fake-operator-overloading.html
 */

var gOperands = [];
var _valueOf;
var kDelegatesKey = Symbol();

export default function event( prototype, name ) {
  Object.defineProperty( prototype, '_' + name, {
    configurable: true,
    enumerable: false,
    get: function() {
      return getDelegate( this, name );
    },
    set: function( value ) {
      getDelegate( this, name ).set( value );
    }
  });
  return {
    configurable: true,
    enumerable: false,
    get: function() {
      return getEvent( this, name );
    },
    set: function( value ) {
      getDelegate( this, name ).set( value );
    }
  };
}

function getEvent( context, name ) {
  return getDelegate( context, name ).event;
}

function getDelegate( context, name ) {
  if ( !context[ kDelegatesKey ] ) {
    context[ kDelegatesKey ] = {};
  }
  var delegates = context[ kDelegatesKey ];
  if ( !delegates[ name ] ) {
    delegates[ name ] = makeDelegate( context );
  }
  return delegates[ name ];
}

function makeDelegate( context ) {
  var listeners = [];

  var delegate = function() {
    var run = listeners.slice();
    var i = 0, len = run.length;
    for ( ; i < len; i++ ) {
      run[ i ].apply( context, arguments );
    }
  };

  delegate.valueOf = valueOf;

  delegate.addListener = function( listener ) {
    listeners.push( listener );
  };

  delegate.removeListener = function( listener ) {
    removeFromList( listener, listeners );
  };

  delegate.event = {
    valueOf: valueOf.bind( delegate ),
    addListener: delegate.addListener,
    removeListener: delegate.removeListener
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
        listeners.push( listener );
      }
      // The '-=' operator was used (eg. 3 - 3 = 0).
      else if ( value === 0 ) {
        removeFromList( listener, listeners );
      }
    }
    reset();
  };

  return delegate;
}

function removeFromList( item, list ) {
  var index = list.indexOf( item );
  if ( index > -1 ) {
    list.splice( index, 1 );
  }
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

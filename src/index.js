import Delegate from './Delegate';

/**
 * C#-style events implemented via fake operator overloading.
 * http://www.2ality.com/2011/12/fake-operator-overloading.html
 */

var operands = [];
var _valueOf;
var kDelegatesKey = Symbol();

export default function event( prototype, name, descriptor ) {
  Object.defineProperty( prototype, '_' + name, {
    configurable: true,
    enumerable: false,
    get: function() {
      return delegateForObject( this, name, descriptor.initializer );
    },
    set: function( value ) {
      delegateForObject( this, name, descriptor.initializer ).set( value );
    }
  });
  return {
    configurable: true,
    enumerable: false,
    get: function() {
      return delegateForObject( this, name, descriptor.initializer ).event;
    },
    set: function( value ) {
      set( delegateForObject( this, name, descriptor.initializer ), value );
    }
  };
}

function delegateForObject( context, name, initializer ) {
  if ( !context[ kDelegatesKey ] ) {
    context[ kDelegatesKey ] = {};
  }
  var delegates = context[ kDelegatesKey ];
  if ( !delegates[ name ] ) {
    var hooks = initializer && initializer() || {};
    hooks.valueOf = valueOf;
    delegates[ name ] = new Delegate( context, hooks );
  }
  return delegates[ name ];
}

function reset() {
  operands = [];
  Function.prototype.valueOf = _valueOf;
}

function valueOf() {
  // Only keep the last two operands.
  if ( operands.length === 2 ) {
    operands.shift();
  }
  operands.push( this );

  // Temporarily override the valueOf method so that we can use the += and -=
  // syntax for adding and removing event listeners.
  if ( Function.prototype.valueOf !== valueOf ) {
    _valueOf = Function.prototype.valueOf;
    Function.prototype.valueOf = valueOf;
  }
  return 3;
}

function set( delegate, value ) {
  // Make sure the operands are valid, and that the left operand is us.
  if (
    operands.length === 2 &&
    ( operands[0] === delegate || operands[0] === delegate.event ) &&
    typeof operands[1] === 'function'
  ) {
    var listener = operands[1];
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
}

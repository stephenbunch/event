import Event from './Event';

export default class Delegate {
  constructor( context, hooks ) {
    this._context = context;
    this._hooks = hooks;

    if ( this._hooks.valueOf ) {
      this.valueOf = this._hooks.valueOf;
    }

    this.listeners = [];
    this.event = new Event( this );
  }

  raise( ...args ) {
    if ( this._hooks.raise ) {
      this._hooks.raise.apply( this._context, args );
    } else {
      let run = this.listeners.slice();
      let i = 0, len = run.length;
      for ( ; i < len; i++ ) {
        run[ i ].apply( this._context, args );
      }
    }
  }

  /**
   * Adds a listener to the delegate.
   * @param {Function} listener
   */
  addListener( listener ) {
    if ( this._hooks.add ) {
      this._hooks.add.call( this._context, listener );
    } else {
      this.listeners.push( listener );
      this._didChange();
    }
  }

  /**
   * Adds a listener to the delegate that automatically removes itself when
   * invoked.
   * @param {Function} listener
   */
  addListenerOnce( listener ) {
    var self = this;
    this.addListener( function wrapper() {
      self.removeListener( wrapper );
      listener.apply( self._context, arguments );
    });
  }

  /**
   * Removes a listener from the delegate if it exists.
   * @param {Function} listener
   */
  removeListener( listener ) {
    if ( this._hooks.remove ) {
      this._hooks.remove.call( this._context, listener );
    } else {
      let index = this.listeners.indexOf( listener );
      if ( index > -1 ) {
        this.listeners.splice( index, 1 );
        this._didChange();
      }
    }
  }

  /**
   * Removes all listeners.
   */
  clearListeners() {
    if ( this._hooks.clear ) {
      this._hooks.clear.call( this._context );
    } else {
      if ( this.listeners.length > 0 ) {
        this.listeners.length = 0;
        this._didChange();
      }
    }
  }

  _didChange() {
    if ( this._hooks.didChange ) {
      this._hooks.didChange.call( this._context, this.listeners.length );
    }
  }
};

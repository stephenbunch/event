export default class Event {
  constructor( delegate ) {
    this._delegate = delegate;
  }

  valueOf() {
    return this._delegate.valueOf.apply( this._delegate, arguments );
  }

  addListener() {
    return this._delegate.addListener.apply( this._delegate, arguments );
  }

  addListenerOnce() {
    return this._delegate.addListenerOnce.apply( this._delegate, arguments );
  }

  removeListener() {
    return this._delegate.removeListener.apply( this._delegate, arguments );
  }

  clearListeners() {
    return this._delegate.clearListeners.apply( this._delegate, arguments );
  }
};

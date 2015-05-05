describe( 'event', function() {
  it( 'should not be invokable from the outside', function() {
    class Test {
      @event myEvent
    }

    var obj = new Test();
    expect( obj.myEvent ).not.to.be.a( 'function' );
  });

  it( 'should set the listener context to the parent object', function() {
    class Test {
      @event myEvent
    }

    var obj = new Test();
    var out;
    obj.myEvent += function() {
      out = this;
    };
    obj._myEvent.raise();
    expect( out ).to.equal( obj );
  });
});

describe( 'events', function() {

  class Test {
    @event
    myEvent
  }

  describe( '+=', function() {
    it( 'should add an event listener', function() {
      var obj = new Test();
      var listener = sinon.stub();
      obj.myEvent += listener;
      obj._myEvent( 2 );
      expect( listener ).to.have.been.calledWith( 2 );
    });
  });

  describe( '-=', function() {
    it( 'should remove an event listener', function() {
      var obj = new Test();
      var listener = sinon.stub();
      obj.myEvent += listener;
      obj.myEvent -= listener;
      obj._myEvent();
      expect( listener ).to.not.have.been.called;
    });

    it( 'can be called inside an event listener', function() {
      var obj = new Test();
      var out;
      obj.myEvent += function onEvent( value ) {
        obj.myEvent -= onEvent;
        out = value;
      };
      obj._myEvent( 2 );
      obj._myEvent( 5 );
      expect( out ).to.equal( 2 );
    });
  });

  describe( 'event', function() {
    it( 'should not be invokable from the outside', function() {
      var obj = new Test();
      expect( obj.myEvent ).not.to.be.a( 'function' );
    });

    it( 'should set the listener context to the parent object', function() {
      var obj = new Test();
      var out;
      obj.myEvent += function() {
        out = this;
      };
      obj._myEvent();
      expect( out ).to.equal( obj );
    });
  });
});

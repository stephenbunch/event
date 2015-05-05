describe( 'operators', function() {
  describe( '+=', function() {
    it( 'should add an event listener', function() {
      class Test {
        @event myEvent
      }

      var obj = new Test();
      var listener = sinon.stub();
      obj.myEvent += listener;
      obj._myEvent.raise( 2 );
      expect( listener ).to.have.been.calledWith( 2 );
    });
  });

  describe( '-=', function() {
    it( 'should remove an event listener', function() {
      class Test {
        @event myEvent
      }

      var obj = new Test();
      var listener = sinon.stub();
      obj.myEvent += listener;
      obj.myEvent -= listener;
      obj._myEvent.raise();
      expect( listener ).to.not.have.been.called;
    });

    it( 'can be called inside an event listener', function() {
      class Test {
        @event myEvent
      }

      var obj = new Test();
      var out;
      obj.myEvent += function onEvent( value ) {
        obj.myEvent -= onEvent;
        out = value;
      };
      obj._myEvent.raise( 2 );
      obj._myEvent.raise( 5 );
      expect( out ).to.equal( 2 );
    });
  });
});

import event from '../src/index';

describe( 'hooks', function() {
  describe( 'add', function() {
    it( 'should override addListener', function() {
      var add = sinon.stub();
      class Test {
        @event myEvent = {
          add: add
        }
      }
      var obj = new Test();
      var listener = function() {};
      obj.myEvent += listener;
      expect( add ).to.have.been.calledWith( listener );
      expect( add ).to.have.been.calledOn( obj );
    });
  });

  describe( 'remove', function() {
    it( 'should override removeListener', function() {
      var remove = sinon.stub();
      class Test {
        @event myEvent = {
          remove: remove
        }
      }
      var obj = new Test();
      var listener = function() {};
      obj.myEvent -= listener;
      expect( remove ).to.have.been.calledWith( listener );
      expect( remove ).to.have.been.calledOn( obj );
    });
  });

  describe( 'raise', function() {
    it( 'should override the event call', function() {
      var raise = sinon.stub();
      class Test {
        @event myEvent = {
          raise: raise
        }
      }
      var obj = new Test();
      obj._myEvent.raise( 2 );
      expect( raise ).to.have.been.calledWith( 2 );
      expect( raise ).to.have.been.calledOn( obj );
    });
  });

  describe( 'didChange', function() {
    it( 'should fire whenever a listener is added or removed', function() {
      var didChange = sinon.stub();
      class Test {
        @event myEvent = {
          didChange: didChange
        }
      }
      var obj = new Test();
      var listener = function() {};
      obj.myEvent += listener;
      expect( didChange ).to.have.been.calledWith( 1 );
      obj.myEvent -= listener;
      expect( didChange ).to.have.been.calledWith( 0 );
      expect( didChange ).to.always.have.been.calledOn( obj );
    });
  });
});

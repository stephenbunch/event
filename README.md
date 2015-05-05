# @Event

Ever since I worked with C#, I've missed the simplicity of its support for multicast delegates, otherwise known as events. So when I found out about [ES7 decorators](https://github.com/wycats/javascript-decorators), I had to try it out.

```js
import event from 'event';

class Button {
  @event onClick

  click() {
    this._onClick.raise( 1, 2, 3 );
  }
}

var button = new Button();

var button_onClick = function( a, b, c ) {
  console.log( this, a, b, c );
};

// Add event listener.
button.onClick += button_onClick;

// prints: Button {}, 1, 2, 3
button.click();

// Remove event listener.
button.onClick -= button_onClick;

// prints nothing
button.click();

// TypeError: onClick.raise is not a function
button.onClick.raise( 1, 2, 3 );
```

## What's the big deal?

When the browser gave us events, they gave us unicast delegates. This pattern is also seen in iOS:

```js
window.onresize = function() {};
```

```swift
var locationManager = CLLocationManager();
locationManager.delegate = self;
```

In some situations, the [delegate pattern](https://developer.apple.com/library/ios/documentation/General/Conceptual/DevPedia-CocoaCore/Delegation.html) makes sense. But when we think of events, what we really want is event *observation*, not event handling. We want a one-to-many relationship, not a one-to-one.

Most libraries solve this problem using a pub/sub API:

```js
class EventEmitter {
  on( event, listener ) {}
  off( event, listener ) {}
  emit( event, ...args ) {}
}
```

The problem with this solution is that we lose the semantic meaning of events. Events should part of the definition of the object, not an API detail of the on/off methods. You never see people write objects like this:

```js
class MyObject {
  get( property ) {}
  set( property, value ) {}
}
```

Why would we do the same for events?

Additionally, the invocation of events should be hidden to the public. If the object is truly an event emitter, then publishing (raising) events from the outside makes sense. But when an event emitter is used to provide events on an object, consumers of that object expect *the object* to do all the invocations and *no one else!*

If you were listening for the 'close' event on a socket, you would not expect someone else to raise that event even though the `emit` method is public.

```js
socket.on( 'close', function() {
  // ...
});

// WTF!!!
socket.emit( 'close' );
```

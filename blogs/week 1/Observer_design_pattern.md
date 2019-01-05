# Observer Design Pattern

Also called the pub-sub pattern.

## Introduction :-

Suppose you have an object whose state somehow changes. Lets say this object is a WeatherStation and its state is the temperature which is measures. So whenver the temperature changes the state of the WeatherStation changes because the WeatherStation is measuring the temperature. The state can also contain other properties like humiditiy, pressure, but we will use temperature for simplicity sake. 

Lets say there is an object which wants to know when the state of the WeatherStation changes. The object can be a SmartPhone or some other DisplayDevice. It wants to know whenever the state of the WeatherStation, which is temperature, so that it can update temperature on its display.

Thus, these phones are called **Observer** because they *observe* for changes and the WeatherStation is called the **Observable** beacause it is being observed by the Observers. Now, how will the observer know when the Observable's state has changed. It can do this by checking on the Observable in short intervals. But suppose there are tons of observers. In that case the Observable will be pummeled with tons and tons of requests by the Observers to know if the state changed or not. There is another way of doing it.

Insted of Observers requesting to know state change the Observable can notify the Observers whenever its state changes. So the Observers can **subscribe** to the Observable and whenever the state changes the Observable can **publish** a notification to its subscribers. A pretty good analogy will be the youtube subscription. You being the Observer/Subscriber suscribe to a channel so as to be notified whenever the owner of the channel/Obervable uploads a new video. A notification pops up in your account about the new video and you then consume that video. As simple as that.

An **image** of a UML diagram to show how the Observer pattern works. It makes use of Interfaces and Concrete Classes and is made more on the line of the Java Language.
![Observer Pattern UML Diagram](https://instagram.fccu5-1.fna.fbcdn.net/vp/10cd01e3f1a4635e688077d8394a7830/5BC860AC/t51.2885-15/e35/36497355_138887766926330_8436857598178754560_n.jpg?efg=eyJ1cmxnZW4iOiJ1cmxnZW5fZnJvbV9pZyJ9 "UML Diagram for Observer Design Pattern")

Here's a very simple code snippet written in Javascript to show the working of Observer Pattern.
[Link](https://gist.github.com/delphian/5893711) for the code :)  

```js
/**
 * @file
 * Observer design pattern.
 *
 * This object will provide an observer design pattern. Observers may
 * subscribe to specific message types. Observables may broadcast
 * messages specific to a type.
 *
 * @author Bryan Hazelbaker <bryan.hazelbaker@gmail.com>
 * @version 1.0
 *
 * @see http://www.joezimjs.com/javascript/javascript-design-patterns-observer/
 */

/**
 * The Observable class.
 *
 * Instantiate this to objects that wish to be observed.
 *
 * Example:
 * @code
 *   // Create the observer object. It is simply a function.
 *   var Observer = function(message, messageType) {
 *       console.log(message);
 *   }
 *   // Create the observable object.
 *   observable = new Observable();
 *   // Create a default message type for observers to subscribe to.
 *   observable.messageTypeAdd('generic');
 *   // Subscribe the Observer previously declared to any 'generic' messages
 *   // published.
 *   observable.messageSubscribe(Observer, 'generic');
 *   // Publish a message.
 *   observable.messagePublish('generic', 'We published this data!');
 * @endcode
 */
var Observable = function() {}
Observable.prototype = {
    subscribers: [],
    messageTypeAdd: function(messageType) {
        this.subscribers[messageType] = [];
    },
    messageTypeRemove: function (messageType) {
        var i = 0,
            len = this.subscribers.length;
        // Iterate through the array and if the callback is
        // found, remove it from the list of subscribers.
        for (; i < len; i++) {
            if (this.subscribers[i] === messageType) {
                this.subscribers.splice(i, 1);
                // Once we've found it, we don't need to
                // continue, so just return.
                return;
            }
        }
    },
    messageSubscribe: function(messageType, callback) {
        // Add the callback to the message type specific callback list.
        this.subscribers[messageType].push(callback);
    },
    messageUnsubscribe: function(messageType, callback) {
        var i = 0,
            len = this.subscribers[messageType].length;
        // Iterate through the array and if the callback is
        // found, remove it from the list of subscribers.
        for (; i < len; i++) {
            if (this.subscribers[messageType][i] === callback) {
                this.subscribers[messageType].splice(i, 1);
                // Once we've found it, we don't need to
                // continue, so just return.
                return;
            }
        }
    },
    messagePublish: function(messageType, data) {
        var i = 0,
            len = this.subscribers[messageType].length;
        // Iterate over the subscribers array and call each of
        // the callback functions.
        for (; i < len; i++) {
            this.subscribers[messageType][i](data, messageType);
        }
    }
};

```
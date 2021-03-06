#Signals.js#

##What is Signals.js##

Signals.js is a light weight (1k minified) pure JavaScript implementation of the Observer pattern also known as PubSub. Using Signals.js in your JavaScript gives you the ability to break down our applications into smaller, more loosely coupled modules, which can improve general manageability.

##Simple usage##

*Download the signals.min.js file from GitHub and add a reference to it in your project*
*this example uses jQuery*
	
**HTML Markup**

```html
<div>
	<input type="text" id="say-something" />
	<p>
		You said, "<span id="say-it-back">...</span>" in <span id="char-count"></span> characters
	</p>
</div>
```

**JavaScript**

*put below script just above the closing body tag*	

```javascript
(function (d, signals) {
	//defining some *private* functions and variables
	var updateCharCount,
		updatePreview,
		sayItBackSpan = d.getElementById('say-it-back'),
		charCountSpan = d.getElementById('char-count');
	updateCharCount = function (text) {
		charCountSpan.innerHTML = text.length;
	};
	updatePreview = function (text) {
		sayItBackSpan.innerHTML = text;
	};

	//Tell signals.js we want to subscribe our private 
	//functions to the type sayingSomething
	//(types are arbitrary text, *you* create the signal types)
	signals.subscribe('sayingSomething', updateCharCount);
	signals.subscribe('sayingSomething', updatePreview);
}(document, signals));

$(function () {
	$('#say-something').bind("keydown, keyup", function () {
		//Tell signals.js to broadcast that the user has said something and pass in the text!
		signals.broadcast('sayingSomething', $(this).val());
	});
});
```

**:before and :after**

Signals has a build in convention for executing functions before and after a signal is broadcast with only calling the root signal. Here is a simple example:

```javascript
(function(w, signals) {
	var doWork, wakeUp, goToBed;

	doWork = function() {
		w.console.log('I am doin work!');
	};
	wakeUp = function() {
		w.console.log('Getting out of bed and putting my work clothes on.');
	};
	goToBed = function() {
		w.console.log('Going to bed after a long day doin work.');
	};
	signals.subscribe('evt:doingWork', doWork);
	signals.subscribe('evt:doingWork:before', wakeUp);
	signals.subscribe('evt:doingWork:after', goToBed);

	w.onLoad = function() {
		signals.broadcast('evt:doingWork');
		// Console will read:
		// Getting out of bed and putting my work clothes on.
		// I am doin work!
		// Going to bed after a long day doin work.
	};
}(window, window.signals));
```

The convention is by adding :before or :after to your signal key, it will execute the function(s) before or after the root signal key is executed.

**Subscribing collections**

You can also subscribe collections to a single:

```javascript
signals.subscribe('evt:doingWork', [func1, func2, func3]);
```

**Using signals with callbacks**

You can also use signals *.proxy( 'signalName' )* to return a function a callback can use:

```javascript
var doSomethingAfterAjaxCall = function( data ) {
	alert( data );
};
signals.subscribe('evt:ajaxComplete', doSomethingAfterAjaxCall);

$.get('/handel/ajax', signals.proxy( 'evt:ajaxComplete' ));
```

###What is PubSub (Observer)?###

*Sourced from [scriptjunkie{}](http://msdn.microsoft.com/en-us/scriptjunkie/hh201955.aspx) written by [Addy Osmani](http://addyosmani.com/blog/)*

> The general idea behind the Observer pattern is the promotion of loose coupling (or decoupling as it's also referred as). Rather than single objects calling on the methods of other objects, an object instead   subscribes to a specific task or activity of another object and is notified when it occurs. Observers are also called Subscribers and we refer to the object being observed as the Publisher (or the subject). Publishers notify subscribers when events occur.

> When objects are no longer interested in being notified by the subject they are registered with, they can unregister (or unsubscribe) themselves. The subject will then in turn remove them from the observer collection. 

> It's often useful to refer back to published definitions of design patterns that are language agnostic to get a broader sense of their usage and advantages over time. The definition of the observer pattern provided in the Gang of Four book, Design Patterns: Elements of Reusable Object-Oriented Software, is:

>> *'One or more observers are interested in the state of a subject and register their interest with the subject by attaching themselves. When something changes in our subject that the observer may be interested in, a notify message is sent which calls the update method in each observer. When the observer is no longer interested in the subject's state, they can simply detach themselves.'*

> Basically, the pattern describes subjects and observers forming a publish-subscribe relationship. Unlimited numbers of objects may observe events in the subject by registering themselves. Once  registered to particular events, the subject will notify all observers when the event has been fired. 

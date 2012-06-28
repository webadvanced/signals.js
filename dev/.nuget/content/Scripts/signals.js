/** @license
* Signals.js <https://github.com/webadvanced/signals.js>
* Released under the MIT license
* Author: Web Advanced
* Version: 1.1.1
*/

/**
* @namespace Signals Namespace - A lightweight (1k minified) pure JavaScript PubSub library
* @name signals
*/
var signals = ( function ( global, undefined ) {
    "use strict";
	var evts = [],
	makeObservable,
	subscribeToSignal,
	takeAction,
	getSignalType,
	fire,
	unload,
    iterator,
    FUNCTION = 'function',
    checkArgument,
    createProxyFor;
	/**
	* Private function that checks a given argument agents is expected type.
	* <br />- <strong>(will throw is arg does not match expected)</strong>
	* @private
	* @name checkArgument
	* @param {object} [arg] Argument.
	* @param {object} [expected] Expected type.
	* @param {string} [message] Message to throw. (default = 'Invalid argument').
	*/
	checkArgument = function( arg, expected, message ) {
		if ( typeof arg !== expected ) {
			throw message || 'Invalid argument.';
		}
	};
	/**
	* Private function that makes the given signal observable.
	* <br />- <strong>(signals are an arbitrary string)</strong>
	* @private
	* @name makeObservable
	* @param {string} [signal] Name of the signal. (default = 'any').
	*/
	makeObservable = function ( signal ) {
		var signalType = getSignalType( signal );
		if ( evts[signalType] === undefined ) {
			evts[signalType] = [];
		}
	};
	/**
	* Private function that subscribes a listener to a signal.
	* <br />- <strong>(signals are an arbitrary string)</strong>
	* @private
	* @name subscribeToSignal
	* @param {string} [signalName] Name of the signal. (default = 'any').
	* @param {Object} [callbacks] Callback function or Array of functions to be bound to the signal.
	* @param {Object} [context] Context on which listener will be executed (object that should represent the `this`. (default = window)
	*/
    subscribeToSignal = function ( signalName, callbacks, context ) {
		var signalType = getSignalType( signalName ), 
			i = 0, 
			l,
			callback;
		if ( callbacks instanceof Array ) {
			l = callbacks.length;
			for (i; i < l; i++) {
				callback = callbacks[i];
				checkArgument( callback, FUNCTION, 'Callback must be a function' );	
				evts[signalType].push( {callback: callback, obj: context || global} );
			}
		} else {
			checkArgument(callbacks, FUNCTION, 'Callback must be a function');
			evts[signalType].push({callback: callbacks, obj: context || global});
		}
    };
    /**
    * Private function that returns a function that will handle the execution of Listeners for a given Signal
    * @private
    * @name createProxyFor
    * @param {string} [signalName] Name of the signal. (default = 'any').
    */
    createProxyFor = function ( signalName ) {
        return (function( arg ) {
            takeAction( 'broadcast', signalName, arg );
        });
    };
	/**
	* Private function that handles the execution of Listeners for a given Signal or unsubscribe the Listener from the Signal
	* @private
	* @name takeAction
	* @param {string} [action] The action the function should take with the given arguments.
	* @param {string} [signalName] Name of the signal. (default = 'any').
	* @param {Object} [arg] The args that will be passed to the Listeners or the function to be unsubscribed.
	*/
    takeAction = function ( action, signalName, arg ) {
        var signalType = getSignalType( signalName ),
            actionsBefore = evts[signalType + ':before'],
            actions = evts[signalType],
            actionsAfter = evts[signalType + ':after'],
			takeAction;

        if ( actions === undefined ) {
            return;
        }
		if ( action === 'broadcast' ) {
			takeAction = fire;
		} else {
			takeAction = unload;
		}
        if( actionsBefore ) {
            iterator( actionsBefore, takeAction, arg );
        }

        iterator( actions, takeAction, arg );

        if( actionsAfter ) {
            iterator( actionsAfter, takeAction, arg );
        }
    };
    iterator = function( collection, fn, arg ) {
        var i = 0, l = collection.length;
        for ( ; i < l; i += 1 ) {
            fn( collection[i], arg, collection, i );
        }
    };
	/**
	* Private function that fires off a Listener.
	* @private
	* @name fire
	* @param {Object} [listener] The object that holds a callback and executing context.
	* @param {Object} [arg] The args that will be passed to the Listener.
	*/
	fire = function ( listener, arg ) {
		var ctx = listener.obj,
			fn = listener.callback;
		global.setTimeout( function () { fn.call(ctx, arg); }, 0 );
	};
	/**
	* Private function that will unsubscribe a function from the supplied Signal.
	* @private
	* @name unload
	* @param {Object} [listener] The object that holds a callback and executing context.
	* @param {Function} [arg] The Function to be removed from the Signal.
	* @param {Array} [actions] Collection of subscribers for a signal.
	* @param {Number} [i] Index in the actions collection to be spliced out of the array.
	*/
	unload = function ( listener, arg, actions, i ) {
		if ( listener !== undefined && listener.callback === arg ) {
			actions.splice( i, 1 );
        }
	};
	/**
	* Private function that sets the signal.
	* @private
	* @name getSignalType
	* @param {string} [signal] The Signal.
	*/
    getSignalType = function ( signal ) {
        /**
		* If signal is undefined, set signal to 'any'.
		* @signal string
		* @private
		*/
		return signal || 'any';
    };
	
    return {
		/**
		* Add a Listener or collection of listeners to the given Signal.
		* @name signals.subscribe
		* @param {string} The signals name.
		* @param {Object}  Array of Functions or function that should be added to the Signal.
		* @param {Object} [context] Context on which the listener will be executed (object that should represent the `this`. (default = window)
		* @function
		*/
        subscribe: function ( signalName, callbacks, context ) {
            makeObservable( signalName );
            subscribeToSignal( signalName, callbacks, context );
        },
		/**
		* Broadcast to all listeners of the given signal to execute.
		* @name signals.broadcast
		* @param {string} [signalName] The signal.
		* @param {Object} [arg] Will be passed to each function as the argument.
		* @function
		*/
        broadcast: function ( signalName, arg ) {
            takeAction( 'broadcast', signalName, arg );
        },
        /**
        * Return a broadcast function for the given signal.
        * @name signals.proxy
        * @param {string} [signalName] The signal.
        * @return {function} when executed will broadcast for given sigalName.
        * @function
        */
        proxy: function ( signalName ) {
            return createProxyFor( signalName );
        },
		/**
		* Remove a listener from the given signal.
		* @name signals.unsubscribe
		* @param {string} [signalName] The signal.
		* @param {Function} Function that should be removed.
		* @function
		*/
        unsubscribe: function ( signalName, fn ) {
            takeAction( 'unsubscribe', signalName, fn );
        },
		/**
		* Check if Signal is observable.
		* @name signals.isObservable
		* @param {string} [signalName] The signal.
		* @return {boolean} if signal is observable.
		* @function
		*/
        isObservable: function ( signalName ) {
            var signalType = getSignalType( signalName );
            return evts[signalType] !== undefined;
        },
		/**
		* Gets the count of Listeners for the given Signal.
		* @name signals.listenerCount
		* @param {string} [signalName] The signal.
		* @return {Number} Number of Listeners. (default = 0).
		* @function
		*/
        listenerCount: function ( signalName ) {
            var signalType = getSignalType( signalName ),
                actions = evts[signalType];
            return actions !== undefined ? actions.length : 0;
        }
    };
}(this));

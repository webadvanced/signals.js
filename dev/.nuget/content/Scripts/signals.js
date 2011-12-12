/** @license
* Signals.js <https://github.com/webadvanced/signals.js>
* Released under the MIT license
* Author: Web Advanced
* Version: 0.0.1
*/

/**
* @namespace Signals Namespace - A lightweight (1k minified) pure JavaScript PubSub library
* @name signals
*/
var signals = (function (global, undefined) {
    "use strict";
	var evts = [],
	makeObservable,
	subscribeToSignal,
	takeAction,
	getSignalType,
	fire,
	unload;
	/**
	* Private function that makes the given signal observable.
	* <br />- <strong>(signals are an arbitrary string)</strong>
	* @private
	* @name makeObservable
	* @param {string} [signal] Name of the signal. (default = 'any').
	*/
	makeObservable = function (signal) {
		var signalType = getSignalType(signal);
		if (evts[signalType] === undefined) {
		    evts[signalType] = [];
		}
	};
	/**
	* Private function that subscribes a listener to a signal.
	* <br />- <strong>(signals are an arbitrary string)</strong>
	* @private
	* @name subscribeToSignal
	* @param {string} [signalName] Name of the signal. (default = 'any').
	* @param {Function} [fn] Callback function bound to the signal.
	* @param {Object} [context] Context on which listener will be executed (object that should represent the `this`. (default = window)
	*/
    subscribeToSignal = function (signalName, fn, context) {
		var signalType = getSignalType(signalName);
		evts[signalType].push({callback: fn, obj: context || global});
    };
	/**
	* Private function that handles the execution of Listeners for a given Signal or unsubscribe the Listener from the Signal
	* @private
	* @name takeAction
	* @param {string} [action] The action the function should take with the given arguments.
	* @param {string} [signalName] Name of the signal. (default = 'any').
	* @param {Object} [arg] The args that will be passed to the Listeners or the function to be unsubscribed.
	*/
    takeAction = function (action, signalName, arg) {
        var signalType = getSignalType(signalName),
            actions = evts[signalType],
            i = 0,
            l,
			takeAction;
        if (actions === undefined) {
            return;
        }
		if (action === 'broadcast') {
			takeAction = fire;
		} else {
			takeAction = unload;
		}
        l = actions.length;
        for (i; i < l; i += 1) {
            takeAction(actions[i], arg, actions, i);
        }
    };
	/**
	* Private function that fires off a Listener.
	* @private
	* @name fire
	* @param {Object} [listener] The object that holds a callback and executing context.
	* @param {Object} [arg] The args that will be passed to the Listener.
	*/
	fire = function (listener, arg) {
		var ctx = listener.obj,
			fn = listener.callback;
		global.setTimeout(function () { fn.call(ctx, arg); }, 0);
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
	unload = function (listener, arg, actions, i) {
		if (listener !== undefined && listener.callback === arg) {
			actions.splice(i, 1);
        }
	};
	/**
	* Private function that sets the signal.
	* @private
	* @name getSignalType
	* @param {string} [signal] The Signal.
	*/
    getSignalType = function (signal) {
        /**
		* If signal is undefined, set signal to 'any'.
		* @signal string
		* @private
		*/
		return signal || 'any';
    };

    return {
		/**
		* Add a Listener to the given Signal.
		* @name signals.subscribe
		* @param {string} [signalName] The signals name.
		* @param {Function} Listener that should be added to the Signal.
		* @param {Object} [context] Context on which the listener will be executed (object that should represent the `this`. (default = window)
		* @function
		*/
        subscribe: function (signalName, fn, context) {
            makeObservable(signalName);
            subscribeToSignal(signalName, fn, context);
        },
		/**
		* Broadcast to all listeners of the given signal to execute.
		* @name signals.broadcast
		* @param {string} [signalName] The signal.
		* @param {Object} [arg] Will be passed to each function as the argument.
		* @function
		*/
        broadcast: function (signalName, arg) {
            takeAction('broadcast', signalName, arg);
        },
		/**
		* Remove a listener from the given signal.
		* @name signals.unsubscribe
		* @param {string} [signalName] The signal.
		* @param {Function} Function that should be removed.
		* @function
		*/
        unsubscribe: function (signalName, fn) {
            takeAction('unsubscribe', signalName, fn);
        },
		/**
		* Check if Signal is observable.
		* @name signals.isObservable
		* @param {string} [signalName] The signal.
		* @return {boolean} if signal is observable.
		* @function
		*/
        isObservable: function (signalName) {
            var signalType = getSignalType(signalName);
            return evts[signalType] !== undefined;
        },
		/**
		* Gets the count of Listeners for the given Signal.
		* @name signals.listenerCount
		* @param {string} [signalName] The signal.
		* @return {Number} Number of Listeners. (default = 0).
		* @function
		*/
        listenerCount: function (signalName) {
            var signalType = getSignalType(signalName),
                actions = evts[signalType];
            return actions !== undefined ? actions.length : 0;
        }
    };
}(this));

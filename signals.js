var signals = (function (global, undefined) {
	"use strict";
    var evts = [],
        makeObservable,
        subscribeToObservable,
        takeAction,
		getSubjectType,
		callFn,
		spliceFn;

    makeObservable = function (type) {
        var subjectType = getSubjectType(type);
        if (evts[subjectType] === undefined) {
            evts[subjectType] = [];
        }
    };
	
    subscribeToObservable = function (type, fn) {
        var subjectType = getSubjectType(type);
        evts[subjectType].push(fn);
    };
	
    takeAction = function (action, type, arg) {
        var subjectType = getSubjectType(type),
            actions = evts[subjectType],
            i = 0,
            l,
			takeAction;
        if (actions === undefined) {
            return;
        }
		if (action === 'onComplete') {
			takeAction = callFn;
		} else {
			takeAction = spliceFn;
		}
        l = actions.length;
        for (i; i < l; i += 1) {
            takeAction(actions[i], arg, actions, i);
        }
    };
	
	callFn = function (fn, arg) {
		global.setTimeout(function () { fn(arg); }, 0);
	};
	
	spliceFn = function (fn, arg, actions, i) {
		if (actions[i] === arg) {
			actions.splice(i, 1);
        }
	};
	
    getSubjectType = function (type) {
        return type || 'any';
    };

    return {
        subscribe: function (type, fn) {
            makeObservable(type);
            subscribeToObservable(type, fn);
        },
        broadcast: function (type, arg) {
            takeAction('onComplete', type, arg);
        },
        unsubscribe: function (type, fn) {
            takeAction('unsubscribe', type, fn);
        },
        isObservable: function (type) {
            var subjectType = getSubjectType(type);
            return evts[subjectType] !== undefined;
        },
        subscriberCount: function (type) {
            var subjectType = getSubjectType(type),
                actions = evts[subjectType];
            return actions !== undefined ? actions.length : 0;
        }
    };
}(this));
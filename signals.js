var signals = (function (global, undefined) {
	"use strict";
    var evts = [],
        makeObservable,
        subscribeToObservable,
        takeAction,
		getSubjectType,
		fire,
		discharge;

    makeObservable = function (type) {
        var subjectType = getSubjectType(type);
        if (evts[subjectType] === undefined) {
            evts[subjectType] = [];
        }
    };

    subscribeToObservable = function (type, fn, context) {
		var subjectType = getSubjectType(type);
		evts[subjectType].push({callback: fn, obj: context || global});
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
			takeAction = fire;
		} else {
			takeAction = discharge;
		}
        l = actions.length;
        for (i; i < l; i += 1) {
            takeAction(actions[i], arg, actions, i);
        }
    };

	fire = function (signal, arg) {
		var ctx = signal.obj,
			fn = signal.callback;
		global.setTimeout(function () { fn.call(ctx, arg); }, 0);
	};

	discharge = function (signal, arg, actions, i) {
		if (signal !== undefined && signal.callback === arg) {
			actions.splice(i, 1);
        }
	};

    getSubjectType = function (type) {
        return type || 'any';
    };

    return {
        subscribe: function (type, fn, context) {
            makeObservable(type);
            subscribeToObservable(type, fn, context);
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
describe("Signals JS", function () {
    var flag_1 = false;
    var flag_2 = false;
	var mockString = '';
    function fakeFunc() {
        flag_1 = true;
    }
	function funcWithArgument(arg){
		flag_1 = arg.flag_1;
		flag_2 = arg.flag_2;
		mockString = arg.mockString;
	}
    function func_1() {};
    function func_2() {};
    function func_3() {};
    beforeEach(function () {
        falg_1 = false;
        falg_2 = false;
		mockString = '';
    });
	
	var Person = function(name) {
		this.name = name;
		signals.subscribe('mock:event', this.setName, this);
	};
	Person.prototype.setName = function () {
			mockString = this.name;
	};
	var person = new Person('Jon');
    it("should be able to subscribe a single func to mock:event", function () {
        signals.subscribe('mock:event', fakeFunc);
        expect(signals.isObservable('mock:event')).toEqual(true);
    });

    it("should be able to subscribe a collection of funcs to mock:collection", function() {
        signals.subscribe('mock:collection', [func_1, func_2, func_3]);
        expect(signals.listenerCount('mock:collection')).toEqual(3);
    });

    it("should throw when adding anything other then a function as the callback", function() {
        var failingFunc = function () {
            signals.subscribe('mock:event', 'fakeFunc');
        };
        expect(failingFunc).toThrow('Callback must be a function');
    });

	it('should be able to set the context of "this" when subscribing', function() {
		runs(function() {
			var person = new Person('Jon');
			signals.broadcast('mock:event');
		});
		waits(150);
        runs(function () {
            expect(mockString).toBe('Jon');
        });
	});
	
    it("should be able to subscribe multiple funcs to mock:event", function () {
        signals.subscribe('mock:event', function () { flag_2 = true; });
        expect(signals.isObservable('mock:event')).toEqual(true);
        expect(signals.listenerCount('mock:event')).toEqual(4);
    });

    it("should be able to broadcast all funcs assoiated with mock:event type", function () {
		runs(function () {
			flag_1 = false;
			flag_2 = false;
            expect(flag_1).toBeFalsy();
            expect(flag_2).toBeFalsy();
            signals.broadcast('mock:event');
        });
        waits(150);
        runs(function () {
            expect(flag_1).toBeTruthy();
            expect(flag_2).toBeTruthy();
        });
    });
	
	it("should be able to broadcast all funcs assoiated with mock:event type and pass an argument", function() {
		runs(function () {
			flag_1 = false;
			flag_2 = false;
			signals.subscribe('mock:event', funcWithArgument);
            expect(flag_1).toBeFalsy();
            expect(flag_2).toBeFalsy();
			expect(mockString).toBe('');
            signals.broadcast('mock:event', { flag_1: true, flag_2: true, mockString: 'Hello, signals!' });
        });
        waits(150);
        runs(function () {
            expect(flag_1).toBeTruthy();
            expect(flag_2).toBeTruthy();
			expect(mockString).toBe('Hello, signals!');
        });
	});
	
    it('should be able to unsubscribe fakeFunc from mock:event', function () {
        expect(signals.listenerCount('mock:event')).toEqual(5);
        signals.unsubscribe('mock:event', fakeFunc);
        expect(signals.listenerCount('mock:event')).toEqual(4);
    });
	
    describe('When using :before and :after', function() {
        var fnIndex = 0,
            beforeWasSuccess = false;
            afterWasSuccess = false;
        signals.subscribe('dynamic:event:before', function() {fnIndex = 1;});
            signals.subscribe('dynamic:event', function() {
                if(fnIndex === 1) {
                    beforeWasSuccess = true;
                }
                fnIndex = 2;
            });
            signals.subscribe('dynamic:event:after', function() {
                if(fnIndex === 2) {
                    afterWasSuccess = true;
                }
                fnIndex = 3;
        });
        it('should call dynamic:event:before functions before functions subscribed to dynamic:event', function() {
            runs(function() {
              signals.broadcast('dynamic:event');
            });
            waits(150);
            runs(function() {
              expect(beforeWasSuccess).toEqual(true);
            }); 
        });    
        it('should call dynamic:event:after functions after functions subscribed to dynamic:event', function() {
            runs(function() {
              signals.broadcast('dynamic:event');
              afterWasSuccess = false;
              beforeWasSuccess = false;
              fnIndex = 0;
            });
            waits(150);
            runs(function() {
              expect(afterWasSuccess).toEqual(true);
            }); 
        });
    });
    
    describe('when using proxy', function(){
        var message, prox;
        signals.subscribe('proxyspec', function( m ) {message = m || 'broadcast proxy';});
        prox = signals.proxy('proxyspec');
        it('should return a broadcast function for the given signal name', function() {
            expect(Object.prototype.toString.call(prox)).toBe('[object Function]');
        });

        it('should not execute the listeners for the given signal name', function(){
            expect(message).toBe(undefined);
        });

        it('should return a function that will call all listeners when executed', function() {
            runs(function() {
              prox();
            });
            waits(150);
            runs(function() {
              expect(message).toBe("broadcast proxy");
            });
        });

        it('should return a function that will call all listeners and pass an arg when executed', function() {
            runs(function() {
              prox('a custome message!');
            });
            waits(150);
            runs(function() {
              expect(message).toBe("a custome message!");
            });
        });

    });
});

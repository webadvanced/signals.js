describe("Signals JS", function () {
    var flag_1 = false;
    var flag_2 = false;
	var mockString = "";
    function fakeFunc() {
        flag_1 = true;
    }
	function funcWithArgument(arg){
		flag_1 = arg.flag_1;
		flag_2 = arg.flag_2;
		mockString = arg.mockString;
	}
    beforeEach(function () {
        falg_1 = false;
        falg_2 = false;
		mockString = '';
    });
    it("should be able to subscribe a single func to mock:event", function () {
        signals.subscribe('mock:event', fakeFunc);
        expect(signals.isObservable('mock:event')).toEqual(true);
    });

    it("should be able to subscribe multiple funcs to mock:event", function () {
        signals.subscribe('mock:event', function () { flag_2 = true; });
        expect(signals.isObservable('mock:event')).toEqual(true);
        expect(signals.subscriberCount('mock:event')).toEqual(2);
    });

    it("should be able to broadcast all funcs assoiated with mock:event type", function () {
		runs(function () {
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
        expect(signals.subscriberCount('mock:event')).toEqual(3);
        signals.unsubscribe('mock:event', fakeFunc);
        expect(signals.subscriberCount('mock:event')).toEqual(2);
    });
});
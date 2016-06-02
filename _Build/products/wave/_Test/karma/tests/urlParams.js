describe('testing functions that utilize the url', function () {

    before(function () {
        fixture.setBase('_Test/karma/fixtures');
        
        wave.windowObject = 'http://www.test.com/_Output/?stamp=12';
    });

    after(function(){
        fixture.cleanup();
        wave.windowObject = null;
    });

    it('removeLastPart should return the url with the last forward slash path removed', function () {
        expect(wave.removeLastPart(wave.windowObject)).to.equal('http://www.test.com/_Output');
    });

    it('removeLastPart with no forward slash should return the unmodified url', function () {
        expect(wave.removeLastPart('http://www.test.com')).to.equal('http://www.test.com');
    });

    it('removeLastPart with non string should return blank url', function () {
        expect(wave.removeLastPart(null)).to.equal('');
        expect(wave.removeLastPart(undefined)).to.equal('');
        expect(wave.removeLastPart(10)).to.equal('');
        expect(wave.removeLastPart()).to.equal('');
    });

    it('getQueryVariable should grab the correct value from the url of the parameter passed', function () {
        expect(wave.getQueryVariable('stamp')).to.equal('12');
    });

    it('getQueryVariable should return 0 if it cant find parameter', function () {
        expect(wave.getQueryVariable('test')).to.equal(0);
    });

    it('getQueryVariable should return 0 if non string passed in', function () {
        expect(wave.getQueryVariable(null)).to.equal(0);
    });
});
describe('urlParams', function () {
    before(function(){
        fixture.setBase('_Test/karma/fixtures');

        windowObject = 'http://www.test.com/';

        var queryString = "?cat=" + 1;
        queryString += "&sub=" + 2;
        queryString += "&last=" + 3;
        queryString += "&search=" + 4;
        queryString += "&filter=" + 5;

        var href = "results.html" + queryString;
        windowObject += href;
    });

    afterEach(function(){
        fixture.cleanup();
        $('body').empty();
        windowObject = null;
    });

    it('getQueryStringValue should grab the correct value from the url of the parameter passed', function () {
        expect(getQueryStringValue('cat')).to.equal('1');
        expect(getQueryStringValue('sub')).to.equal('2');
        expect(getQueryStringValue('last')).to.equal('3');
        expect(getQueryStringValue('search')).to.equal('4');
        expect(getQueryStringValue('filter')).to.equal('5');
    });

    it('getQueryStringValue should return 0 if it cant find parameter', function () {
        expect(getQueryStringValue('test')).to.equal(0);
    });

    it('getQueryStringValue should return 0 if non string passed in', function () {
        expect(getQueryStringValue(null)).to.equal(0);
    });
});
describe('test', function () {
    before(function(){
        fixture.setBase('_Test/karma/fixtures');
    });

    afterEach(function(){
        fixture.cleanup();
    });

    it('test', function () {
        expect(1).to.equal(1);
    });
});
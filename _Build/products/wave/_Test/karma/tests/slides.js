describe('testing functions that utilize the slides variable', function () {
    before(function () {
        fixture.setBase('_Test/karma/fixtures');
    	slides = fixture.load('slide.json');
    });

    after(function(){
        fixture.cleanup();
    });

    it('findNearestSlide should return 0 with param 0', function () {
        expect(wave.findNearestSlide(0)).to.equal(0);
    });

    it('findNearestSlide should return 1 with param 10', function () {
        expect(wave.findNearestSlide(10)).to.equal(1);
    });

    it('findNearestSlide should return 2 with param 20', function () {
        expect(wave.findNearestSlide(20)).to.equal(2);
    });

    it('findNearestSlide should return 1 (round down) with param 19', function () {
        expect(wave.findNearestSlide(19)).to.equal(1);
    });

    it('findNearestSlide should return 2 with decimal param', function () {
        expect(wave.findNearestSlide(20.01)).to.equal(2);
    });

    it('findNearestSlide should return 0 with param -1', function () {
        expect(wave.findNearestSlide(-1)).to.equal(0);
    });

    it('findNearestSlide should return 0 with any param that isnt a number', function () {
        expect(wave.findNearestSlide("10")).to.equal(0);
        expect(wave.findNearestSlide(null)).to.equal(0);
        expect(wave.findNearestSlide(undefined)).to.equal(0);
        expect(wave.findNearestSlide()).to.equal(0);
    });
});
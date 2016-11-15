describe('gym.js', function () {
	var group = null;

    before(function(){
        fixture.setBase('_Test/karma/fixtures');
        group = Gym(fixture.load('gym1.json').concat(fixture.load('gym2.json')));
    });

    afterEach(function(){
        fixture.cleanup();
    });

    it('group should be an instanceof Gym', function () {
        expect(group instanceof Gym).to.equal(true);
    });

    it('Gym should return null if undefined object passed in', function () {
        expect(Gym(undefined)).to.equal(null);
    });

    // FLUENT //

    it("return length of 3 for last workout", function () {
        expect(group.last().length()).to.equal(3);
    });

    // MAX //

    it('return the max weight lifted in the last workout', function () {
        expect(group.last().max()).to.equal(10);
    });

    it('return the max weight lifted overall', function () {
        expect(group.max()).to.equal(20);
    });

    it("return the max weight lifted overall as an object", function () {
        expect(group.max(true)).to.deep.equal({
                "weight": 20,
                "reps": 10,
                "split": "00:00:00:000"
            });
    });

    // VOLUME //

    it('return the volume lifted in the last workout', function () {
        expect(group.last().volume()).to.equal(400);
    });

    it('return the volume lifted overall', function () {
        expect(group.volume()).to.equal(800);
    });
});
describe('workout.js', function () {
	var group = null;

    before(function(){
        fixture.setBase('_Test/karma/fixtures');
        fixture.load('stub.json');
        group = Workout(fixture.json[0]);
    });

    afterEach(function(){
        fixture.cleanup();
    });

    it('group should be an instanceof Workout', function () {
        expect(group instanceof Workout).to.equal(true);
    });

    // FLUENT //

    it("return null if incorrect params passed in", function () {
        expect(group.fromFirst(5)).to.equal(null);
        expect(group.fromFirst(-5)).to.equal(null);
        expect(group.fromFirst('-5')).to.equal(null);
        expect(group.fromLast(5)).to.equal(null);
        expect(group.fromLast(-5)).to.equal(null);
        expect(group.fromFirst('-5')).to.equal(null);
    });

    // MAX //

    it('return the max weight lifted in the first workout', function () {
        expect(group.first().max()).to.equal(90);
    });

    it('return the max weight lifted in the second workout', function () {
        expect(group.fromFirst(1).max()).to.equal(80);
    });

    it('return the max weight lifted in the last workout', function () {
        expect(group.last().max()).to.equal(75);
    });

    it('return the max weight lifted in the second to last workout', function () {
        expect(group.fromLast(1).max()).to.equal(80);
    });

    it('return the max weight lifted overall', function () {
        expect(group.max()).to.equal(90);
    });

    it("return the max weight lifted in the first workout as an object", function () {
        expect(group.fromFirst(1).max(true)).to.deep.equal({
                "weight": 80,
                "reps": 8,
                "split": "00:06:58:861"
            });
    });

    it("return the max weight lifted overall as an object", function () {
        expect(group.max(true)).to.deep.equal({
                "weight": 90,
                "reps": 8,
                "split": "00:01:47:869"
            });
    });

    // VOLUME //

    it('return the volume lifted in the first workout', function () {
        expect(group.first().volume()).to.equal(160);
    });

    it('return the volume lifted in the second workout', function () {
        expect(group.fromFirst(1).volume()).to.equal(160);
    });

    it('return the volume lifted in the last workout', function () {
        expect(group.last().volume()).to.equal(130);
    });

    it('return the volume lifted in the second to last workout', function () {
        expect(group.fromLast(1).volume()).to.equal(160);
    });

    it('return the volume lifted overall', function () {
        expect(group.volume()).to.equal(450);
    });
});
describe('workout.js', function () {
	var group = null;

    before(function(){
        fixture.setBase('_Test/karma/fixtures');
        fixture.load('workout.json');
        group = Workout(fixture.json[0]);
    });

    afterEach(function(){
        fixture.cleanup();
    });

    it('group should be an instanceof Workout', function () {
        expect(group instanceof Workout).to.equal(true);
    });

    it('Workout should return null if undefined object passed in', function () {
        expect(Workout(undefined)).to.equal(null);
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
        expect(group.first().max()).to.equal(100);
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
        expect(group.max()).to.equal(100);
    });

    it("return the max weight lifted in the second workout as an object", function () {
        expect(group.fromFirst(1).max(true)).to.deep.equal({
                "weight": 80,
                "reps": 8,
                "split": "00:06:58:861"
            });
    });

    it("return the max weight lifted overall as an object", function () {
        expect(group.max(true)).to.deep.equal({
                "weight": 100,
                "reps": 8,
                "split": "00:01:23:232"
            });
    });

    // VOLUME //

    it('return the volume lifted in the first workout', function () {
        expect(group.first().volume()).to.equal(2420);
    });

    it('return the volume lifted in the second workout', function () {
        expect(group.fromFirst(1).volume()).to.equal(1120);
    });

    it('return the volume lifted in the last workout', function () {
        expect(group.last().volume()).to.equal(930);
    });

    it('return the volume lifted in the second to last workout', function () {
        expect(group.fromLast(1).volume()).to.equal(1120);
    });

    it('return the volume lifted overall', function () {
        expect(group.volume()).to.equal(4470);
    });

    // INTENSITY //

    it('return intensity for all sets', function () {
        expect(group.intensity()).to.equal('Low');
    });

    // DATE //

    it('return date as a string when only 1 workout is present', function () {
        expect(group.last().date()).to.equal('25/10/2016');
    });

    it('return date as an array when multiple workouts present', function () {
        expect(group.date()).to.deep.equal(['16/10/2016', '21/10/2016', '25/10/2016']);
    });

    it('return date as an array last to first when multiple workouts present and reverse is true', function () {
        expect(group.date(true)).to.deep.equal(['25/10/2016', '21/10/2016', '16/10/2016']);
    });

    // SETS //

    it("return sets for the workouts given", function () {
        expect(group.sets().weight()).to.deep.equal([90, 90, 100, 80, 80, 75, 55]);
    });

    it("return sets for the workouts given in reverse", function () {
        expect(group.sets(true).weight()).to.deep.equal([75, 55, 80, 80, 90, 90, 100]);
    });

    // UTILITY //

    it('return amount of workouts in object', function () {
        expect(group.length()).to.equal(3);
    });
});
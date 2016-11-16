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

    it("return correct length for last workout", function () {
        expect(group.last().length()).to.equal(3);
    });

    it("return correct length for first workout", function () {
        expect(group.first().length()).to.equal(1);
    });

    // MAX //

    it('return the max weight lifted in the first workout', function () {
        expect(group.first().max()).to.equal(20);
    });

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
        expect(group.volume()).to.equal(900);
    });

    // REPS // 

    it('return exercise as a string when only 1 group is present', function () {
        expect(group.first().exercise()).to.equal('test1');
    });

    it('return exercise as an array when multiple groups present', function () {
        expect(group.last().exercise()).to.deep.equal(['test1', 'test2', 'test3']);
    });

    it('return exercise as an array last to first when multiple groups present and reverse is true', function () {
        expect(group.last().exercise(true)).to.deep.equal(['test3', 'test2', 'test1']);
    });

    // WORKOUTS //

    it("return workouts for the groups given", function () {
        expect(group.workouts().sets().weight()).to.deep.equal([20, 10, 10, 10, 10, 10, 10]);
    });

    it("return workouts for the groups given in reverse", function () {
        expect(group.workouts(true).sets().weight()).to.deep.equal([10, 10, 10, 10, 10, 20, 10]);
    });

    // SETS //

    it("return sets for the workouts given", function () {
        expect(group.sets().weight()).to.deep.equal([20, 10, 10, 10, 10, 10, 10]);
    });

    it("return sets for the workouts given in reverse", function () {
        expect(group.sets(true).weight()).to.deep.equal([10, 10, 10, 10, 10, 20, 10]);
    });

    // UTILITY //

    it('return length of sets item for each group', function () {
        group.last().each(function(d, i){
            expect(d.sets().length()).to.equal(1);
        })
    });

    it('return raw object', function () {
        expect(group.first().raw()).to.deep.equal([
            {
                "exercise": "test1",
                "sets": 9,
                "reps": 8,
                "peak": 5,
                "increase": 5,
                "startPercent": 0.75,
                "endPercent": 0.75,
                "incInterval": 3,
                "equipmentWeight": 20,
                "sessions": [
                    {
                        "date": "23/10/2016",
                        "sets": [
                            {
                                "weight": 20,
                                "reps": 10,
                                "split": "00:00:00:000"
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    it('return amount of groups in object', function () {
        expect(group.length()).to.equal(4);
    });
});
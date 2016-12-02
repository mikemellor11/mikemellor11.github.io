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

    it("return first group", function () {
        expect(group.first().data).to.deep.equal([
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
                                "split": "00:00:00:000",
                                "target": true
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    it("return last group", function () {
        expect(group.last().data).to.deep.equal([
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
                        "date": "09/11/2016",
                        "sets": [
                            {
                                "weight": 10,
                                "reps": 10,
                                "split": "00:01:30:502",
                                "target": true
                            }
                        ]
                    }
                ]
            },
            {
                "exercise": "test2",
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
                        "date": "09/11/2016",
                        "sets": [
                            {
                                "weight": 10,
                                "reps": 20,
                                "split": "00:01:30:502",
                                "target": true
                            }
                        ]
                    }
                ]
            },
            {
                "exercise": "test3",
                "sets": 6,
                "reps": 20,
                "peak": 2,
                "increase": 5,
                "startPercent": 0.5,
                "endPercent": 0.5,
                "incInterval": 6,
                "equipmentWeight": 10,
                "sessions": [
                    {
                        "date": "09/11/2016",
                        "sets": [
                            {
                                "weight": 10,
                                "reps": 10,
                                "split": "00:05:00:702",
                                "target": true
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    it("return groups from specified date", function () {
        expect(group.workout('31/10/2016').data).to.deep.equal([
            {
                "exercise": "test2",
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
                        "date": "31/10/2016",
                        "sets": [
                            {
                                "weight": 10,
                                "reps": 10,
                                "split": "00:00:00:000",
                                "target": true
                            }
                        ]
                    }
                ]
            },
            {
                "exercise": "test3",
                "sets": 6,
                "reps": 20,
                "peak": 2,
                "increase": 5,
                "startPercent": 0.5,
                "endPercent": 0.5,
                "incInterval": 6,
                "equipmentWeight": 10,
                "sessions": [
                    {
                        "date": "31/10/2016",
                        "sets": [
                            {
                                "weight": 10,
                                "reps": 10,
                                "split": "00:06:02:160",
                                "target": true
                            }
                        ]
                    }
                ]
            },
            {
                "exercise": "test5",
                "sets": 6,
                "reps": 20,
                "peak": 2,
                "increase": 5,
                "startPercent": 0.5,
                "endPercent": 0.5,
                "incInterval": 6,
                "equipmentWeight": 10,
                "sessions": [
                    {
                        "date": "31/10/2016",
                        "sets": [
                            {
                                "weight": 10,
                                "reps": 10,
                                "split": "00:06:02:160",
                                "target": true
                            }
                        ]
                    }
                ]
            }
        ]);
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
                "split": "00:00:00:000",
                "target": true
            });
    });

    // VOLUME //

    it('return the volume lifted in the last workout', function () {
        expect(group.last().volume()).to.equal(400);
    });

    it('return the volume lifted overall', function () {
        expect(group.volume()).to.equal(900);
    });

    // INTENSITY //

    it('return intensity for all sets', function () {
        expect(group.intensity()).to.equal('Low');
    });

    // TARGET //

    it('return if the target was hit for all sets', function () {
        expect(group.target()).to.equal(true);
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

    // DATE //

    it('return unique dates', function () {
        expect(group.date()).to.deep.equal(['23/10/2016', '31/10/2016', '09/11/2016']);
    });

    it('return unique dates in reverse order', function () {
        expect(group.date(true)).to.deep.equal(['09/11/2016', '31/10/2016', '23/10/2016']);
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
                                "split": "00:00:00:000",
                                "target": true
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
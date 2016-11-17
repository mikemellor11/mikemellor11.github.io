describe('set.js', function () {
	var group = null;

    before(function(){
        fixture.setBase('_Test/karma/fixtures');
        fixture.load('set.json');
        group = Set(fixture.json[0]);
    });

    afterEach(function(){
        fixture.cleanup();
    });

    it('group should be an instanceof Set', function () {
        expect(group instanceof Set).to.equal(true);
    });

    it('Set should return null if undefined object passed in', function () {
        expect(Set(undefined)).to.equal(null);
    });

    // FLUENT //

    it("return null if incorrect params passed in", function () {
        expect(group.fromFirst(15)).to.equal(null);
        expect(group.fromFirst(-15)).to.equal(null);
        expect(group.fromFirst('-15')).to.equal(null);
        expect(group.fromLast(15)).to.equal(null);
        expect(group.fromLast(-15)).to.equal(null);
        expect(group.fromFirst('-15')).to.equal(null);
    });

    // MAX //

    it('return the max weight lifted in the first set', function () {
        expect(group.first().max()).to.equal(90);
    });

    it('return the max weight lifted in the second set', function () {
        expect(group.fromFirst(1).max()).to.equal(90);
    });

    it('return the max weight lifted in the last set', function () {
        expect(group.last().max()).to.equal(70);
    });

    it('return the max weight lifted in the second to last set', function () {
        expect(group.fromLast(1).max()).to.equal(100);
    });

    it('return the max weight lifted overall', function () {
        expect(group.max()).to.equal(100);
    });

    it("return the max weight lifted in the second set as an object", function () {
        expect(group.fromFirst(1).max(true)).to.deep.equal({
            "weight": 90,
            "reps": 10,
            "split": "00:01:47:869"
        });
    });

    it("return the max weight lifted overall as an object", function () {
        expect(group.max(true)).to.deep.equal({
            "weight": 100,
            "reps": 10,
            "split": "00:02:59:001"
        });
    });

    // VOLUME //

    it('return the volume lifted in the first set', function () {
        expect(group.first().volume()).to.equal(720);
    });

    it('return the volume lifted in the second set', function () {
        expect(group.fromFirst(1).volume()).to.equal(900);
    });

    it('return the volume lifted in the last set', function () {
        expect(group.last().volume()).to.equal(560);
    });

    it('return the volume lifted in the second to last set', function () {
        expect(group.fromLast(1).volume()).to.equal(1000);
    });

    it('return the volume lifted overall', function () {
        expect(group.volume()).to.equal(4630);
    });

    // INTENSITY //

    it('return intensity for first set', function () {
        expect(group.first().intensity()).to.equal('Low');
    });

    it('return intensity for last set', function () {
        expect(group.last().intensity()).to.equal('High');
    });

    it('return intensity for all sets', function () {
        expect(group.intensity()).to.equal('Medium');
    });

    // WEIGHT //

    it('return weight as a number when only 1 set is present', function () {
        expect(group.last().weight()).to.equal(70);
    });

    it('return weight as an array when multiple sets present', function () {
        expect(group.weight()).to.deep.equal([90, 90, 100, 65, 100, 70]);
    });

    it('return weight as an array last to first when multiple sets present and reverse is true', function () {
        expect(group.weight(true)).to.deep.equal([70, 100, 65, 100, 90, 90]);
    });

    // REPS // 

    it('return reps as a number when only 1 set is present', function () {
        expect(group.last().reps()).to.equal(8);
    });

    it('return reps as an array when multiple sets present', function () {
        expect(group.reps()).to.deep.equal([8, 10, 8, 10, 10, 8]);
    });

    it('return reps as an array last to first when multiple sets present and reverse is true', function () {
        expect(group.reps(true)).to.deep.equal([8, 10, 10, 8, 10, 8]);
    });

    // SPLIT //

    it('return split as a string when only 1 set is present', function () {
        expect(group.last().split()).to.equal('00:01:23:634');
    });

    it('return split as an array when multiple sets present', function () {
        expect(group.split()).to.deep.equal(["00:04:00:283", "00:01:47:869", "00:01:23:232", "00:02:33:244", "00:02:59:001", "00:01:23:634"]);
    });

    it('return split as an array last to first when multiple sets present and reverse is true', function () {
        expect(group.split(true)).to.deep.equal(["00:01:23:634", "00:02:59:001", "00:02:33:244", "00:01:23:232", "00:01:47:869", "00:04:00:283"]);
    });

    // UTILITY //

    it('return amount of sets in object', function () {
        expect(group.length()).to.equal(6);
    });
});
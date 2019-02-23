describe('weight.js', function () {
	/*var group = null;

    before(function(){
        fixture.setBase('_Test/karma/fixtures');
        group = Weight(fixture.load('weight.json'));
    });

    afterEach(function(){
        fixture.cleanup();
    });

    it('group should be an instanceof Weight', function () {
        expect(group instanceof Weight).to.equal(true);
    });

    it('Weight should return null if undefined object passed in', function () {
        expect(Weight(undefined)).to.equal(null);
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

    it("return first weight", function () {
        expect(group.first().data).to.deep.equal([
            {
                "date": "01/07/2016",
                "weight": 100,
                "calories": 2000,
                "food": {
                    "calories": 10,
                    "protein": 20,
                    "carbohydrate": 30,
                    "fat": 40,
                    "saturates": 50,
                    "sugar": 60,
                    "salt": 70,
                    "price": 80
                }
            }
        ]);
    });

    it("return last weight", function () {
        expect(group.last().data).to.deep.equal([
            {
                "date": "01/09/2016",
                "weight": 300,
                "food": {
                    "calories": 210,
                    "protein": 220,
                    "carbohydrate": 230,
                    "fat": 240,
                    "saturates": 250,
                    "sugar": 260,
                    "salt": 270,
                    "price": 280
                },
                "cardio": 30
            }
        ]);
    });

    it("return weight from specified date", function () {
        expect(group.weight('01/08/2016').data).to.deep.equal([
            {
                "date": "01/08/2016",
                "weight": 200,
                "food": {
                    "calories": 110,
                    "protein": 120,
                    "carbohydrate": 130,
                    "fat": 140,
                    "saturates": 150,
                    "sugar": 160,
                    "salt": 170,
                    "price": 180
                },
                "cardio": 20
            }
        ]);
    });

    it("return empty array from bad date", function () {
        expect(group.weight('01/08/2017').data.length).to.equal(0);
    });

    // SPLIT //

    it('return cardio as a number when only 1 set is present', function () {
        expect(group.last().cardio()).to.equal(30);
    });

    it('return cardio as 0 when it was not done', function () {
        expect(group.first().cardio()).to.equal(0);
    });

    it('return cardio as null when no weight present', function () {
        expect(group.weight('01/07/2017').cardio()).to.equal(null);
    });

    it('return cardio as an array when multiple weight present', function () {
        expect(group.cardio()).to.deep.equal([0, 20, 30]);
    });

    it('return cardio as an array last to first when multiple weight present and reverse is true', function () {
        expect(group.cardio(true)).to.deep.equal([30, 20, 0]);
    });

    // UTILITY //

    it('return length of weight for group', function () {
        expect(group.length()).to.equal(3);
    });

    it('return weight for each item in group', function () {
        group.each(function(d, i){
            expect(!isNaN(d.weight)).to.equal(true);
        })
    });*/
});
describe('lists', function () {
    before(function(){
        fixture.setBase('_Test/karma/fixtures');
        var html = fixture.load('list.html');
        $('body').append(html);
        addRelatedKMToList("testList", 'this is some test text', 10);
    });

    after(function(){
        fixture.cleanup();
        $('body').empty();
        windowObject = null;
    });

    it('addRelatedKMToList text should be equal to the text passed in', function () {
        expect($('#testList li').text()).to.equal('this is some test text');
    });

    it('addRelatedKMToList id should be equal to the id passed in', function () {
        windowObject = $('#testList a')[0].href;
        expect(getQueryStringValue('kmID')).to.equal('10');
    });
});
describe('dropdowns', function () {
    var tempText = 'All';
    var tempId = '2';

    before(function(){
        fixture.setBase('_Test/karma/fixtures');
        var html = fixture.load('dropdown.html');
        $('body').append(html);
    });

    after(function(){
        fixture.cleanup();
        $('body').empty();
    });

    it('getDDLSelectedValue should return 0 if non string passed in', function () {
        expect(getDDLSelectedValue(null)).to.equal('0');
    });

    it('getDDLSelectedValue should return 0 if cannot find element', function () {
        expect(getDDLSelectedValue('doesnt exist')).to.equal('0');
    });

    it('getDDLSelectedValue should return 1 after finding element', function () {
        expect(getDDLSelectedValue("testDrop")).to.equal('1');
    });

    it('ddlAddOption should add an option to the dropdown', function () {
        ddlAddOption("testDrop", tempText, tempId);
        expect($('#testDrop option').length).to.equal(3);
    });

    it('ddlAddOption added option should equal the text passed in', function () {
        expect($('#testDrop option')[2].text).to.equal(tempText);
    });

    it('ddlAddOption added option should equal the id passed in', function () {
        expect($('#testDrop option')[2].value).to.equal(tempId);
    });
});
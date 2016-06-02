module.exports = function(test){
	test_header = function(selector, count){
		clickLink('#headerLogo', url + 'index.html', 'header - logo links to index page');
		clickLink('#breadIndex', url + 'index.html', 'header - home icon links to index page');
		clickPossibleLink('#breadResult', url + 'results.html', 'header - results links to results page');
		clickPossibleLink('#breadQuestion', url + 'keyMessage.html', 'header - question links to key message page');
	}
}
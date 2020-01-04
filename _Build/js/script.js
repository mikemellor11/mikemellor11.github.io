"use strict";

import "es6-promise/auto";

(() => {
	if(navigator.userAgent === 'jsdom'){ return; }

	document.querySelector('html').classList.remove('loading');
	document.querySelector('html').classList.add('loaded');
})();
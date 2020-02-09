module.exports = function (value, options) {
	if(value > 0){
        return `<span class="highlight good">+${value}</span>`;
    } else if(value < 0) {
        return `<span class="highlight bad">${value}</span>`;
    }

    return `<span>${value}</span>`;
};
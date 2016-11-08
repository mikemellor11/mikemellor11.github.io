function baseJS(){
	var globalFocus = null;
	var socket = io('http://127.0.0.1:8888');
	var gymData = {};
	var contentJson = null;
	var today = moment().format('DD/MM/YYYY');

	socket.on('closeWindow', function (data) {
		window.close();
	});

	window.onbeforeunload = function(){
	   socket.emit('closeWindow');
	}

	$('.showMenu').on('click', function(){
		$('.exercises').toggleClass('show');
	});

	socket.on('buildHtml', function (data) {
		contentJson = data;

		updateData();

		buildStaticHtml(data);

		$('body').on('click', '.group', function(){
			buildDynamicHtml();
		});

		$('body').on('submit', '.session__submit', function(e){
			e.preventDefault();

			socket.emit('saveLift', {
				"exercise": $(this).data('exercise'),
				"group": $(this).data('group'),
				"weight": $('.weight', this).val(),
				"reps": $('.reps', this).val(),
				"split":  $('#time').text()
			});

			reset();
		});

		$('body').on('change', '.change__config', function(e){
			e.preventDefault();

			socket.emit('changeConfig', {
				"exercise": $(this).data('exercise'),
				"group": $(this).data('group'),
				"gymDefaults": {
					"sets": $('.sets', this).val(),
		            "reps": $('.reps', this).val(),
		            "peak": $('.peak', this).val(),
		            "increase": $('.increase', this).val(),
		            "startPercent": (+$('.startPercent', this).val() / 100),
		            "endPercent": (+$('.endPercent', this).val() / 100),
		            "incInterval": $('.incInterval', this).val(),
		            "equipmentWeight": $('.equipmentWeight', this).val()
				}
			});
		});
	});

	socket.on('update', function () {
		updateData();
	});

	function buildStaticHtml(){
		$('.dynamic').get(0).innerHTML = '';

		var html = '<form class="exercises">';
		var index = 0;

		contentJson.index.charts.forEach(function(d, i){
			d3.json('media/data/' + d.name + '.json', function(err, JSON){
				if(err){
					console.log("error: ", err);
				}

				html += '<div class="ut-vertAlignTop">';
				html += '<h2>' + d.altName + '</h2>';

				JSON.forEach(function(dl){
					html += '<div>';
					html += '<input class="group checkbox-custom"';
					html += ' data-group="' + d.name + '"';
					html += ' id="' + dl.exercise + '"';
					html += ' value="' + dl.exercise + '"';
					html += (dl.exercise === 'asdf') ? 'checked' : '';
					html += ' type="checkbox"/>';
					html += ' <label class="checkbox-custom-label" for="' + dl.exercise + '">';
					html += '<span class="checkbox-custom-icon"></span><span class="checkbox-custom-text">'
					html += dl.exercise + '</span></label>';
					html += '</div>';
				});
				html += '</div>';

				if (index++ === contentJson.index.charts.length - 1){ 
					html += '</form>';

					$('.dynamic').get(0).innerHTML = html;

					buildDynamicHtml();
				}
			});
		});
	}

	function buildDynamicHtml(){
		$('.dynamic').get(1).innerHTML = '';

		var html = '<div class="ut-tableChildren ut-tableFixed">';
		
		$('.group').each(function(i, d){
			if(d.checked){
				var max = 0;
				var last = 0;
				var target = 0;
				var next = 0;
				var gD = {};
				var currentSet = 0;
				var maxLast = 0;
				var weightSplit = 0;
				var weightIncrement = 2.5;
				var readyForIncrease = false;
				var maxSession = 0;
				var volume = 0;

				for(var key in contentJson.attributes.gymDefaults){
					gD[key] = (
						(gymData[d.value][key] !== undefined) ? 
							gymData[d.value] : 
							contentJson.attributes.gymDefaults
					)[key];
				}

				if(gymData[d.value].sessions){
					if(gymData[d.value].sessions.last().date === today){
						currentSet = gymData[d.value].sessions.last().sets.length;

						volume = gymData[d.value].sessions.last().sets.reduce(function(a, b){
							return a + b.weight;
						}, 0);
					}

					max = d3.max(gymData[d.value].sessions, function(d, i){ 
							return d3.max(d.sets, function(dl, il){
								return dl.weight;
							}); 
						});

					if(gymData[d.value].sessions.last().date !== today){
						maxLast = d3.max(gymData[d.value].sessions.last().sets, function(dl, il){
							return dl.weight;
						});
					} else if(gymData[d.value].sessions.length > 1){
						last = gymData[d.value].sessions.last().sets.last().weight;

						maxLast = d3.max(gymData[d.value].sessions.fromEnd(1).sets, function(dl, il){
							return dl.weight;
						});
					}

					// Intervals set and theres enough sessions to calculate
					if(gD.incInterval > 0 && gymData[d.value].sessions.length > gD.incInterval){
						readyForIncrease = true;

						var todayBegan = 0;

						if(gymData[d.value].sessions.last().date === today){
							todayBegan = 1;
						}

						var holdLastMax = 0;
						var holdVolumeLast = 0;

						for(var i = 0; i < gD.incInterval; i++){
							var tempLastMax = d3.max(gymData[d.value].sessions.fromEnd(i + todayBegan).sets, function(dl, il){
								return dl.weight;
							});

							var tempVolumeLast = gymData[d.value].sessions.fromEnd(i + todayBegan).sets.reduce(function(a, b){
								return a + b.weight;
							}, 0);

							if(tempLastMax < holdLastMax || tempVolumeLast < holdVolumeLast){
								readyForIncrease = false;
								break;
							}

							holdVolumeLast = tempVolumeLast;
							holdLastMax = tempLastMax;
						}
					}

					for (var i = 0; i < gD.sets; ++i) {
						var base = 0;
						var incrememnt = 0;
						var currentWeight = 0;

						if(i < gD.peak){
							if(gD.peak <= 1){
								currentWeight = maxLast;
							} else {
								base = gD.startPercent * maxLast;
								incrememnt = maxLast - base;
								incrememnt /= (gD.peak - 1);
								currentWeight = base + (incrememnt * i);
							}
						} else {
							base = gD.endPercent * maxLast;
							incrememnt = maxLast - base;
							incrememnt /= (gD.sets - gD.peak);
							currentWeight = maxLast - (incrememnt * (i - (gD.peak - 1)));
						}

						if(readyForIncrease){
							currentWeight += gD.increase;
						}

						if(currentWeight > maxSession){
							maxSession = currentWeight;
						}

						if(i === currentSet){
							target = weightIncrement * Math.round(currentWeight / weightIncrement);
						} else if(i === currentSet + 1){
							next = weightIncrement * Math.round(currentWeight / weightIncrement);
						}
					}

					weightSplit = ((target - gD.equipmentWeight) * 0.5);
					if(weightSplit <= 0){
						weightSplit = 0;
					}
				}

				html += '<div class="ut-padding">';
				html += '<h3 class="ut-textAlignCenter">' + d.value + '</h3>';

				html += '<form data-group="' + $(d).data('group') + '" data-exercise="' + d.value + '" class="change__config">';
				html += '<div class="half ut-fontLarge">';
				html += displaySelect(gD.sets, 12, 'Sets', 'sets', 1, 1);
				html += displaySelect(gD.peak, 12, 'Peak', 'peak', 1, 1);
				html += displaySelect((gD.startPercent * 100), 100, 'Start percent', 'startPercent', 1, 0);
				html += displaySelect((gD.endPercent * 100), 100, 'End percent', 'endPercent', 1, 0);
				
				html += '</div>';

				html += '<div class="half ut-fontLarge last">';
				html += displaySelect(gD.increase, 20, 'Increase', 'increase', 2.5, 0);
				html += displaySelect(gD.reps, 30, 'Reps', 'reps', 1, 1);
				html += displaySelect(gD.incInterval, 12, 'Inc interval', 'incInterval', 1, 1);
				html += displaySelect(gD.equipmentWeight, 40, 'Equipment weight', 'equipmentWeight', 2.5, 0);
				html += '</div>';
				html += '</form>';

				html += '<div class="half ut-fontLarge">';
				html += displayField(maxLast, 'Last max', 'callout--alt', 'half');
				html += displayField(volume, 'Volume', 'callout--alt', 'half last');
				html += displayField(readyForIncrease, 'Increase session', readyForIncrease ? 'callout--goal' : 'callout--alt', readyForIncrease ? 'half' : null, ' ');
				if(readyForIncrease){
					html += displayField(maxSession, 'Max session', 'callout--alt', 'half last');
				}
				html += displayField(currentSet, 'Sets done', null, 'half', ' ');
				html += displayField(gD.sets - currentSet, 'Sets left', 'callout--alt', 'half last', ' ');
				html += '</div>';

				html += '<div class="half ut-fontLarge last">';
				html += displayField(last, 'Last');
				html += displayField(target, 'Target', 'callout--goal', 'half');
				html += displayField(weightSplit, 'Weights split', 'callout--alt', 'half last');
				html += displayField(next, 'Next');
				html += '</div>';

				html += '<form data-group="' + $(d).data('group') + '" data-exercise="' + d.value + '" class="session__submit">';

				html += displaySelect(target, 200, 'Weight', 'weight', 2.5, 0);
				html += displaySelect(gD.reps, 30, 'Reps', 'reps', 1, 1);

				html += '<button type="submit" class="button button--full ut-marginTop">Set done</button>'
				html += '</form>';

				html += '</div>'
			}
		});

		html += '</div>';

		$('.dynamic').get(1).innerHTML = html;
	}

	function updateData(){
		var index = 0;

		contentJson.index.charts.forEach(function(d, i){
			d3.json('media/data/' + d.name + '.json', function(err, JSON){
				if(err){
					console.log("error: ", err);
				}
				
				JSON.forEach(function(dl){
					gymData[dl.exercise] = dl;
				});

				if (index++ === contentJson.index.charts.length - 1){ 
					buildDynamicHtml();
				}
			});
		});
	}
}

function pageJS(){

}

function displayField(value, name, callout, classes, suffix){
	var html = '<div class="callout ut-marginBottom ' + ((callout) ? callout : '') + ' ' + ((classes) ? classes : '') + '">';
	html += '<h3 class="ut-noMargin">' + name + '</h3>';
	html += '<p class="ut-noMargin">' + value + ' ' + ((suffix) ? suffix : 'kg') + '</p>';
	html += '</div>';
	return html;
}

function displaySelect(current, length, name, handler, inc, start){
	var html = '<label for="' + handler + '" class="half ut-textAlignRight">' + name + '</label>';
	html += '<select id="' + handler + '" class="' + handler + ' half last">';
	for(var il = start; il <= length; il+=inc){
		html += '<option ' + ((il === current) ? 'selected' : '') + '>' + il + '</option>';
	}
	html += '</select>';
	return html;
}














// STOPWATCH

function update() {
	$time.innerHTML = formatTime(x.time());
}

function start() {
	clocktimer = setInterval("update()", 1);
	x.start();
}

function stop() {
	x.stop();
	clearInterval(clocktimer);
}

function reset() {
	stop();
	x.reset();
	update();
	start();
}

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
	return newTime;
}

var	clsStopwatch = function() {
	// Private vars
	var	startAt	= 0;	// Time of last start / resume. (0 if not running)
	var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

	var	now	= function() {
			return (new Date()).getTime(); 
		}; 

	// Public methods
	// Start or resume
	this.start = function() {
			startAt	= startAt ? startAt : now();
		};

	// Stop or pause
	this.stop = function() {
			// If running, update elapsed time otherwise keep it
			lapTime	= startAt ? lapTime + now() - startAt : lapTime;
			startAt	= 0; // Paused
		};

	// Reset
	this.reset = function() {
			lapTime = startAt = 0;
		};

	// Duration
	this.time = function() {
			return lapTime + (startAt ? now() - startAt : 0); 
		};
};

var x = new clsStopwatch();
var $time;
var clocktimer;

$time = document.getElementById('time');
update();

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

if (!Array.prototype.fromEnd){
    Array.prototype.fromEnd = function(num){
        return this[this.length - (num + 1)];
    };
};
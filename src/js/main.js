// (function() {

	// add titles to speed buttons...
	$('.sBtn').attr('title', 'Set the playback percentage while keeping the pitch preserved.');

	var WAVESURFER_ELEMENTS = {
		$progressWave: null
	};
	function updateWaveSurferElements() {
		WAVESURFER_ELEMENTS.$progressWave = $(wavesurfer.mediaContainer).children(1).children(0).slice(0, 1);
	}

	var REGION = {
		current: [],
		creating: false,
		clickedButton: false,
		startCreate: -1,
		holdingDown: false,
		singleExistingRegion: null,

		updateCurrent: function() {
			var arr = Object.keys(wavesurfer.regions.list);
			this.current = arr.slice();		
		},

		getRegion: function() {
			switch(this.current.length) {
				case 0:
					console.log('Why does the current array have nothing in it?');
					return;
				case 1:
					return this.current[0];
				default:
					console.log('Why does the current array have more than one item?');
					return;
			}
		},

		getStartTime: function() {
			return wavesurfer.regions.list[this.getRegion()].start
		}
	}

	var RESTART = {
		time : 0,
		queuePoint : -1,
		scrollOffset : 0,
		previousClick : 0,
		previousScrollLeftWhenClicked : 0,

		setTime : function(seconds) {
			this.time = seconds;
			this.setVerticalLine(seconds);
		},

		// deal with only the visual component
		setVerticalLine : function(seconds) {
			var progressRatio = seconds / wavesurfer.getDuration();
			var pos = (Math.round(wavesurfer.drawer.width) * progressRatio) / wavesurfer.params.pixelRatio;
			pos -= 2; // necessary offset
			pos -= this.scrollOffset; // updated every scroll event
			this.previousClick = pos;
			this.previousScrollLeftWhenClicked = this.scrollOffset;
			$('#verticalLine').css('left', pos + 'px');
		},

		getTime : function() {
			return this.time;
		},

		setQueuePoints : function(seconds) {
			this.queuePoint = seconds;
		},

		updateScrollOffset: function(scrollLeft) {
			RESTART.scrollOffset = scrollLeft; // update
			$('#verticalLine').css('left', this.previousClick - (scrollLeft - this.previousScrollLeftWhenClicked) + 'px');
		
		}
	}

	var SEEK = {
		rebound : false,
		needsUpdated : false,

		changeCursor : function() {
			var ratio = RESTART.queuePoint / wavesurfer.getDuration();
			setTimeout(function() {
				wavesurfer.seekTo(ratio);
			}, 10);
			RESTART.changeSeek = false;
			this.rebound = true;
		}
	}

	var FADE_IN_OUT_TIME = 0.05;
	var fadeOut = function () {
		var ws = wavesurfer.backend;
		ws.myGain.gain.setValueAtTime(ws.myGain.gain.value, ws.ac.currentTime);
		ws.myGain.gain.exponentialRampToValueAtTime(0.01, ws.ac.currentTime + FADE_IN_OUT_TIME);
	};
	var fadeIn = function () {
		var ws = wavesurfer.backend;
		ws.myGain.gain.setValueAtTime(ws.myGain.gain.value, ws.ac.currentTime);
		ws.myGain.gain.exponentialRampToValueAtTime(1, ws.ac.currentTime + FADE_IN_OUT_TIME);
	};

	var spacePause = function () {
		fadeOut();
		setTimeout(function () {
			wavesurfer.pause();
		}, FADE_IN_OUT_TIME * 1000)
	};

	var spacePlay = function () {
		wavesurfer.play(RESTART.getTime());
		setTimeout(function () {
			fadeIn();
		}, FADE_IN_OUT_TIME * 1000);
	};

	// everything button clicking //
	//							  //
	//							  //
	
	// handle speed button clicking
	var lastSpeedButtonPressed = ['555', 53]; // keep reference, initial is 100%
	$('.sBtn').click(function (event) {
		var id = event.currentTarget.id;

		// ignore if already selected speed
		if (id === lastSpeedButtonPressed[0]) return false;
		
		var $ele = $('#' + id);
		
		// change speed on backend
		var pct = parseFloat($ele.data().percent);
		wavesurfer.backend.slowDownPlaybackRate = pct;
		wavesurfer.setPlaybackRate(pct);	
		
		// button color
		$ele.addClass("btn-primary")
		$('#' + lastSpeedButtonPressed[0]).removeClass("btn-primary"); 
  		lastSpeedButtonPressed[0] = id;
  		lastSpeedButtonPressed[1] = hotkeyButtons[id];
	});

	// toggle centering
	$('#ccc').click(function () {
		wavesurfer.params.autoCenter = !wavesurfer.params.autoCenter;
		var value = hotkeyButtons['ccc'];
		value[3] ? $('#ccc').removeClass('btn-primary') : $('#ccc').addClass('btn-primary');
		value[3] = !value[3]; // flip
	});
	// restart bar catch up
	$('#qqq').click(function () {
		var bkend = wavesurfer.backend;
		RESTART.setTime(bkend.getPlayedPercents() * bkend.getDuration());
	});
	$('#sss').click(function () {
		var clientWidth = wavesurfer.drawer.wrapper.clientWidth; // get center px
		var centerPix = (RESTART.scrollOffset + (clientWidth / 2)) * wavesurfer.params.pixelRatio;
		var progress = centerPix / wavesurfer.drawer.width; // change to progress ratio
		wavesurfer.seekTo(progress); // seek to that point
	});
	// scroll
	$('#aaa').click(function() { scrollMacro(-50)} );
	$('#ddd').click(function() { scrollMacro(50)} );
	$('#space').click(function() {
		if (wavesurfer.isPlaying()) {
			spacePause();
		} else {
			spacePlay();
		}	
	})
	function scrollMacro(distance) {
		$(wavesurfer.drawer.wrapper).scrollLeft(distance + RESTART.scrollOffset);
		hotkeyButtons['ccc'][3] && $('#ccc').click(); // if auto-centering on, turn off
	}
	// region making //$$
	$('#www').click(function() {
		if (!wavesurfer.isPlaying()) return false;
		
		// special case keyboard boom
		if (REGION.holdingDown && !REGION.creating) {
			REGION.creating = true;
			REGION.startCreate = wavesurfer.backend.getCurrentTime();
			WAVESURFER_ELEMENTS.$progressWave.css("border-right-color", "#337ab7"); // change progress bar color
			return false;
		}

		// filter out holding keyboard down noise
		if (REGION.holdingDown) return false;

		if (REGION.creating) { // then stop
			wavesurfer.addRegion({
				start: REGION.startCreate,
				end: wavesurfer.backend.getCurrentTime()
			});
			REGION.creating = false;
			// do without bugging out
			REGION.updateCurrent();
			RESTART.setQueuePoints(REGION.getStartTime());
			SEEK.needsUpdated = true;
			wavesurfer.seekTo(REGION.startCreate / wavesurfer.backend.getDuration());
			WAVESURFER_ELEMENTS.$progressWave.css("border-right-color", wavesurfer.params.cursorColor); // change progress bar color back
		} else { // start
			REGION.creating = true;
			REGION.startCreate = wavesurfer.backend.getCurrentTime();
			WAVESURFER_ELEMENTS.$progressWave.css("border-right-color", "#337ab7"); // change progress bar color
		}
	});
	$('#zzz').click(function() { zoom(-10) });
	$('#xxx').click(function() { zoom(10) });
	var ZOOM = 20;
	function zoom(num) {
		// if above minimum and coming down
		// OR
		// if below max and coming up
		if (((ZOOM > 10) && (num < 0)) || ((ZOOM < 181) && (num > 0))) {
			ZOOM += num; // adjust
			wavesurfer.zoom(ZOOM); // and zoom
		}
	}

	var hotkeyButtons = {
		// id  : keyCode, keyCode-Alt, hold   , state

		// 1-7 are the speed hotkeys
		'111'  : [ 49   , null       , true  ],
		'222'  : [ 50   , null       , true  ],
		'333'  : [ 51   , null       , true  ],
		'444'  : [ 52   , null       , true  ],
		'555'  : [ 53   , null       , true  ],
		'666'  : [ 54   , null       , true  ],
		'777'  : [ 55   , null       , true  ],

		// togglers with state
		'ccc'  : [ 99   , 67         , true  , false],

		// everything else
		'qqq'  : [ 113  , 81         , false ],
		'www'  : [ 119  , 87         , false ],
		'eee'  : [ 101  , 69         , false ],
		'rrr'  : [ 114  , 82         , false ],
		'aaa'  : [ 97   , 65         , false ],
		'sss'  : [ 115  , 83         , false ],
		'ddd'  : [ 100  , 68         , false ],
		'zzz'  : [ 122  , 90         , false ],
		'xxx'  : [ 120  , 88         , false ],
	};
	// SPECIAL SPACE BAR CASE
	window.onkeydown = function (e) {
		if (e.keyCode === 32) {
    		e.preventDefault();
    		$('#space').click();
    		$('#space').addClass('btn-primary');
		}
	}
	window.onkeyup = function (e) {
		if (e.keyCode === 32) {
			e.preventDefault();
			$('#space').removeClass('btn-primary');
		}
	}

	// translate key downs into clicks
	var keysCurrentlyPressed = [];
	$(document).keypress(function(e) { // key press will be ignored if modifier key is pressed
		$.each(hotkeyButtons, function(key, value) {
			if (e.keyCode === value[0] || e.keyCode === value[1]) { // found key
				var $key = $('#' + key);
				if (!value[2]) { // if not toggle
					$key.addClass('btn-primary');
					if ($.inArray(key, keysCurrentlyPressed) === -1) { // if not already in there
						keysCurrentlyPressed.push(key);
					}
				}
				
				// special case for region create
				if (key === 'www') {
					REGION.holdingDown = true;
				}
				$key.click(); // 'click' the button, add class

				return false; // break out of loop
			}
		});
	});
	$(document).keyup(function(e) {
		$.each(hotkeyButtons, function(key, value) {
			if (e.keyCode === value[0] || e.keyCode === value[1]) { // found key
				var iToRemove = $.inArray(key, keysCurrentlyPressed);
				if (iToRemove !== -1 ) { // if it's in there
					keysCurrentlyPressed.splice(iToRemove, 1);
					$('#' + key).removeClass('btn-primary')
				}

				// special case for region create
				if (key === 'www') {
					REGION.holdingDown = false;
					$('#' + key).click();
				}

				return false; // found and processed, then exit
			}
		});
	});



	// var LOWQUALITY = true;
	// var makeHighQuality = function() {
	// 	// LOWQUALITY = false;
	// 	DEFAULT_SEQUENCE_MS = 130;
	// 	DEFAULT_SEEKWINDOW_MS = 25;
	// 	DEFAULT_OVERLAP_MS = 40;
	// 	// $('#low').removeClass('btn-primary');
	// 	// $('#high').addClass('btn-primary');
	// };
	// var makeLowQuality = function() {
	// 	// LOWQUALITY = true;
	// 	DEFAULT_SEQUENCE_MS = USE_AUTO_SEQUENCE_LEN;
	// 	DEFAULT_SEEKWINDOW_MS = USE_AUTO_SEEKWINDOW_LEN;
	// 	DEFAULT_OVERLAP_MS = 8;
	// 	// $('#low').addClass('btn-primary');
	// 	// $('#high').removeClass('btn-primary');
	// };
	// $('#low').click(makeLowQuality);
	// $('#high').click(makeHighQuality);
	$(document).keydown(function(e) {

		// switch(e.which) {
		// 		return false;
		// 		break;
		// 	case 113: // q // move RESTART bar to current seeker
		// 		$('#qqq').click();
		// 		moveRestartBarToCurrentPoint();
		// 		return false;
		// 		break;
		// 	// case 116: // t // toggle low / high quality
		// 	// 	(LOWQUALITY) ? makeHighQuality() : makeLowQuality(); // flip
		// 	// 	return false;
		// 	// 	break;
		// }
	});
	// put restart line at current playback location




	// create wavefurfer
	var wavesurfer = WaveSurfer.create({
	    container: '#waveform',
	    scrollParent: true,
	    cursorWidth: 2,
	    barWidth: 1,
	    renderer: 'MultiCanvas', // support for rendering longer files
	    autoCenter: false // but jump after a few seconds
	});

	function activateHotkeys() {
		$('.inactive').each(function(i, btn) {
			btn.disabled = false;
		});

		$('.inactive').removeClass('inactive');

	}

	// on wavesurfer load
	wavesurfer.on('ready', function () {

		// load wavesurfer elements into global object
		updateWaveSurferElements();

		// activate hotkeys
		activateHotkeys();


	    // wavesurfer.play();
		wavesurfer.enableDragSelection({
			drag: true,
			resize: true,
			loop: false,
		});

		// load my RESTART div
		var ctnr = wavesurfer.container;
		$('#verticalLine').css({
		    'top' : ctnr.offsetTop + 'px',
			'height' : ctnr.offsetHeight + 'px'
		});
	});

	wavesurfer.on('play', function() {
 		wavesurfer.backend.myGain.gain.exponentialRampToValueAtTime(1.0, wavesurfer.backend.ac.currentTime + 0.05);
		
		// wavesurfer.backend.addOnAudioProcess(); // not sure if this is piling processing / memory
	})

	wavesurfer.on('seek', function(percentSeek) {
		if (!SEEK.rebound) { // not a rebound
			var seekTimeInSeconds = percentSeek * wavesurfer.getDuration();

			// determine if click or drag...
			if (SEEK.needsUpdated) { // drag
				// (delete existing regions--HANDLED ELSEWHERE)
				RESTART.setTime(RESTART.queuePoint); // set bar at saved queue point
				SEEK.changeCursor(); // set seek to beginning of drag window
				SEEK.rebound = true; // change rebound to true
				SEEK.needsUpdated = false;
			} else { // click
				if (REGION.singleExistingRegion) REGION.singleExistingRegion.remove();
				RESTART.setTime(seekTimeInSeconds); // set RESTART bar to seek location
			}
		} else {
			SEEK.rebound = false;
		}
	});

	// at the beginning of a region creation...
	wavesurfer.on('region-created', function(newRegion) {
		if (REGION.singleExistingRegion) REGION.singleExistingRegion.remove();
		REGION.singleExistingRegion = newRegion;
	});

	// at the end of region creation
	wavesurfer.on('region-update-end', function() {
		REGION.updateCurrent();
		RESTART.setQueuePoints(REGION.getStartTime());
		SEEK.needsUpdated = true;
	});

	wavesurfer.on('region-out', function() {
		wavesurfer.pause();
		wavesurfer.play(RESTART.getTime());
	});

	wavesurfer.on('finish', function() {
		// go back to time
		wavesurfer.play(RESTART.getTime());
	});

	wavesurfer.on('scroll', function(scrollObject) {
		var scrollLeft = scrollObject.path[0].scrollLeft;
		RESTART.updateScrollOffset(scrollLeft);
	});


	// demo button handlers
	$('#loadSpokenWordDemo').click(function() {
		resetProgressBar();
		wavesurfer.load('https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');
	});

	$('#loadMusicDemo').click(function() {
		resetProgressBar();
		wavesurfer.load('https://dl.dropboxusercontent.com/u/67477162/perm/cosmos.mp3');
	});
	$('#loadDirectLink').click(function() {
		resetProgressBar();
		var link = $('#loadDirectLinkInput').val();
		wavesurfer.load(link);
	});


	wavesurfer.on('loading', function (obj) {
		var $bar = $('#progress-bar');
		var str = obj + '%';

		$bar.text(str); // update text value
	    $bar.css("width", str); // update width
	    $bar.attr('aria-valuenow', obj)
	});
	wavesurfer.on('error', function (obj) {
		alert("An error has occured. Maybe the file was so awesome we couldn't handle it. Maybe you tried to load an unsupported audio file. Maybe. More Details: " + obj);
	});

	function resetProgressBar() {
		$('#progress-bar').text('0%').css('width', '0%').attr('aria-valuenow', 0);
	}

	wavesurfer.on('zoom', function (minPxPerSec) {
		// redraw restart bar
		RESTART.setTime(RESTART.time);
	});


$(document).ready(function() { 
    $('.inactive').each(function(i, btn) {
        btn.disabled = true;
    })    
})

// }())
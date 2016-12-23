// (function() {

	var REGIONS = {
		current: [],

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

	// bind spacebar	
	document.addEventListener("keydown", function(event) {
		if (event.keyCode === 32) {
			if (wavesurfer.isPlaying()) {
				spacePause();
			} else {
				spacePlay();
			}
			event.preventDefault();
		}
	});



	// radio button control
	$("input[name='percent']").change(function(t) {
		var percent = 0.01 * parseInt(t.target.id); // change to int then percent to decimal
		wavesurfer.backend.slowDownPlaybackRate = percent;
		wavesurfer.setPlaybackRate(percent);

	});

	// create wavefurfer
	var wavesurfer = WaveSurfer.create({
	    container: '#waveform',
	    scrollParent: true,
	    cursorWidth: 2,
	    barWidth: 1,
	    autoCenter: false // but jump after a few seconds
	});

	// load audio
	// wavesurfer.load('../data/cosmos.mp3');
	wavesurfer.load('https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');

	// on wavesurfer load
	wavesurfer.on('ready', function () {
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
				if (singleExistingRegion) singleExistingRegion.remove();
				RESTART.setTime(seekTimeInSeconds); // set RESTART bar to seek location
			}
		} else {
			SEEK.rebound = false;
		}
	});

	var singleExistingRegion = null;

	// at the beginning of a region creation...
	wavesurfer.on('region-created', function(newRegion) {
		if (singleExistingRegion) singleExistingRegion.remove();
		singleExistingRegion = newRegion;
	});

	// at the end of region creation
	wavesurfer.on('region-update-end', function() {
		REGIONS.updateCurrent();
		RESTART.setQueuePoints(REGIONS.getStartTime());
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
	})


// }())
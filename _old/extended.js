'use strict';

// add the magic
WaveSurfer.stretchPreserve = {

	play: function () {
		this.backend.gainNode.disconnect();
		this.backend.gainNode.connect(this.node);
		this.node.connect(this.backend.ac.destination);

	},

	pause: function () {
		this.node.disconnect();
	},

	init: function (bkend) { // get audio context from here..........
		var self = this;
		this.backend = bkend; // make it attached to this object
		// this.backend.gainNode.disconnect(); // disconnect old one

		this.t = new RateTransposer(true);
		this.s = new Stretch(true);
		this.BUFFER_SIZE = 1024; // his was WaveSurfer.WebAudio.scriptBufferSize and was much smaller
		this.samples = new Float32Array(this.BUFFER_SIZE * 2);

		this.buffer = bkend.buffer;
		this.node = this.backend.ac.createScriptProcessor(this.BUFFER_SIZE, 2, 2);
		this.s.tempo = 0.5;
		this.node.onaudioprocess = function (e) {
		    var l = e.outputBuffer.getChannelData(0);
		    var r = e.outputBuffer.getChannelData(1);
		    var framesExtracted = self.f.extract(self.samples, self.BUFFER_SIZE);
		    if (framesExtracted == 0) {
		        self.node.disconnect(); // pause
		    }
		    for (var i = 0; i < framesExtracted; i++) {
		        l[i] = self.samples[i * 2];
		        r[i] = self.samples[i * 2 + 1];
		    }			
		}

		this.source = {
			extract: function (target, numFrames, position) {
			    var l = self.buffer.getChannelData(0);
			    var r = self.buffer.getChannelData(1);
			    for (var i = 0; i < numFrames; i++) {
			        target[i * 2] = l[i + position];
			        target[i * 2 + 1] = r[i + position];
			    }
			    return Math.min(numFrames, l.length - position);
			}
		};

		this.f = new SimpleFilter(this.source, this.s); // need to be var f?

	}
}
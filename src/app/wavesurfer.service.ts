import { Injectable } from '@angular/core';

@Injectable()
export class WavesurferService {

    // what is the typescript thing to do?
    // TODO: Redo this
    constructor() {
        
        var REGIONS = {
            current: [],

            updateCurrent: function() {
                var arr = Object.keys(wavesurfer.regions.list);
                this.current = arr.slice();		
            },
            
            deleteExisting: function() {
                // remove any regions (removeall doesn't work well, IMO)
                var cR = REGIONS.current;
                for (let i = 0; i < cR.length; i++) {
                    wavesurfer.regions.list[cR[i]].remove();
                }
                // get all existing regions (should only be 1) and update
                this.updateCurrent();
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

            setTime : function(seconds) {
                this.time = seconds;
                this.setVerticalLine(seconds);
            },

            // deal with only the visual component
            setVerticalLine : function(seconds) {
                var progressRatio = seconds / wavesurfer.getDuration();
                var pos = (Math.round(wavesurfer.drawer.width) * progressRatio) / wavesurfer.params.pixelRatio;
                pos += 6; // necessary offset
                pos -= this.scrollOffset; // updated every scroll event
                $('#verticalLine').css('left', pos + 'px');
            },

            getTime : function() {
                return this.time;
            },

            setQueuePoints : function(seconds) {
                this.queuePoint = seconds;
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

        // bind spacebar	
        document.addEventListener("keydown", function(event) {
            if (event.keyCode === 32) {
                if (wavesurfer.isPlaying()) {
                    wavesurfer.pause();
                } else {
                    wavesurfer.play(RESTART.getTime());
                }
                event.preventDefault();
            }
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
        wavesurfer.load('../data/cosmos.mp3');

        // on wavesurfer load
        wavesurfer.on('ready', function(){
            wavesurfer.play();
            wavesurfer.enableDragSelection({
                drag: true,
                resize: true,
                loop: true,
            });

            // load my RESTART div
            var ctnr = wavesurfer.container;
            $('#verticalLine').css({
                'top' : ctnr.offsetTop + 'px',
                'height' : ctnr.offsetHeight + 'px'
            });
        });

        wavesurfer.on('play', function() {

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
                    REGIONS.deleteExisting(); // delete existing regions
                    RESTART.setTime(seekTimeInSeconds); // set RESTART bar to seek location
                }
            } else {
                SEEK.rebound = false;
            }
        });

        // at the beginning of a region creation...
        wavesurfer.on('region-created', function() {
            REGIONS.deleteExisting();
        });

        // at the end of region creation
        wavesurfer.on('region-update-end', function() {
            REGIONS.updateCurrent();
            RESTART.setQueuePoints(REGIONS.getStartTime());
            SEEK.needsUpdated = true;
        });

        wavesurfer.on('finish', function() {
            // go back to time
            wavesurfer.play(RESTART.getTime());
        });

        wavesurfer.on('scroll', function(scrollObject) {
            RESTART.scrollOffset = scrollObject.path[0].scrollLeft; // update
        })

    }

    


}

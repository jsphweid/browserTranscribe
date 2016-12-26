# browserTranscribe
Web App that allows you to load an audio file in your browser and hop all around the file easily, repeat a section indefinitely, and slow down the tempo without changing pitch.

## Dev Environment

`git clone https://github.com/jsphweid/browserTranscribe.git` to clone to directory

`npm install` to download dependencies

`npm start` to serve up the app

`grunt js-hint` to jshint on '/js' files and `grunt html-hint` to root html files (index.html)

`grunt build` to make production build to '/build' folder


## TODO
 - ~Add import audio file, browse, drop. More advanced: get mp3 from youtube (legal?)~
 - ~~Add hotkeys to common functions (advanced restart bar, change speed, scroll left/right, etc.)~~
 - ~~Add hotkey map~~
 - fix bug where restart bar loses the place when zoomed in / out
 - ~add glyphicons to make it look better~
 - better color scheme (make it less bootstrapy)
 - improve quality for 25, 35, 50 by changing some backend settings when those are selected
 - padding on the bottom
 - have no div for wavesurfer on start? (still an issue? https://github.com/katspaugh/wavesurfer.js/issues/899)
 - multicanvas support will fix longer files?
 - Find a better way to integrate the time stretch / preserve with [WaveSurfer](wavesurfer-js.org). In the current version, I achieved this by making a mess in his library file, which I would like to abstract in the near future.
 - There are still some clicks with starting and stopping. I want to find a better way to fade in / out so that the clicks will disappear. And I want to do this by, again, not messing up WaveSurfer's library file.

## Future Direction
##### Drum Transcribing
This project will be complete for me when there is a second canvas in the bottom half of the screen that corresponds to the wave vertically. You can click and create a 

## PROBLEMS?
##### OSX - Right/Left Scrolling keeps changes webpages
You might be able to change the settings here:
`System Preferences > Trackpad > More Gestures > Swipe between pages --> Swipe with three fingersit`
Or just write this to the terminal: `defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE`

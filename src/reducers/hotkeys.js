import * as types from '../constants/hotkeys'

const defaultState = {
    currentPlaybackRate: 1.0,
    isCreatingRegion: false,
    isPlaying: false
}

const hotkeys = (state = defaultState, action = {}) => {

    switch (action.type) {

        case types.CHANGE_PLAYBACK_RATE:

            return {
                ...state,
                currentPlaybackRate: action.playbackRate
            }

        case types.MAKE_RESTART_BAR_CURRENT:
// implement, keep track of current location
            return {
                ...state,
            }

        case types.TOGGLE_IS_CREATING_REGION:

            return {
                ...state,
                isCreatingRegion: !action.currentIsCreatingRegion
            }

        case types.TOGGLE_IS_PAUSED:

            return {
                ...state,
                isPaused: !action.currentIsPaused
            }


        default:
            return state

    }

}

export default hotkeys

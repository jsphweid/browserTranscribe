import * as types from '../constants/hotkeys'

export const changeSpeed = (newPlaybackRate) => {

    return {
        type: types.CHANGE_PLAYBACK_RATE,
        playbackRate: newPlaybackRate
    }

}

export const makeRestartBarCurrent = () => {

    return {
        // pass data
        type: types.MAKE_RESTART_BAR_CURRENT
    }

}

export const toggleIsCreatingRegion = (currentIsCreatingRegion) => {

    return {
        type: types.TOGGLE_IS_CREATING_REGION,
        currentIsCreatingRegion
    }

}

export const toggleIsPaused = (currentIsPaused) => {

    return {
        type: types.TOGGLE_IS_PAUSED,
        currentIsPaused
    }

}
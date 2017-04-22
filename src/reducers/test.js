import * as types from '../constants/test'

const defaultState = {
    something: null,
}

const test = (state = defaultState, action = {}) => {

    switch (action.type) {

        // case types.LOGIN_USER_SUCCESS:
        //
        //     return {
        //         ...state,
        //         something: action.data.something
        //     }


        default:
            return state

    }

}

export default test

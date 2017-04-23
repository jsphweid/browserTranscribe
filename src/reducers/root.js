import { combineReducers } from 'redux'

import test from './test'
import hotkeys from './hotkeys'

const rootReducer = combineReducers({
    hotkeys,
    test
})

export default rootReducer

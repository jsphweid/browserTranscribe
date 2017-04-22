import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers/root'
import thunk from 'redux-thunk'

export default function configureStore(initialState: {}) {

    const middleware = [thunk]

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    return createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(...middleware))
    )

}

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/app'
import configureStore from './middleware/store'

window.onload = function load() { // eslint-disable-line no-undef

    const initialState = typeof window.initialState !== 'undefined' ? window.initialState : {}

    const store = configureStore(initialState)

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app') // eslint-disable-line no-undef
    )

}

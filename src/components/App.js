import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter, Route, Switch } from 'react-router-dom'

import configureStore from '../middleware/store'

import HomePage from './pages/Home'

let initialState = {}

const store = configureStore(initialState)

const App = () => (
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route exact path="/" component={HomePage} />
            </Switch>
        </HashRouter>
    </Provider>
)

export default App

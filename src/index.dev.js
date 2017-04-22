import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './components/App'
import styles from './assets/scss/styles.scss'

const render = (Component) => {

    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('app')
    )

}

if (module.hot) {

    module.hot.accept('./components/App', () => {

        render(App)

    })

}

render(App)

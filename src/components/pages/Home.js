import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Hotkeys from '../elements/Hotkeys'

class MainApp extends Component {

    render() {
        return (
            <Hotkeys />
        )
    }
}


const mapStateToProps = (state) => ({
    // servicesList: state.shop.servicesList,
})

export default connect(mapStateToProps)(MainApp)

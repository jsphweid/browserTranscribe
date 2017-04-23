import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {Button, Grid, Row, Glyphicon} from "react-bootstrap";

import config from '../../config'
import { changeSpeed, makeRestartBarCurrent, toggleIsCreatingRegion, toggleIsPaused } from '../../actions/hotkeys'

class Hotkeys extends Component {

    static propTypes = {
        currentPlaybackRate: PropTypes.number,
        dispatch: PropTypes.func,
        hotkeysDisabled: PropTypes.bool,
        isCreatingRegion: PropTypes.bool,
        isPaused: PropTypes.bool
    }

    constructor() {

        super()

        this.handleSpeedChange = this.handleSpeedChange.bind(this)

    }

    handleSpeedChange(data) {

        this.props.dispatch(changeSpeed(parseFloat(data.target.id)))

    }



    render() {

        return (
            <Grid className="hotkeys">
                <Row>
                    {config.possiblePlaybackRatesAsInts.map((speed) => {
                        return (
                            <Button
                                key={speed}
                                id={speed}
                                disabled={this.props.hotkeysDisabled}
                                onClick={this.handleSpeedChange}
                                active={this.props.currentPlaybackRate === speed}
                            >{Math.floor(speed * 100)}%</Button>
                        )
                    })}
                </Row>
                <Row className="qwerRow">
                    <Button
                        disabled={this.props.hotkeysDisabled}
                        onClick={() => this.props.dispatch(makeRestartBarCurrent)}
                    ><Glyphicon glyph="share-alt"/></Button>
                    <Button
                        className="noPadding"
                        onClick={() => this.props.dispatch(toggleIsCreatingRegion(this.props.isCreatingRegion))}
                        disabled={this.props.hotkeysDisabled}
                        active={this.props.isCreatingRegion}
                    ><span>Create Region</span></Button>
                    <Button disabled={this.props.hotkeysDisabled} />
                    <Button disabled={this.props.hotkeysDisabled} />
                </Row>
                <Row className="asdfRow">
                    <Button disabled={this.props.hotkeysDisabled}><Glyphicon glyph="step-backward"/></Button>
                    <Button disabled={this.props.hotkeysDisabled}><Glyphicon glyph="resize-vertical"/></Button>
                    <Button disabled={this.props.hotkeysDisabled}><Glyphicon glyph="step-forward"/></Button>
                </Row>
                <Row className="zxcvRow">
                    <Button disabled={this.props.hotkeysDisabled}><Glyphicon glyph="zoom-out"/></Button>
                    <Button disabled={this.props.hotkeysDisabled}><Glyphicon glyph="zoom-in"/></Button>
                    <Button
                        className="noPadding"
                        disabled={this.props.hotkeysDisabled}
                    ><span>Auto Center</span></Button>
                </Row>
                <Row className="spacebarRow">
                    <Button
                        className="playPauseBtn"
                        active={!this.props.isPaused}
                        onClick={() => this.props.dispatch(toggleIsPaused(this.props.isPaused))}
                        disabled={this.props.hotkeysDisabled}
                    >play / pause</Button>
                </Row>
            </Grid>
        )

    }

}

const mapStateToProps = (state) => ({
    currentPlaybackRate: state.hotkeys.currentPlaybackRate,
    isCreatingRegion: state.hotkeys.isCreatingRegion,
    isPaused: state.hotkeys.isPaused
})

export default connect(mapStateToProps)(Hotkeys)
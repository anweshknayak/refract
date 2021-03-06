'use strict';

import React from 'react';
import YoutubePlayer from 'youtube-player';

import Controls from './controls.jsx';

export let PlayerState = {
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
}
    
export class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            random: false,
            repeat: false
        }
        this.playerOpts = {
            width: '854px',
            height: '480px',
            playerVars: {
                disablekb: 1,
                modestbranding: 1,
                fs: 0
            }
        };
    }

    componentDidMount() {
        this.loadPlayer();
    }


    play(id) {
        if ( !id && !this.state.playing ) { return; }
        this.state.playing = true;
        this.player.loadVideoById(id);
        this.player.playVideo();
    }


    loadPlayer() {
        this.player = YoutubePlayer('yt-player', this.playerOpts);
        this.player.addEventListener('onStateChange', (data) => {
            this.props.onStateChange(data);
        });
    }

    togglePlaying() {
        if ( this.state.playing ) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }

        this.setState({
            playing: !this.state.playing
        });
    }

    /**
     * random and repeat are mutually exclusive
     */
    handleRandom() {
        this.setState((prevState) => {
            const random = !prevState.random;
            const repeat = random?false:prevState.repeat;
            return { random, repeat };
        });
    }

    handleRepeat() {
        this.setState((prevState) => {
            const repeat = !prevState.repeat;
            const random = repeat?false:prevState.random;
            return { repeat, random };
        });
    }

    render() {

        const ytStub = {
            height: this.playerOpts.height,
        };

        const playerStyle = {
            width: this.playerOpts.width,
            margin: 'auto'
        };

        return (
            <div style={playerStyle}>
                <div style={ytStub} id="yt-player"></div>
                <Controls 
                    playerState={this.state}
                    onToggle={() => this.togglePlaying()}
                    onNext={() => this.props.onNext()}
                    onPrev={() => this.props.onPrev()}
                    onRandom={() => this.handleRandom()}
                    onRepeat={() => this.handleRepeat()}/>
            </div>
        );
    }
}


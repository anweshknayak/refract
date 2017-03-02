'use strict';

import React from 'react';

import List from './list.jsx';
import Header from './header.jsx';
import TeamInfo from './teaminfo.jsx';
import { Overlay, OverlayItem } from './overlay.jsx';
import { Player, PlayerState } from './player.jsx';

import Request from './request.js';
import Utils from './utils.js';

class App extends React.Component {

    constructor(props) {
        super(props);

        /* will become configurable in v2 */
        this.team_domain = "dev-s";

        this.name = "Refract";
        this.pages = ["play", "about"];
        this.activePage = "play";
        this.idx = 0;
        this.videos = [];
        this.overlay = null;
        this.team = null;
    }

    componentWillMount() {
        Request('GET', `/v0/teams?domain=${this.team_domain}`).then((response) => {
            this.team = JSON.parse(response).teams[0];
            this.loadData();
        });
    }

    play() {
        let { idx, videos } = this;
        if ( videos.length ) {
            const video_id = videos[idx].video_id;
            this.player.play(video_id);
        }
    }

    loadData() {
        Request('GET', `/v0/videos?team_id=${this.team.team_id}`).then((response) => {
            this.videos = JSON.parse(response).videos;
            this.forceUpdate();
            this.play();
        });
    }

    handleNext() {

        let { idx, videos } = this;
        if ( this.player.state.random ) {
            let old_idx = idx;
            while ( idx === old_idx ) {
                idx = Math.floor(Math.random() * videos.length);
            }
        } else if ( !this.player.state.repeat ) {
            idx = (idx < videos.length-1)?idx+1:0;
        }

        this.idx = idx;
        this.play();
    }

    handlePrev() {
        let { idx, videos } = this;
        idx = (idx > 0)?idx-1:videos.length -1;
        this.idx = idx;
        this.play();
    }


    handleStateChange(event) {
        if ( event.data == PlayerState.ENDED ) {
            this.handleNext();
        }
    }

    handlePage(page) {
        this.activePage = page;
    }

    handleNav(page) {
        this.overlay.setItem(page);
    }

    render() {

        /* Stateless functional component */
        const renderItem = function(props) {

            const infoStyle = {
                float: 'right'
            };

            return (
                <span>
                    {props.title}
                    <span style={infoStyle}>
                        ({props.duration})
                    </span>
                </span>
            );
        };

        const centered = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around'
        };

        const aboutStyle = {
            padding: '4rem 0'
        };

        return (
            <div className="main">
                <Header 
                    name={this.name}
                    navItems={this.pages} 
                    defaultItem={this.activePage}
                    onNav={(page) => this.handleNav(page)}
                />
                <div style={centered}>
                    <TeamInfo team={this.team} />
                    <Player 
                        ref={(player) => this.player = player}
                        onNext={() => this.handleNext()} 
                        onPrev={() => this.handlePrev()} 
                        onStateChange={(e) => this.handleStateChange(e)}
                    />
                </div>
                <Overlay ref={(overlay) => this.overlay = overlay}>
                    <OverlayItem key="about">
                        <div style={aboutStyle}>
                            <h1>Refract - The Public Slack Jukebox</h1>
                            <p>Hi There! How are you doing this fine day?</p>
                        </div>
                    </OverlayItem>
                </Overlay>
                <List 
                    items={this.videos} 
                    render={renderItem}
                    onClick={(item, index) => { this.player.play(item.video_id); this.idx = index } }
                />
            </div>
        );
    }
};

export default App;

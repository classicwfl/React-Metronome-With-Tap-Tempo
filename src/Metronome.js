import React, { Component } from 'react';
import './Metronome.css';
import click1 from './click1.wav';
import click2 from './click2.wav';

class Metronome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            count: 0,
            bpm: 100,
            beatsPerMeasure: 4,
            taps: [],
            calculatedTaps: [],
        };

        this.click1 = new Audio(click1);
        this.click2 = new Audio(click2);
    }

    handleBpmChange = event => {
        const bpm = event.target.value;
        if (this.state.playing) {
            clearInterval(this.timer);
            this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

            this.setState({
                count: 0,
                bpm
            });
        } else {
            this.setState({ bpm })
        }
    }

    playClick = () => {
        const { count, beatsPerMeasure } = this.state;

        if (count % beatsPerMeasure === 0) {
            this.click2.play();
        } else {
            this.click1.play();
        }

        this.setState(state => ({
            count: (state.count + 1) % state.beatsPerMeasure
        }));
    }

    //This handles the tap tempo
    handleTapTempo = () => {
        var { taps } = this.state;
        
        if (taps.length === 0) {
            let time = new Date();
            taps[0] = time.getTime();
        } else {
            let time = new Date();
            taps.push(time.getTime());
        }
    }

    //This will stop tap tempo and calculate BPM
    stopTapTempo = () => {
        var { taps, i, calculatedTaps, bpm } = this.state;
        let numTaps = taps.length - 1;
        let newTapIndex = 0;
        if (numTaps <= 1) {
            console.log("Not enough taps!")
        } else {
            for (i=numTaps; i >= 0; i--) {
                if (i>0) {
                    calculatedTaps[newTapIndex] = taps[i] - taps[i-1];
                    newTapIndex++;
                };
            };
            var tapSum = 0;
            for( var j = 0; j < calculatedTaps.length; j++ ){
                tapSum += parseInt( calculatedTaps[j], 10 ); //don't forget to add the base
            }

            var avgOfTaps = tapSum/calculatedTaps.length;
            bpm = 60000 / avgOfTaps;
            this.setState({ bpm })
            taps.length = 0;
            calculatedTaps.length = 0;
        }
    }

    startStop = () => {
        if (this.state.playing) {
            //Stops the timer
            clearInterval(this.timer);
            this.setState({
                playing: false
            });
        } else {
            //Start timer with current BPM
            this.timer = setInterval(
                this.playClick,
                (60 / this.state.bpm) * 1000
            );
            this.setState(
                {
                    count: 0,
                    playing: true
                },
                this.playClick
            );
        }
    };

    render() {
        const { playing, bpm } = this.state;

        return (
            <div className="metronome">
                <div className="bpm-slider">
                    <div>{bpm} BPM</div>
                    <input 
                        type="range" 
                        min="60" 
                        max="240" 
                        value={bpm}
                        onChange={this.handleBpmChange} />
                </div>
                <button onClick={this.startStop}>
                    {playing ? 'Stop' : 'Start'}
                </button>

                <button onClick={this.handleTapTempo}>Tap Tempo</button>

                <button onClick={this.stopTapTempo}>Stop Tap Tempo</button>

            </div>
        );
    }
}

export default Metronome;
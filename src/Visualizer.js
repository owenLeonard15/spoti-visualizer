import React from 'react';
import './Visualizer.css';

let audiotag = new Audio()
audiotag.crossOrigin = 'anonymous'
//all variables for Analyser
let canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height

class Visualizer extends React.Component{
    constructor(){
        super()
        this.state = {
            isPlaying: false, 
            hasPlayed: false,
            renderType: 'circle',
            renderColor: 'white'
        }
    } 

    componentDidMount = () => {
        context = new AudioContext()
        context.autoplay = false
        analyser = context.createAnalyser()
        canvas = document.getElementById('canvas')
        ctx = canvas.getContext('2d')

        //route audio playback
        //into the processing graph of AudioContext
        source = context.createMediaElementSource(audiotag)
        source.connect(analyser)
        analyser.connect(context.destination)
        analyser.fftSize = 256;
        canvas.style.width = (canvas.width = 500) + "px"
        canvas.style.height = (canvas.height = 500) + "px"

    }   
        

   
    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.currentSong !== this.props.currentSong){
            audiotag.src = this.props.currentSong.preview_url
            audiotag.load()
            audiotag.play()
            this.setState({isPlaying: true, hasPlayed: true})
        }

        this.checkRenderType();
        this.checkActiveButton();
    }


    
    checkActiveButton = () => {
        let buttons = document.getElementsByTagName('button')
        for(let i = 0; i < buttons.length; i++){
            if(buttons[i].id === this.state.renderType){
                buttons[i].setAttribute('class', 'active')
            }else{
                buttons[i].setAttribute('class', 'inactive')
            }
        }
    }

    renderBars = () => {
        requestAnimationFrame(this.renderBars)
        fbc_array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(fbc_array)
        ctx.clearRect(0,0, canvas.width, canvas.height) //clear canvas

        ctx.fillStyle = this.state.renderColor
        bars = 100
        for(let i = 0; i < bars; i +=3){
            bar_x = i * 5
            bar_width = 14
            bar_height = -(fbc_array[i] * 2)
            ctx.fillRect(bar_x, canvas.height, bar_width, bar_height)
        }
        
    }

    
    renderLine = () => {
        requestAnimationFrame(this.renderLine)
        fbc_array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(fbc_array)
        ctx.clearRect(0,0, canvas.width, canvas.height) //clear canvas

        ctx.fillStyle = this.state.renderColor
        ctx.strokeStyle  = this.state.renderColor
        bars = 100
        
        let next_bar_height

        for(let i = 0; i < bars - 1; i++){
            bar_x = i * 5
            bar_width = 14
            bar_height = (fbc_array[i]  * 2)
            next_bar_height = (fbc_array[i+1]  * 2)

            ctx.beginPath()
            ctx.moveTo(i * 5, bar_height)
            ctx.lineTo((i + 1) * 5, next_bar_height)
            ctx.stroke();
        }

        
    }

    renderSquares = () => {
        requestAnimationFrame(this.renderSquares)
        fbc_array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(fbc_array)
        ctx.clearRect(0,0, canvas.width, canvas.height) //clear canvas

        ctx.fillStyle = 'white'
        bars = 100
        
        for(let i = 0; i < bars - 1; i+=3){
            bar_x = i * 3
            bar_width = 8
            bar_height = (fbc_array[i] / 2)
            
            ctx.fillRect(bar_x, bar_height, bar_width, bar_height);
        }
    }

    renderCircle = () => {
        requestAnimationFrame(this.renderCircle)
        fbc_array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(fbc_array)
        ctx.clearRect(0,0, canvas.width, canvas.height) //clear canvas
        ctx.strokeStyle = 'white'

        bars = 100
        for(let i = 0; i < bars - 1; i +=9){
            bar_height = fbc_array[i] 
            ctx.beginPath();
            ctx.arc(250, 250, bar_height * .75, 0, 2 * Math.PI);
            ctx.stroke();
        }   
    }

    onPlayPauseClick = () => {
    
        if(!this.state.isPlaying){
            audiotag.play()
            this.setState({isPlaying: true})
        }else{
            audiotag.pause()
            this.setState({isPlaying: false})
        }
    }

    checkRenderType = () => {
        switch(this.state.renderType){
            case 'bars':
                requestAnimationFrame(this.renderBars)
                break
            case 'line':
                requestAnimationFrame(this.renderLine)
                break
            case 'square':
                requestAnimationFrame(this.renderSquares)
                break
            case 'circle':
                requestAnimationFrame(this.renderCircle)
                break
            default:
                requestAnimationFrame(this.renderBars)
        }
    }

    setRenderType = (targetID) => {
        this.setState({renderType: targetID})
    }


    render(){
        return(
            <div style={{width: '500px'}} >
                {
                        this.state.hasPlayed ?
                            <div style={{color: 'white'}}>
                            {   
                                this.state.isPlaying ?
                                <div className='controls'>
                                    <i onClick={this.onPlayPauseClick} className="fas fa-pause"></i>
                                    <div className='buttons'>
                                        <button id='bars' onClick={event => this.setRenderType(event.target.id)} >Bars</button>
                                        <button id='line' onClick={event => this.setRenderType(event.target.id)} >Line</button>
                                        <button id='circle' onClick={event => this.setRenderType(event.target.id)} >Circles</button>
                                    </div>
                                </div>
                                :<div className='controls'>
                                    <i onClick={this.onPlayPauseClick} className="fas fa-play"></i>
                                    <div className='buttons'>
                                        <button id='bars' onClick={event => this.setRenderType(event.target.id)}>Bars</button>
                                        <button id='line' onClick={event => this.setRenderType(event.target.id)} >Line</button>
                                        <button id='circle' onClick={event => this.setRenderType(event.target.id)} >Circles</button>
                                    </div>
                                </div>
                            }
                            </div>
                        :   <h2>Play a song to visualize it</h2>
                }
                <div id='mp3_player'>
                    <canvas style={{margin: '0', padding: '0'}} id='canvas'></canvas>
                </div>
            </div>
        )
    }
}

export default Visualizer;
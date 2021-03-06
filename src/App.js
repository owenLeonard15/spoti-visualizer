import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import SongList from './SongList';
import Visualizer from './Visualizer';


class App extends Component {
  constructor(){
    super()
    this.state ={
      currentSong: null,
      user: '',
      savedTracks: ''
    }
  }

  componentDidMount = () =>{
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    if(!accessToken){
      return
    }

    //get user's name and id
    fetch(
      'https://api.spotify.com/v1/me', 
      {headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response =>  response.json())
    .then(data => {
      this.setState({
        user: {
          name: data.display_name,
          id: data.id
        }
      })
    })

   fetch(
    'https://api.spotify.com/v1/me/tracks', 
    {headers: {'Authorization': 'Bearer ' + accessToken}
  }).then(response =>  response.json())
  .then(trackData => {
    let trackObjects = trackData.items
    let tracks = trackObjects.map(trackObject => trackObject.track)
    this.setState({
      savedTracks: tracks })
  }, err => console.log(err))

    
}

  onSongClicked = (targetSong) => {
    this.setState({currentSong: targetSong})
  }



  render() {
    return (
      <div className="App">
      { 
        this.state.user ?
          <React.Fragment>
            {
            this.state.currentSong ?
            <div style={{display: 'flex', justifyContent: 'center', width: '100%', flexWrap: 'nowrap', flexDirection: 'row'}}>
              <img alt='cover art' id='coverArt' src={this.state.currentSong.album.images[1].url}/>
              <h1 id='title' style={{color: 'white', fontWeight: '600'}} >Spotify Visualizer</h1>
            </div>
            :<h1 id='title' style={{color: 'white', fontWeight: '600'}} >Spotify Visualizer</h1>
            }
            {
            this.state.currentSong ?
                <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', flexDirection: 'row', alignItems: 'center'}}>
                  <h2 style={{color: 'white', fontWeight: '300', margin: '0', fontSize: '1.5em'}}>{this.state.currentSong.name}&nbsp; &#8231; &nbsp; {this.state.currentSong.artists[0].name}</h2>
                </div>
                :<h2 style={{color: 'transparent', fontWeight: '300'}}>Click a song to play it!</h2>
            }  
            
            <div className='mainBody' style={{ margin:'0'}}>
            <Visualizer currentSong={this.state.currentSong} audio={this.state.audio}/>
              <SongList 
                user={this.state.user} 
                onSongClicked={this.onSongClicked}
                savedTracks={this.state.savedTracks}
              />   
            </div>
          
          </React.Fragment>
          : <button onClick={() => {
            window.location =  window.location.href.includes('localhost') 
              ?  'http://localhost:8888/login'
              : 'https://spoti-visualizer-backend.herokuapp.com/login'
              }
            }
            style={{marginTop: '40vh', fontSize: '3rem', width: '50%', borderRadius: '2em', backgroundColor: 'transparent', color: 'white', border: 'solid white 3px'}}>Sign in with spotify</button>
        }
      </div>
    )
  }
}
  


export default App;

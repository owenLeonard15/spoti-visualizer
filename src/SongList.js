import React from 'react';
import './SongList.css';

class SongList extends React.Component{


    render(){
      let {user,savedTracks} = this.props
        return(
        <div style={{width: '40em', 'textAlign': 'center'}}>
            <h2 style={{backgroundColor: 'transparent', margin : 0, padding: '0 0 2em 0', color: 'white'}} >Songs</h2>
            {
              user ?
              <div>
                {
                  savedTracks
                  ?
                  <div style={{maxHeight: '60vh', overflow: 'auto'}}>
                    {
                      savedTracks.map((track, i) => {
                        return <div key={i} className='songList'>
                                  <p 
                                    key={i + 16} 
                                    style={{textAlign: 'left', padding: '.5em 0 0 1em', margin: '0', color: 'white', fontSize: '1.2em'}}
                                    onClick={event =>
                                    this.props.onSongClicked(track) }
                                    > 
                                      {track.name} 
                                  </p>
                                  <p
                                   key={i} 
                                   style={{textAlign: 'left', margin: '0', padding: '0 0 .5em 1.2em',     color: 'rgba(256,256,256, .6)', fontSize: '1em'}}
                                   onClick={event =>
                                   this.props.onSongClicked(track) }
                                   >
                                    {track.artists[0].name} &nbsp; &#8231; &nbsp; {track.album.name}
                                  </p>
                                </div>
                      })
                    }
                  </div>
                  : <p>loading tracks...</p>
                }
              </div>
              : 
              <div>
                <p>loading</p>
              </div>
            }
            
        </div>

        )
    }
}

export default SongList;
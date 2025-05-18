import React from 'react'
import YouTube from 'react-youtube'

function YoutubePlayer(props) {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };
  return (
    
    <div>
        {/* <YouTube opts={opts} videoId={props.videoId} /> */}
    </div>
  )
}

export default YoutubePlayer

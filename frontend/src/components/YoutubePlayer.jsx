import React from "react";
import YouTube from "react-youtube";

function YoutubePlayer(props) {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
      rel: 0,
    },
  };
  return (
    <div className="">
      <YouTube opts={opts} onReady={props.onReady} videoId={props.videoId} />
    </div>
  );
}

export default YoutubePlayer;

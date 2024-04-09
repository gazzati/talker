import React from "react"
//import React, { useEffect, useState } from 'react';

import Video from "./Video"

const RemoteVideo = ({ id }) => {
  //const [mediaStream, setMediaStream] = useState<MediaStream>()

  //useCalculateVoiceVolume(mediaStream, props.id)

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const stream = (document.getElementById(id) as HTMLVideoElement)?.srcObject

  //     if (stream) {
  //       setMediaStream(stream)
  //       clearInterval(interval)
  //     }
  //   }, 100);

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [id])

  return <Video id={id} />
}

export default RemoteVideo

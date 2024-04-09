import { Logo, Mic, MicOff, Dynamic, DynamicOff, VideoOn, VideoOff } from "@components/Icons"
import RemoteVideo from "@components/RemoteVideo"
import Video from "@components/Video"
import React, { useState, useRef } from "react"

import { useCreateMediaStream } from "./hooks/useCreateMediaStream"
import { useStartPeerSession } from "./hooks/useStartPeerSession"
import styles from "./style.m.scss"

const App = () => {
  const [muted, setMuted] = useState(false)
  const [dynamicOff, setDynamicState] = useState(false)
  const [videoOff, setVideoState] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const userMediaStream = useCreateMediaStream(localVideoRef)

  const { destination } = useStartPeerSession(userMediaStream)

  const handleMute = () => {
    userMediaStream?.getTracks()?.forEach(track => {
      if (track?.kind === "audio") {
        track.enabled = muted
        setMuted(!muted)
      }
    })
  }

  const handleVideoToggle = () => {
    userMediaStream?.getTracks()?.forEach(track => {
      if (track?.kind === "video") {
        track.enabled = videoOff
        setVideoState(!videoOff)
      }
    })
  }

  const handleDynamicToggle = () => {
    if(!destination) return

    const stream = (document.getElementById(destination) as HTMLVideoElement)
    stream.volume = dynamicOff ? 1 : 0

    setDynamicState(!dynamicOff)
  }

  return (
    <div className={styles.talker}>
      <div className={styles.logo}>
        <Logo />
      </div>

      <div className={styles.videosContainer}>
        <Video
          id="local"
          className={destination ? styles.localVideo : styles.remoteVideo}
          ref={localVideoRef}
          muted={true}
        />
        {destination && <RemoteVideo id={destination} />}
      </div>

      <div className={styles.actions}>
        <div className={styles.action} onClick={handleMute}>
          {muted ? <MicOff /> : <Mic />}
        </div>

        <div className={styles.action} onClick={handleVideoToggle}>
          {videoOff ? <VideoOff /> : <VideoOn />}
        </div>

        {destination &&  <div className={styles.action} onClick={handleDynamicToggle}>
          {dynamicOff ? <DynamicOff /> : <Dynamic />}
        </div>}

      </div>
    </div>
  )
}

export default App

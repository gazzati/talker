import { Logo } from "@components/Icons/Logo"
import RemoteVideo from "@components/RemoteVideo"
import Video from "@components/Video"
import React, { useRef } from "react"

import { useCreateMediaStream } from "./hooks/useCreateMediaStream"
import { useStartPeerSession } from "./hooks/useStartPeerSession"
import styles from "./style.m.scss"

const App = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const userMediaStream = useCreateMediaStream(localVideoRef)

  const { destination } = useStartPeerSession(userMediaStream)

  return (
    <div className={styles.talker}>
      <Logo />

      <Video ref={localVideoRef} muted={true} />
      {destination && <RemoteVideo id={destination} />}
    </div>
  )
}

export default App

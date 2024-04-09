import React, { forwardRef } from "react"

type Props = {
  id?: string
  muted?: boolean
}

const Video = forwardRef<HTMLVideoElement, Props>(({ id, muted }, ref) => {
  return <video ref={ref} id={id} muted={muted} autoPlay playsInline width={300} />
})

export default Video

import React, { forwardRef } from "react"

type Props = {
  id: string
  className: string
  muted?: boolean
}

const Video = forwardRef<HTMLVideoElement, Props>(({ id, className, muted }, ref) => {
  return <video ref={ref} id={id} className={className} muted={muted} autoPlay playsInline />
})

export default Video

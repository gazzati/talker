/* eslint-disable no-console */
import { useEffect, useMemo, useState } from "react"

import { createPeerConnectionContext } from "../utils/PeerConnectionSession"

export const useStartPeerSession = userMediaStream => {
  const peerVideoConnection = useMemo(() => createPeerConnectionContext(), [])

  const [destination, setDestination] = useState(null)

  const addPeerCb = dst => _stream => {
    const video = document.getElementById(dst) as HTMLVideoElement
    if (video) video.srcObject = _stream
  }

  useEffect(() => {
    if (userMediaStream) {
      peerVideoConnection.start()

      peerVideoConnection.initCall(dst => {
        console.log("initCall", dst)
        setDestination(dst)
        peerVideoConnection.addPeerConnection(dst, userMediaStream, addPeerCb(dst))
        peerVideoConnection.callUser(dst)
      })

      peerVideoConnection.onUpdateDst(dst => {
        console.log("onUpdateDst", dst)
        setDestination(dst)
        peerVideoConnection.addPeerConnection(dst, userMediaStream, addPeerCb(dst))
      })

      peerVideoConnection.onRemoveUser(socketId => {
        setDestination(null)
        peerVideoConnection.removePeerConnection(socketId)
      })

      peerVideoConnection.onAnswerMade(socket => peerVideoConnection.callUser(socket))
    }

    return () => {
      if (userMediaStream) {
        peerVideoConnection.clearConnections()
        userMediaStream?.getTracks()?.forEach(track => track.stop())
      }
    }
  }, [peerVideoConnection, userMediaStream])

  // const cancelScreenSharing = async () => {
  //   const senders = await peerVideoConnection.senders.filter((sender) => sender.track.kind === 'video');

  //   if (senders) {
  //     senders.forEach((sender) =>
  //       sender.replaceTrack(userMediaStream.getTracks().find((track) => track.kind === 'video')),
  //     );
  //   }

  //   localVideoRef.current.srcObject = userMediaStream;
  //   displayMediaStream.getTracks().forEach((track) => track.stop());
  //   setDisplayMediaStream(null);
  // };

  // const shareScreen = async () => {
  //   const stream = displayMediaStream || (await navigator.mediaDevices.getDisplayMedia());

  //   const senders = await peerVideoConnection.senders.filter((sender) => sender.track.kind === 'video');

  //   if (senders) {
  //     senders.forEach((sender) => sender.replaceTrack(stream.getTracks()[0]));
  //   }

  //   stream.getVideoTracks()[0].addEventListener('ended', () => {
  //     cancelScreenSharing(stream);
  //   });

  //   localVideoRef.current.srcObject = stream;

  //   setDisplayMediaStream(stream);
  // };

  return {
    destination,
    peerVideoConnection
    // shareScreen,
    // cancelScreenSharing,
    // isScreenShared: !!displayMediaStream,
  }
}

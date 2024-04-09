import { io, Socket } from "socket.io-client"

// eslint-disable-next-line no-undef
const { RTCPeerConnection, RTCSessionDescription } = window

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1)

class PeerConnectionSession {
  private socket: Socket

  private peerConnections = {}
  private listeners = {}
  private senders = []

  constructor(socket: Socket) {
    this.socket = socket
    this.onCallMade()
  }

  public addPeerConnection(id, stream, callback) {
    this.peerConnections[id] = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    })

    stream.getTracks().forEach(track => {
      //@ts-ignore
      this.senders.push(this.peerConnections[id].addTrack(track, stream))
    })

    this.listeners[id] = event => {
      const fn = this["_on" + capitalizeFirstLetter(this.peerConnections[id].connectionState)]
      fn && fn(event, id)
    }

    this.peerConnections[id].addEventListener("connectionstatechange", this.listeners[id])

    this.peerConnections[id].ontrack = ({ streams: [stream] }) => callback(stream)
  }

  removePeerConnection(id) {
    this.peerConnections[id]?.removeEventListener("connectionstatechange", this.listeners[id])
    delete this.peerConnections[id]
    delete this.listeners[id]
  }

  async callUser(to) {
    if (this.peerConnections[to].iceConnectionState === "new") {
      const offer = await this.peerConnections[to].createOffer()
      await this.peerConnections[to].setLocalDescription(new RTCSessionDescription(offer))

      this.socket.emit("call-user", { offer, to })
    }
  }

  start() {
    this.socket.emit("start")
  }

  onCallMade() {
    this.socket.on("call-made", async data => {
      await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.offer))
      const answer = await this.peerConnections[data.socket].createAnswer()
      await this.peerConnections[data.socket].setLocalDescription(new RTCSessionDescription(answer))

      this.socket.emit("make-answer", { answer, to: data.socket })
    })
  }

  initCall(callback) {
    this.socket.on("init-call", ({ user }) => callback(user))
  }

  onRemoveUser(callback) {
    this.socket.on("remove-user", ({ socketId }) => callback(socketId))
  }

  onUpdateDst(callback) {
    this.socket.on("update-destination", ({ user, current }) => callback(user, current))
  }

  onAnswerMade(callback) {
    this.socket.on("answer-made", async data => {
      await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.answer))
      callback(data.socket)
    })
  }

  clearConnections() {
    this.socket.close()
    this.senders = []
    Object.keys(this.peerConnections).forEach(this.removePeerConnection.bind(this))
  }
}

export const createPeerConnectionContext = () => {
  // const socket = io(process.env.REACT_APP_SOCKET_URL);
  const socket = io("https://talker.su/chat")

  return new PeerConnectionSession(socket)
}

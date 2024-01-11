import { Config, leaveRoom } from "./bind.js";
import { Answer, Offer } from "./connection.js";

class SignalingServer {
    constructor() {
        this.socket = io();
        this.#connectSockets();
    }
    #connectSockets() {
        this.socket.on("connect", () => {
            this.socket.emit('createRoom', Config.roomName, Config.userId);
        });

        this.socket.on('userJoined', (peerId) => {
            Config.remotePeerId = peerId;
            setTimeout(() => {
                new Offer(peerId);
            }, 5000);
        })

        this.socket.on('message', (message, peerId) => {
            Config.remotePeerId = peerId;
            message = JSON.parse(message);
            switch (message.type) {
                case 'offer':
                    new Answer(peerId, message.offer);
                    break;
                case 'candidate':
                    if (Config.peerConnection)
                        Config.peerConnection.addIceCandidate(message.candidate)
                    break;
                case 'answer':
                    if (!Config.peerConnection.currentRemoteDescription)
                        Config.peerConnection.setRemoteDescription(message.answer);
                    break;
                default:
                    break;
            }
        })

        this.socket.on('leave', () => {
            leaveRoom();
        })
    }
}

export default SignalingServer;
import { Config, Server, localStream, localUserVideo, remoteUserVideo } from "./bind.js";

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}

class BasePackage {
    constructor(peerId) {
        this.peerConnection = null;
        this.peerId = peerId;
        this.#createPackage();
    }
    async #createPackage() {
        try {
            this.peerConnection = new RTCPeerConnection(servers);
            this.#setLocalTracks();
            this.#getICEcandidates();
            this.#setVideoGrid();
            this.#listenRemoteTrack();
        } catch (error) {
            console.error('Error creating RTCPeerConnection:', error);
        }
    }
    #setLocalTracks() {
        localStream.stream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, localStream.stream);
        });
    }
    #listenRemoteTrack() {
        this.peerConnection.ontrack = (e) => {
            let remoteStream = new MediaStream();
            e.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track);
            });
            remoteUserVideo.srcObject = remoteStream;
        };
    }
    #getICEcandidates() {
        try {
            this.peerConnection.onicecandidate = async (e) => {
                if (e.candidate) {
                    Server.socket.emit('message', this.peerId, Config.userId, JSON.stringify({ type: 'candidate', candidate: e.candidate }));
                }
            };
        } catch (error) {
            console.error('Error setting ICE candidates:', error);
        }
    }
    #setVideoGrid() {
        localUserVideo.classList.add('smallFrame');
        remoteUserVideo.style.display = 'block';
    }
}



class Offer extends BasePackage {
    /**
     * 
     * @param {Number} peerId PeerId for which offer created
     */
    constructor(peerId) {
        super(peerId);
        this.#createOffer();
    }
    async#createOffer() {
        try {
            let offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            Config.peerConnection = this.peerConnection;
            Server.socket.emit('message', this.peerId, Config.userId, JSON.stringify({ type: 'offer', offer }));
        } catch (error) {
            console.error('Error during creating offer:', error);
        }
    }

}

class Answer extends BasePackage {
    /**
     * 
     * @param {Number} peerId PeerId to Answer who send this offer to you   
     * @param {Object} offer RTCoffer
     */
    constructor(peerId, offer) {
        super(peerId);
        this.#createAnswer(offer);
    }
    async #createAnswer(offer) {
        try {
            await this.peerConnection.setRemoteDescription(offer);
            let answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            Config.peerConnection = this.peerConnection;
            Server.socket.emit('message', this.peerId, Config.userId, JSON.stringify({ type: 'answer', answer }));
        } catch (error) {
            console.error('Error creating answer:', error);
        }
    }
}
const renegociate = () => {
    new Offer(Config.remotePeerId);
};

export { Offer, Answer, renegociate };
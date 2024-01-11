import ButtonLoader from "./buttons.js";
import localStreamEngine from "./localStream.js";
import SignalingServer from "./signalingServer.js";

let cameraBtn = document.getElementById('camera-btn');
let micBtn = document.getElementById('mic-btn'); 
let localUserVideo = document.getElementById('user-1');
let remoteUserVideo = document.getElementById('user-2');

//Global Variables
let Config = {
    roomName: 'room',
    peerConnection: null,
    remotePeerId: null,
    userId: String(Math.floor(Math.random() * 1e8))
}

//Start Singnaling Server
let Server = new SignalingServer();



//Start Local Stream
let constrains = {
    video: {
        height: { min: 700, ideal: 720, max: 1080 },
        width: { min: 1200, ideal: 1280, max: 1920 },
        frames: 60
    },
    audio: true,
}
let localStream = new localStreamEngine(constrains);
localStream.startLocalStream();


//Start Listening Buttons
new ButtonLoader(cameraBtn, 1000, () => localStream.changeCamera(), () => localStream.toggleCamera(), 'disabled');




//On leave Room
const leaveRoom = () => {
    localUserVideo.classList.remove('smallFrame');
    remoteUserVideo.style.display = 'none';
}
window.addEventListener('beforeunload', (e) => {
    Server.socket.emit('leavingRoom', Config.userId, Config.roomName);
})




export { Config,leaveRoom ,localStream,remoteUserVideo,localUserVideo,Server};
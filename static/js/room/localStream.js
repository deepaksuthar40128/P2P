import { Config, localUserVideo } from "./bind.js";
import { renegociate } from "./connection.js";

class localStreamEngine {
    /**
     * 
     * @param {Object} constrains constrains for Taking user Media Input
     */
    constructor(constrains) {
        this.constrains = constrains;
        this.shareScreen = false;
        this.stream = null;
        this.currentCamera = 0;
        this.cameraAvalible = true;
    }

    async changeCamera() {
        let mediaDevices = await navigator.mediaDevices.enumerateDevices();
        let videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0 && this.cameraAvalible) {
            this.currentCamera = (this.currentCamera + 1) % videoDevices.length;
            this.stream.getTracks().forEach(track => track.stop());
            try {
                let newStream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: videoDevices[this.currentCamera].deviceId },
                    audio: true
                });
                this.stream.getTracks().forEach(track => {
                    this.stream.removeTrack(track);
                })
                newStream.getTracks().forEach(track => this.stream.addTrack(track));
                this.#setLocalStream();
                if (Config.remotePeerId)
                    renegociate();
            } catch (err) {
                console.log("Error while switching Camera Error:" + err);
            }
        }
    }

    async toggleCamera() {
        this.cameraAvalible = !this.cameraAvalible;
        if (this.cameraAvalible) {
            this.stream.getTracks().forEach(track => { if (track.kind === 'video') track.enabled = true });
        } else {
            this.stream.getTracks().forEach(track => { if (track.kind === 'video') track.enabled = false });
        }
    }

    startLocalStream() {
        this.#getUserStream();
    }

    async #getUserStream() {
        try {
            let stream = await navigator.mediaDevices.getUserMedia(this.constrains);
            this.stream = stream;
            this.#setLocalStream(); 
        } catch (err) {
            console.error('Error in Setting Local Stream: ' + err);
        }
    }

    #setLocalStream() {
        localUserVideo.srcObject = this.stream;
    }
}


export default localStreamEngine;
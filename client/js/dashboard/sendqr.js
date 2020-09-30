/* global $ Html5Qrcode */
import {
  Modal,
} from 'rumsan-ui';

export default class extends Modal {
  constructor(cfg) {
    super(cfg);
    this.result = null;
    this.registerEvents('scan-success');
    this.comp.on('shown.bs.modal', (e) => {
      this.load();
    });

    this.on('close', (e) => {
      this.html5QrCode.stop();
    });
  }

  load() {
    const me = this;
    const containerWidth = $('#qr-reader').outerWidth();

    navigator.getUserMedia({ video: { facingMode: 'environment' }, audio: false }, (stream) => {
      if (stream.getVideoTracks().length > 0) {
        const cameras = stream.getVideoTracks();
        const currentCamera = cameras[0];
        this.html5QrCode = new Html5Qrcode('qr-reader');
        this.html5QrCode.start(
          currentCamera.getSettings().deviceId,
          {
            fps: 10, // Optional frame per seconds for qr code scanning
            qrbox: containerWidth * 0.65, // Optional if you want bounded box UI
          },
          (qrCodeMessage) => {
            const st = qrCodeMessage.indexOf('0x');
            this.result = qrCodeMessage.substr(st);
            me.close();
          },
          (errorMessage) => {
            console.log(errorMessage);
          },
        )
          .catch((err) => {
            console.log(err);
          });
      } else {
        // code for when both devices are available
      }
    }, (e) => {
      console.log('ERROR:', e);
    });
  }
}

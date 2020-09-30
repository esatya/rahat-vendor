import { Modal } from "rumsan-ui";
import QR from "qrcode";
import store from "store";

export default class extends Modal {
  constructor(cfg) {
    super(cfg);
    this.address = JSON.parse(store.get("sanduk")).address;
    $(this.btnOpen).on("click", async (e) => {
      this.open();
      await this.renderQRCode();
      this.select(".infoAddress").text(`0x${this.address}`);
    });
  }

  async renderQRCode() {
    const qrcode = $("#qrcode");
    const containerWidth = qrcode.outerWidth();
    const opts = {
      errorCorrectionLevel: "H",
      type: "svg",
      quality: 1,
      margin: 2,
      width: containerWidth,
      color: {
        dark: "#000000",
      },
    };

    QR.toCanvas(document.getElementById("qrcode"), `0x${this.address}`, opts);
  }
  getAddress() {
    const sanduk = store.get("sanduk");
    if (!sanduk) return null;
    return sanduk[0].address;
  }
}

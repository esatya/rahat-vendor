import { Modal } from "rumsan-ui";
import Wallet from "../blockchain/wallet";
import Passcode from "./passcode";
import Backup from './backup';
import config from "../config";

export default class extends Modal {
  constructor(cfg) {
    super(cfg);

    this.backup = new Backup({ target: "#mdlSeedBackup" });
    $("#btnWhisper").on("click", (e) => {
      let mnemonic = $("[name=mnemonic]").val();
      // if (!EthWallet.bip39.validateMnemonic(mnemonic)) {
      //   console.warn("Invalid Mnemonic");
      //   swal.fire('ERROR', 'Invalid Seed Pharse', 'error');
      //   return;
      // }
      this.close();
      this.backup.open();
      $("[name=mnemonic]").text(`${mnemonic}`);
    });
  }

  async checkVendor(address) {
    try {
      const res = await fetch(`${config.api}/vendor/${address}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      if (resData) return true;
      else return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

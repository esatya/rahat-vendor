import { Modal } from "rumsan-ui";
import store from "store";
import Wallet from "../blockchain/wallet";
import config from '../config';
import common from '../common';
import Register from "./register.modal";
import Info from "../dashboard/info";


export default class extends Modal {

  constructor(cfg) {
    super(cfg);
    const register = new Register({ target: "#mdlRegister" });
    const info = new Info();

    $("#btnLogin").on("click", async (e) => {
      let mnemonic = $("#mnemonic").text();
      common.showProcessing("Creating your account")
      let { wallet, encryptedWallet } = await Wallet.create(mnemonic);
      console.log("wallet", wallet)
      common.showProcessing("Checking your account")
      let vendor = await info.checkVendor(wallet.address);
      if (vendor) {
        common.hideProcessing()

        window.location.href = '/home'
        return;
      }
      common.hideProcessing()
      console.log("wallet", wallet);
      register.account = wallet.address;
      this.close();
      register.open();
    });

  }
  // async checkVendor(address) {
  //   console.log('checking', address)
  //   try {
  //     let res = await fetch(
  //       `${config.api}/vendors/${address}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log(res);
  //     let data = await res.json();
  //     console.log("vendor Data", data)
  //     return data;
  //   }
  //   catch (e) {
  //     console.log("error", e);
  //     return false;
  //   }

  // }

  async registerVendor() {

  }
}
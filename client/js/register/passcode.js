import { Modal } from "rumsan-ui";
import store from "store";
import Wallet from "../blockchain/wallet";
import config from '../config';

export default class extends Modal {
  constructor(cfg) {
    super(cfg);
    $("#password, #confirm_password").on("keyup", () => {
      if ($("#password").val() == $("#confirm_password").val()) {
        $("#message").html("Matched").css("color", "green");
      } else $("#message").html("Not Matching").css("color", "red");
    });

    $("#btnLogin").on("click", async (e) => {
      let passcode = $("#password").val();
      let mnemonic = $("#mnemonic").text();
      if ($("#message").html() !== "Matched") {
        toastbox("toast-4", 2000);
        e.preventDefault();

        return;
      }

      store.set("appChabi", passcode);
      this.wallet = new Wallet({ password: passcode });

      if (this.wallet) this.wallet.createFromSeed({ mnemonic });

      let vendorAddress = this.wallet.defaultAccount.address

      let vendor = await this.checkVendor(vendorAddress);

      if (vendor) {
        store.set('agency', vendor.agency);
        window.location.href = '/home'
        return;
      }

      window.location.href = "/register";
    });
  }

  async checkVendor(address) {
    try {
      let res = await fetch(
        `${config.api}/vendor/${address}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      let data = await res.json();
      return data;
    }
    catch (e) {
      console.log("error", e);
      return false;
    }

  }
}

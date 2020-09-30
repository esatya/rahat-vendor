import { Modal, Form } from "rumsan-ui";
import config from "../config";
import store from "store";

class Register extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents("registered");

    this.comp.submit(async (e) => {
      e.preventDefault();
      let registration = await this.register();
      if (registration) {

        window.location.href = "/home";
      }
    });
  }

  render() {
    $("#mdlAgencyName").text(this.agencyName);
    $("#agencyId").val(this.agencyId);
    $("#eth_address").val(this.address);
  }

  async register() {
    let data = this.form.get();
    data.wallet_address = this.account;
    console.log("DATA", data, this.account);
    store.set("agency", data.agency);
    // let passcode = store.get('appChabi');
    // if (!passcode) {
    //   alert("account not found")
    // }
    // data.passcode = passcode;

    try {
      const res = await fetch(`${config.api}/vendors/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      console.log(resData);

      if (!resData) {

        return;
      }
      this.fire("registered", resData);
      this.form.clear();
      this.close();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export default Register;

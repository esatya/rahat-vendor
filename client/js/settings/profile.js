import { Component } from "rumsan-ui";
import store from "store";
import config from "../config";

export default class extends Component {

  getAddress() {
    const sanduk = JSON.parse(store.get("sanduk"));
    if (!sanduk) return null;
    return `0x${sanduk.address}`;
  }

  async vendorInfo() {
    let address = this.getAddress();
    try {
      let res = await fetch(
        `${config.api}/vendors/${address}`,
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
      console.log(e);
    }

    return data;
  }

}
import Register from "./register.modal";
import AgencyList from "./agency.list";
import store from "store";
import Wallet from "../blockchain/wallet";

$(document).ready(() => {

  if (store.get('agency')) {
    window.location.href = "/home";
  }
  if (!store.get('sanduk')) {
    window.location.href = '/'
  }

  const register = new Register({ target: "#mdlRegister" });
  const al = new AgencyList({ target: "#listAgency" });
  let password = store.get("appChabi");

  //const wallet = new Wallet({ password });
  let address = Wallet.getAddress();

  $(document).on("click", ".agency", (e) => {
    register.agencyName = e.currentTarget.querySelector("h4").innerText;
    register.agencyId = e.currentTarget.querySelector("h5").innerText;
    register.address = `0x${address}`
    register.open();
    register.render();
  });
});

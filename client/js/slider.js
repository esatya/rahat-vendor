/* eslint-disable no-new */
/* global $ */
import store from "store";
import Mnemonic from "./register/mnemonic";
import { Modal } from 'rumsan-ui'
import { ethers } from 'ethers';
import Google from './utils/google';
import Passcode from './setup/passcode'
import Wallet from './blockchain/wallet';

$(document).ready(() => {
  store.set('version', '1.0.0');
  const mnemonic = new Mnemonic({ target: "#mdlSignUp" });
  const login = new Modal({ target: "#mdlLogin" });
  const passcode = new Passcode({ target: '#mdlPasscode' });

  (async () => {
    if (store.get("sanduk")) {
      let address = Wallet.getAddress();
      if (address) {
        window.location.href = "/home";
      }
    }
  })();

  passcode.on('passcode-set', () => {
    login.open();
  })

  $("#startSignUp").on("click", () => {
    passcode.open();
  });

  $('#mdlLogin').on('advanced-setup', () => {
    login.close();
    mnemonic.open();
  })

  $("#generateSecret").on("click", () => {
    console.log("ethers", ethers);
    let seed = ethers.Wallet.createRandom().mnemonic.phrase;
    $("[name=mnemonic]").val(seed);
  });

  return;
});

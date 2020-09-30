import { Modal, Form } from "rumsan-ui";
import store from "store";
import ethers from "ethers";
// import cashAidFactoryArtifact from "../../../build/contracts/CashAidFactory.json";
// import cashAidArtifact from "../../../build/contracts/CashAid.json";
import { getAbi } from "../blockchain/abi";
import { ethersContract, Contracts } from "../blockchain/contract";
import { wallet, provider } from "../blockchain";
import config from "../config";
import common from "../common";

function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

class Request extends Modal {
  constructor(cfg) {
    super(cfg);

    this.registerEvents("request-success", "request-failed");
    this.form = new Form({ target: `${cfg.target} form` });
    $(this.btnOpen).on("click", (e) => {
      this.open();
    });
    $(this.btnSend).on("click", (e) => {
      this.send();
    });
  }

  async send() {
    let { phone, tokenAmount } = this.form.get();
    common.showProcessing("Requesting Token from Beneficiary. Please wait...");

    let rahatContractAbi = getAbi(Contracts.RAHAT);
    let signer = await wallet.load();
    let rahatAdress = store.get("rahat");

    let contract = new ethers.Contract(rahatAdress, rahatContractAbi, signer);

    // let remainingBalance = await contract.tokenBalance(Number(phone));
    // if (tokenAmount > remainingBalance.toNumber()) {
    //   common.hideProcessing();
    //   swal.fire(
    //     "Request Amount too High",
    //     `Beneficiary only has ${remainingBalance} tokens left`,
    //     "error"
    //   );
    //   return;
    // }

    let tx = null;

    try {
      tx = await contract.createClaim(Number(phone), Number(tokenAmount));
      tx.wait();
      this.fire("request-success", { phone, tokenAmount });
      this.close();
      common.hideProcessing();
      return;
    } catch (error) {
      console.log(error);
      var msg = new TextDecoder("utf-8").decode(error.body);
      console.log(msg);
      console.log("error");
      common.hideProcessing();
      swal.fire(
        "Internal Server Error",
        "Please contact respective admins",
        "error"
      );
      return;
    }
  }

  async agencyInfo() {
    let agencyId = store.get("agency");
    let res = await fetch(`${config.api}/agency/${agencyId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    let resData = await res.json();

    return resData;
  }

  async checkBeneficiary(beneficiary) {
    let res = await fetch(
      `${config.api}/aid/projects?beneficiary=${encodeURIComponent(
        beneficiary
      )}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    let { data } = await res.json();
    if (!data) {
      return false;
    }

    return true;
  }

  async token(phone) {
    try {
      let cashAidContract = await ethersContract(
        cashAidAbi,
        this.projectAddress
      );

      this.tokenBalance = await cashAidContract.claimables(Number(phone));
      if (Number(this.tokenBalance) < Number(this.tokenAmount)) {
        common.hideProcessing();
        swal.fire(
          "ERROR",
          `beneficiary only has ${this.tokenBalance} tokens`,
          "error"
        );
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export default Request;

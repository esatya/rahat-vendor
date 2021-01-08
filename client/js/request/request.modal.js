import { Modal, Form } from "rumsan-ui";
import store from "store";
// import cashAidFactoryArtifact from "../../../build/contracts/CashAidFactory.json";
// import cashAidArtifact from "../../../build/contracts/CashAid.json";
import { getAbi } from "../blockchain/abi";
import { ethersContract, Contracts } from "../blockchain/contract";
import { wallet, provider } from '../blockchain'
import config from "../config";
import common from "../common";

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
    common.showProcessing("Requesting Token from Beneficiary. Please wait...")


    let rahatContractAbi = getAbi(Contracts.RAHAT);
    let tokenAddress = store.get('token');
    let rahatAdress = store.get('rahat');

    let rahatContract = await ethersContract(rahatContractAbi, rahatAdress);
    let signer = await wallet.load();
    let rahatContractSigner = rahatContract.connect(signer)
    let remainingBalance = await rahatContract.tokenBalance(Number(phone));
    if (tokenAmount > remainingBalance.toNumber()) {
      common.hideProcessing();
      swal.fire("Request Amount too High", `Beneficiary only has ${remainingBalance} tokens left`, "error");
      return;
    }
    try {
      let tx = await rahatContractSigner.createClaim(Number(phone), Number(tokenAmount));

      tx.wait();
      this.fire("request-success", { phone, tokenAmount });
      this.close();
      common.hideProcessing();
      return;

    } catch (error) {
      console.log('error');
      common.hideProcessing();
      swal.fire("Internal Server Error", "Please contact respective admins", "error");
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
      `${config.api}/aid/projects?beneficiary=${encodeURIComponent(beneficiary)}`,
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
      let cashAidContract = await ethersContract(cashAidAbi, this.projectAddress)

      this.tokenBalance = await cashAidContract.claimables(Number(phone));
      if (Number(this.tokenBalance) < Number(this.tokenAmount)) {
        common.hideProcessing();
        swal.fire("ERROR", `beneficiary only has ${this.tokenBalance} tokens`, "error");
        return false;
      }
      else {
        return true;
      }
    }
    catch (e) {
      console.log(e);
      return false;
    }

  }


}

export default Request;

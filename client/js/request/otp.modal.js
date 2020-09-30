import { Modal, Form } from "rumsan-ui";
import store from "store";
// import cashAidFactoryArtifact from "../../../build/contracts/CashAidFactory.json";
// import cashAidArtifact from "../../../build/contracts/CashAid.json";
import { cashAidAbi, cashAidFactoryAbi } from "../blockchain/abi";
import { ethersContract, Contracts } from "../blockchain/contract";
import { wallet, provider } from '../blockchain'
import config from "../config";
import common from "../common";
import { getAbi } from "../blockchain/abi";

class OTP extends Modal {
  constructor(cfg) {
    super(cfg);

    this.registerEvents("withdraw-success");
    this.form = new Form({ target: `${cfg.target} form` });

    this.comp.submit(async (e) => {
      e.preventDefault();

      try {
        const { otp } = this.form.get();
        this.withdraw(this.phone, otp);
      } catch (e) {
        alert(e);
        console.error(e);
      }
    });
  }

  async withdraw(phone, otp) {


    common.showProcessing("Requesting Token from Beneficiary. Please wait...")


    let rahatContractAbi = getAbi(Contracts.RAHAT);

    let rahatAddress = store.get('rahat');

    let rahatContract = await ethersContract(rahatContractAbi, rahatAddress);
    let signer = await wallet.load();
    let rahatContractSigner = rahatContract.connect(signer)

    try {
      let gas = await rahatContractSigner.estimateGas.getTokensFromClaim(Number(phone), otp);
      console.log("gas", gas)
      let tx = await rahatContractSigner.getTokensFromClaim(Number(phone), otp);
      tx.wait();
      console.log("hash", tx.hash);
      this.fire("withdraw-success", { phone, tokenAmount });
      this.close();
      common.hideProcessing();
      swal.fire({
        title: "Success",
        html: `You received <b>${this.amount} token</b>  from <b>${phone}</b>`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Okay",
      }).then(() => {
        window.location.href = '/home';
      })
      this.close();
      this.fire("withdraw-success", tx);
      return;

    } catch (error) {
      console.log('error', error);
      common.hideProcessing();
      swal.fire("Internal Server Error", "Please contact respective admins", "error");
      return;

    }


    // let factoryAddress = store.get("factory");
    // let project = store.get("project");
    // let { eth_address } = await this.agencyInfo();


    // let cashAidFactoryContract = await ethersContract(cashAidFactoryAbi, factoryAddress)
    // let signer = await wallet.load();
    // common.showProcessing("Getting Your Tokens...")
    // //assuming vendor is involved in single project
    // let projectAddress = await cashAidFactoryContract.CashAids(eth_address, project[0])


    // let cashAidContract = await ethersContract(cashAidAbi, projectAddress);
    // let cashAidContractSigner = cashAidContract.connect(signer);


    // try {
    //   let tx = await cashAidContractSigner.getTokens(Number(phone), otp);
    //   await tx.wait();


    //   common.hideProcessing();
    //   swal.fire({
    //     title: "Success",
    //     html: `You received <b>${this.amount} token</b>  from <b>${phone}</b>`,
    //     icon: "success",
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Okay",
    //   }).then(() => {
    //     window.location.href = '/home';
    //   })
    //   this.close();
    //   this.fire("withdraw-success", tx);


    // } catch (e) {
    //   common.hideProcessing();
    //   console.log(e);
    //   swal.fire("ERROR", "Invalid OTP", "error");
    // }
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
}

export default OTP;

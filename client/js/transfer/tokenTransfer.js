import { Modal, Form } from "rumsan-ui";
//import aidTokenArtifact from "../../../build/contracts/AidToken.json";
import { aidTokenAbi } from '../blockchain/abi';
import { ethersContract, Contracts } from "../blockchain/contract";
import store from "store";
import common from "../common";
import ethers from "../blockchain/ethers"
import { wallet, provider } from '../blockchain';
import { getAbi } from "../blockchain/abi";

export default class extends Modal {
  constructor(cfg) {
    super(cfg);
    this.registerEvents("token-sent");
    this.form = new Form({ target: `${cfg.target} form` });

    // $(this.btnOpen).on("click", (e) => {
    //   this.open();
    // });
    $(this.btnSend).on("click", (e) => {
      this.sendToken();
    });
  }

  async sendToken() {
    const { sendToAddr, sendAmount } = await this.form.get();
    common.showProcessing("Sending Tokens")
    let tokenAddress = store.get("token");
    let aidTokenAbi = getAbi(Contracts.TOKEN)
    let aidTokenContract = await ethersContract(aidTokenAbi, tokenAddress)
    let tokenName = await aidTokenContract.name();
    let signer = await wallet.load();
    let aidTokenContractSigner = aidTokenContract.connect(signer);



    try {

      let tx = await aidTokenContractSigner.transfer(sendToAddr, sendAmount);
      await tx.wait();
      this.form.clear();
      this.fire("token-sent", tx);
      this.close()
      common.hideProcessing();
      swal
        .fire({
          title: "Success",
          html: `You sent <b>${sendAmount}</b> ${tokenName} to <b>${sendToAddr}</b>`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Okay",
        })
    }
    catch (e) {
      console.log(e);
      common.hideProcessing()
      swal.fire("ERROR", "Internal Error", "error");
    }


  }
  setData(data) {
    const sendToAddr = this.select('[name=sendToAddr]');
    sendToAddr.val(data.to);
    if (data.value) {
      const sendAmount = this.select('[name=sendAmount]');
      sendAmount.val(ethers.utils.formatEther(sendAmount));
    }
  }
}

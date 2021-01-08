import { Component } from "rumsan-ui";
import store from "store";
//import aidTokenArtifact from "../../../build/contracts/AidToken.json";
import { getAbi } from "../blockchain/abi";
import { ethersContract, Contracts } from "../blockchain/contract";
import config from "../config";


export default class extends Component {
  getAddress() {
    const sanduk = store.get("sanduk");
    if (!sanduk) return null;
    return sanduk[0].address;
  }

  async tokenBalance() {
    let tokenAddress = store.get("token");
    let tokenAbi = getAbi(Contracts.TOKEN)
    let aidTokenContract = await ethersContract(tokenAbi, tokenAddress)
    let tokenBalance = await aidTokenContract.balanceOf(this.account.address)
    console.log(tokenBalance.toNumber());
    this.select(".tokenBalance").text(tokenBalance);
  }

  async tokenInfo() {
    //if (!self.account) return;
    let tokenAddress = store.get("token");
    let rahatAbi = getAbi('Rahat');

    let { token: { symbol, name } } = await this.agencyInfo();
    // let tokenSymbol = await aidTokenInstance.methods.symbol().call();
    // let tokenName = await aidTokenInstance.methods.name().call();

    this.select(".tokenSymbol").text(symbol);
    this.select(".tokenName").text(name);
  }

  async checkVendor(address) {
    const res = await fetch(`${config.api}/vendors/${address}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return res.status === 200 ? true : false
  }

  async getFactory() {
    const res = await fetch(`${config.api}/contract/factory`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const resData = await res.json();

    return resData;
  }

  async getContracts() {
    const res = await fetch(`${config.api}/app/settings`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const resData = await res.json();

    return resData;
  }

  async agencyInfo() {
    let agencyId = store.get("agency");
    let res = await fetch(`${config.api}/app/settings`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let { agency } = await res.json();
    return agency;
  }


  async projectInfo() {
    let { address } = JSON.parse(store.get("sanduk"));

    let res = await fetch(
      `${config.api}/aid/projects?vendor=${encodeURIComponent(`0x${address}`)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    let { data } = await res.json();

    return data;
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

}

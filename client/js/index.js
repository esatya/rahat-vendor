/* eslint-disable no-new */
/* global $ */
import store from "store";

import Info from "./dashboard/info";
import Scanner from "./dashboard/scanner";
import TokenTransfer from "./transfer/tokenTransfer";
import TokenReceive from "./transfer/tokenReceive";
import TokenRequest from "./request/request.modal";
import TxTable from "./blockchain/transaction.list";
import OTP from './request/otp.modal';
import Wallet from "./blockchain/wallet";
import { getAbi } from "./blockchain/abi"
import { Contracts, ethersContract } from "./blockchain/contract";
import { queryTransaction } from './blockchain/queryTransaction';
import Register from "./register/register.modal";



document.addEventListener('DOMContentLoaded', async () => {
  if (!store.get('sanduk')) location.replace('/');
  const scanner = new Scanner({ target: "#mdlQR", btnOpen: "#btnScanner" });
  const info = new Info({ target: "#cmpInfo" });
  const wallet = await Wallet.load();
  const register = new Register({ target: "#mdlRegister" });

  $("#btnRequest").show()
  if (!store.get("sanduk")) {
    window.location.href = "/";
    return;
  }
  let rahatContract, rahatAddress;


  const tokenTransfer = new TokenTransfer({
    target: "#mdlSendToken",
    btnOpen: "#btnSendToken",
    btnSend: "#btnConfirmSend",
  });
  const tokenReceive = new TokenReceive({
    target: "#mdlReceiveToken",
    btnOpen: "#btnReceiveToken",
  });

  const tokenRequest = new TokenRequest({
    target: "#mdlRequestToken",
    btnOpen: "#btnRequest",
    btnSend: "#btnRequestSend"
  })

  const otp = new OTP({
    target: "#mdlOTP"
  })
  const txTable = new TxTable({
    target: "#tx-table",
  });

  $('#btnSendToken').on('click', () => {

    scanner.open((data) => {
      tokenTransfer.open();
      tokenTransfer.setData(data);
    });
  });
  let { address } = JSON.parse(store.get("sanduk"));

  tokenRequest.on('request-success', async (e, d) => {
    otp.phone = d.phone,
      otp.amount = d.tokenAmount
    otp.open()

    let query = await queryTransaction(rahatContract, `0x${address}`)

    let filteredTx = filterTx(query);
    txTable.loadData(filteredTx.slice(0, 3));
  })

  otp.on("withdraw-success", async () => {

    let query = await queryTransaction(rahatContract, `0x${address}`)
    let filteredTx = filterTx(query);
    txTable.loadData(filteredTx.slice(0, 3));
  });

  otp.account = wallet;
  tokenRequest.account = wallet;
  scanner.account = wallet;
  info.account = wallet;
  tokenTransfer.account = wallet;
  tokenReceive.account = wallet;
  register.account = wallet.address;


  let { agency: { contracts } } = await info.getContracts();
  store.set("rahat", contracts.rahat);
  store.set("token", contracts.token);

  try {
    let vendor = await info.checkVendor(`0x${address}`);
    if (!vendor) {
      register.open();
    }
  }
  catch (e) {

    console.log(e);
  }


  try {
    info.tokenInfo()
    info.tokenBalance()
    let rahatContractAbi = getAbi(Contracts.RAHAT);
    rahatAddress = store.get('rahat');
    rahatContract = await ethersContract(rahatContractAbi, rahatAddress)
    let query = await queryTransaction(rahatContract, `0x${address}`)
    if (!query) {
      throw "No transactions"
    }
    let filteredTx = filterTx(query);
    txTable.loadData(filteredTx.slice(0, 3));
  } catch (error) {
  }

  txTable.on("get-token", (e, d) => {
    otp.phone = d.phone;
    otp.amount = d.amount;
    otp.open();
  });



  let timerId = 0;
  function refresh() {
    timerId = setInterval(() => {
      info.tokenBalance();
    }, 5000);
  }
  refresh();
});

function filterTx(tx) {
  let filteredTx = tx.reduce((acc, current) => {
    const x = acc.find((item) => item.phone === current.phone);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return filteredTx;
}

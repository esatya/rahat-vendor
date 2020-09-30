import store from "store";

import Info from "../dashboard/info";
import TxTable from "./list.panel";
import { getAbi } from "../blockchain/abi";
import { cashAidFactoryAbi, cashAidAbi } from "../blockchain/abi";
import { queryTransaction } from "../blockchain/queryTransaction";
import { ethersContract, Contracts } from "../blockchain/contract";

$(document).ready(() => {
  const txTable = new TxTable({
    target: "#tx-table",
  });
  const info = new Info();
  let { address } = JSON.parse(store.get("sanduk"));
  $("#btnHome").show();

  (async () => {
    let rahatAddress = store.get("rahat");
    let rahatContractAbi = getAbi(Contracts.RAHAT);
    let rahatContract = await ethersContract(rahatContractAbi, rahatAddress);

    let tx = await queryTransaction(rahatContract, `0x${address}`);
    console.log(tx);

    txTable.loadData(tx);
  })();
});

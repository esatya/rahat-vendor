import AppSettings from '../settings/app';
import { ethers } from 'ethers';


const provider = new ethers.providers.JsonRpcProvider(AppSettings.network.url);

async function queryTransaction(rahatContract, vendor) {
  let filtersFromVendor = rahatContract.filters.Claimed(vendor);
  filtersFromVendor.fromBlock = 0;
  filtersFromVendor.toBlock = 'latest'
  filtersFromVendor.topic = []
  const txLog = await provider.getLogs(filtersFromVendor);
  let eventLogs = txLog.map((el) => {
    return rahatContract.interface.parseLog(el);
  })
  try {
    let updatedEventLogs = await Promise.all(eventLogs.map(async (el) => {
      const claimStatus = await rahatContract.recentClaims(vendor, el.args.phone.toNumber());
      el.isReleased = claimStatus.isReleased;
      el.date = claimStatus.date.toNumber();
      return el;
    }))

    const data = await updatedEventLogs.reduce((acc, item) => {
      let tx = {};
      tx.vendor = item.args.vendor;
      //tx.contract = item.args._contract;
      tx.phone = item.args.phone.toNumber();
      tx.amount = item.args.amount.toNumber();
      tx.isReleased = item.isReleased;
      tx.date = item.date;

      acc.push(tx);

      return acc;
    }, []);
    return [...data].reverse(); //show latest transaction on top
  }
  catch (e) {
    console.log(e)
    return e;
  }


}

export { queryTransaction };
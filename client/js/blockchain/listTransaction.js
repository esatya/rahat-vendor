async function getTokenTransactions(instance, cashAidInstance, vendor) {
  const txLog = await instance.getPastEvents('LogTokenClaimed', {
    filter: { _vendor: vendor },
    fromBlock: 0,
    toBlock: 'latest',
  });

  if (!txLog) {
    return;
  }

  try {
    const updatedTxLog = await Promise.all(txLog.map(async (el) => {
      // let phone = Number(el.returnValues)
      const claimStatus = await cashAidInstance.methods.allClaims(vendor, Number(el.returnValues._phone)).call();
      el.claimStatus = claimStatus.status;
      el.expiryDate = claimStatus.expiryDate;
      return el;
    }));

    const data = await updatedTxLog
      .reduce((acc, item) => {
        const obj = { transactionHash: item.transactionHash };
        obj.vendor = item.returnValues._vendor;
        obj.contract = item.returnValues._contract;
        obj.phone = item.returnValues._phone;
        obj.amount = item.returnValues._amount;
        obj.blockNumber = item.blockNumber;
        obj.claimStatus = item.claimStatus;
        obj.expiryDate = item.expiryDate;

        acc.push(obj);

        return acc;
      }, []);

    return [...data].reverse(); // shows latest transaction on top
  } catch (e) {
    console.error(e);
  }
}


export { getTokenTransactions };

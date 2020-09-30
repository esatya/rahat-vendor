
export const getAbi = (contractName) => {
  const contractJson = require(`../../../build/contracts/${contractName}`);
  return contractJson.abi;
};



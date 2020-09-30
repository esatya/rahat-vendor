
import ethers from './ethers';
import appSettings from '../settings/app';

// async function initContract(abi, address) {


//   try {
//     const instance = await new web3.eth.Contract(abi, address);

//     return instance;
//   } catch (error) {
//     console.error('Could not connect to contract or chain.');
//   }
// }

async function ethersContract(abi, contractAddress) {
  let provider = new ethers.providers.JsonRpcProvider(appSettings.network.url);

  try {
    const instance = new ethers.Contract(contractAddress, abi, provider);

    return instance;
  } catch (error) {
    console.log('Could not connect to contract or chain.', error);
  }
}

const Contracts = {
  RAHAT: 'Rahat',
  TOKEN: 'AidToken'
}

export { ethersContract, Contracts };

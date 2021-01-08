import ethers from 'ethers';
import wallet from './wallet';
import AppSettings from '../settings/app';
import config from '../config'

if (!AppSettings.network) {
  AppSettings.network = { name: 'rumsan', url: `${config.web3.httpProvider}`, display: 'Rumsan Network' };
  AppSettings.set('network', AppSettings.network);
}
const provider = new ethers.providers.JsonRpcProvider(AppSettings.network.url);


export default ethers;
export { wallet, provider };

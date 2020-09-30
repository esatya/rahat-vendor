import ethers from 'ethers';
import wallet from './wallet';
import AppSettings from '../settings/app';

if (!AppSettings.network) {
  AppSettings.network = { name: 'rumsan', url: 'https://rumsannetwork.esatya.io', display: 'Rumsan Network' };
  AppSettings.set('network', AppSettings.network);
}
const provider = new ethers.providers.JsonRpcProvider(AppSettings.network.url);


export default ethers;
export { wallet, provider };

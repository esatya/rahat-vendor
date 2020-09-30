/* global */
import store from 'store';
import { ethers, Wallet } from 'ethers';
import appSettings from '../settings/app';

const storeName = 'sanduk';

export default {
  async create(mnemonic) {
    const passcode = store.get('appChabi');
    if (!passcode) { throw Error('Passcode must be set first'); }
    let wallet = store.get(storeName);
    if (wallet) return { wallet: null, encryptedWallet: wallet };
    if (mnemonic) wallet = ethers.Wallet.fromMnemonic(mnemonic);
    else wallet = ethers.Wallet.createRandom();
    store.set('chabi', wallet.privateKey)

    const encryptedWallet = await wallet.encrypt(passcode, {
      // Remove for highest security
      // scrypt: {
      //   // The number must be a power of 2 (default: 131072)
      //   N: 16,
      // },
    });
    store.set(storeName, encryptedWallet);

    return { wallet, encryptedWallet };
  },

  async load(passcode) {
    let wallet = this.loadFromChabi();
    if (!wallet) {
      passcode = passcode || store.get('appChabi');
      if (!passcode) { throw Error('Passcode must be set first'); }
      const encryptedWallet = store.get(storeName);
      if (!encryptedWallet) throw Error('No local wallet found');
      wallet = await ethers.Wallet.fromEncryptedJsonSync(encryptedWallet, passcode);
    }
    if (appSettings.network && appSettings.network.url) {
      const provider = new ethers.providers.JsonRpcProvider(appSettings.network.url);
      wallet = wallet.connect(provider)
    }
    return wallet;
  },

  loadFromChabi() {
    let chabi = store.get('chabi');
    if (!chabi) return null;
    return new ethers.Wallet(chabi);
  },

  getAddress() {
    if (!store.get(storeName)) return null;
    return JSON.parse(store.get(storeName)).address;
  },

  clear() {
    store.remove('appChabi');
    store.remove('sanduk');
    window.location.replace('/');
  },
};

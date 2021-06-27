import { ethers } from 'ethers';

import DataService from '../../services/db';

const Wallet = {
	isValidMnemonic: ethers.utils.isValidMnemonic,

	async connectProvider(wallet, network) {
		if (!network) network = await DataService.getNetwork();
		const { url } = network;
		const provider = new ethers.providers.JsonRpcProvider(url);
		return wallet.connect(provider);
	},

	async getProvider() {
		if (!network) network = await DataService.getNetwork();
		const { url } = network;
		const provider = new ethers.providers.JsonRpcProvider(url);
		return provider;
	},

	async loadFromJson(passcode, encryptedJsonWallet) {
		if (!passcode) {
			throw Error('Passcode must be set first');
		}
		const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJsonWallet, passcode.toString());
		return this.connectProvider(wallet);
	},

	async loadWallet(passcode) {
		const wlt = await DataService.getWallet();
		return this.loadFromJson(passcode, wlt);
	},

	async create(passcode, mnemonic) {
		if (!passcode) {
			throw Error('Passcode must be set first');
		}
		let wallet = null;
		if (mnemonic) wallet = ethers.Wallet.fromMnemonic(mnemonic);
		else wallet = ethers.Wallet.createRandom();

		wallet = await this.connectProvider(wallet);
		const encryptedWallet = await wallet.encrypt(passcode.toString());
		return { wallet, encryptedWallet };
	},

	async loadFromPrivateKey(privateKey) {
		if (!privateKey) return null;
		let wallet = await new ethers.Wallet(privateKey);
		if (!wallet) throw Error('Wallet not found');
		return this.connectProvider(wallet);
	}
};

export default Wallet;

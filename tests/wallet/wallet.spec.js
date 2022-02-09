import { ethers } from 'ethers';

import 'regenerator-runtime/runtime';
import Wallet from '../../src/utils/blockchain/wallet';
import { NETWORKS, getNetworkByName } from '../../src/constants/networks';
import 'fake-indexeddb/auto';
import DataService from '../../src/services/db';

jest.setTimeout(100000);

const mnemonic = 'announce room limb pattern dry unit scale effort smooth jazz weasel alcohol';
class MockWallet {
	constructor() {
		this.mnemonic = mnemonic;
		this.wallet = {};
		this.encryptedWallet = {};
		this.setWalletFromMnemonic();
	}

	setWalletFromMnemonic() {
		const wallet = ethers.Wallet.fromMnemonic(this.mnemonic);
		this.wallet = wallet;
	}
	getWallet() {
		return this.wallet;
	}
	setEncryptedWallet(encrypted) {
		this.encryptedWallet(encrypted);
	}
	getEncryptedWallet() {
		return this.encryptedWallet;
	}
	getPrivateKey() {
		return this.wallet.privateKey;
	}
}

describe('Test all methods in utils/wallet.js file', () => {
	const passcode = '123123';

	const globalWallet = {};

	const mockWallet = new MockWallet();

	it('catches error while trying to create wallet without properly', async () => {
		// const wallet = await Wallet.create();
		try {
			await Wallet.create();
		} catch (e) {
			expect(e.message).toMatch('Passcode must be set first');
		}
	});
	it('creates wallet properly', async () => {
		// const wallet = await Wallet.create();

		const { wallet, encryptedWallet } = await Wallet.create(passcode);

		globalWallet.wallet = wallet;
		globalWallet.encryptedWallet = encryptedWallet;
		await DataService.saveWallet(encryptedWallet);
	});

	it('connects with provider correctly', async () => {
		const connectedWallet = await Wallet.connectProvider(globalWallet.wallet);
		const { provider } = connectedWallet;
		const walletNetwork = await provider.getNetwork();
		const fetchProvider = await Wallet.getProvider();
		const providerNetwork = await fetchProvider.getNetwork();

		expect(walletNetwork).toMatchObject(providerNetwork);
	});
	it('connects with provider correctly when network is passed', async () => {
		const network = getNetworkByName('mainnet');
		const connectedWallet = await Wallet.connectProvider(globalWallet.wallet, network);
		const { provider } = connectedWallet;
		const walletNetwork = await provider.getNetwork();
		const fetchProvider = await Wallet.getProvider(network);
		const providerNetwork = await fetchProvider.getNetwork();
		console.group({
			walletNetwork,
			providerNetwork
		});
		expect(walletNetwork).toMatchObject(providerNetwork);
	});

	it('creates wallet from mnemonic properly', async () => {
		const { wallet } = await Wallet.create(passcode, mnemonic);
		const savedMockWallet = await Wallet.connectProvider(mockWallet.getWallet());
		expect(wallet.getAddress()).toEqual(savedMockWallet.getAddress());
	});

	it('loads wallet from encryptedJson', async () => {
		try {
			await Wallet.loadFromJson('', globalWallet.encryptedWallet);
		} catch (e) {
			expect(e.message).toMatch('Passcode must be set first');
		}
		const unlockedWallet = await Wallet.loadFromJson(passcode, globalWallet.encryptedWallet);

		const savedMockWallet = await Wallet.connectProvider(mockWallet.getWallet());

		expect(unlockedWallet.getAddress()).toEqual(savedMockWallet.getAddress());
	});

	it('loads wallet from private key', async () => {
		const checkWallet = await Wallet.loadFromPrivateKey();
		expect(checkWallet).toBeNull();

		const mockPrivateKey = '0xola12983aklsdlah9zxckhasdas';

		try {
			await Wallet.loadFromPrivateKey(mockPrivateKey);
		} catch (e) {
			expect(e.message).toMatch(
				'invalid hexlify value (argument="value", value="0xola12983aklsdlah9zxckhasdas", code=INVALID_ARGUMENT, version=bytes/5.5.0)'
			);
		}
		const walletFromPrivateKey = await Wallet.loadFromPrivateKey(mockWallet.getPrivateKey());

		const savedMockWallet = await Wallet.connectProvider(mockWallet.getWallet());

		expect(walletFromPrivateKey.getAddress()).toEqual(savedMockWallet.getAddress());
	});
	it('gets provider', async () => {
		const defNetwork = NETWORKS.find(ntwrk => ntwrk.default === true);
		const mockProvider = new ethers.providers.JsonRpcProvider(defNetwork.url);

		const provider = await Wallet.getProvider();
		expect(provider.getNetwork()).toMatchObject(mockProvider.getNetwork());
	});
	it('loads wallet from indexDb', async () => {
		const wallet = await Wallet.loadWallet(passcode);
		const savedMockWallet = await Wallet.connectProvider(mockWallet.getWallet());

		expect(wallet.getAddress()).toEqual(savedMockWallet.getAddress());
	});

	it('catches error when loading wallet from Json if passcode not sent', async () => {
		try {
			await Wallet.create();
		} catch (e) {
			expect(e.message).toMatch('Passcode must be set first');
		}
	});
});

import Dexie from 'dexie';

import { DB } from '../constants';
import { getDefaultNetwork } from '../constants/networks';

const db = new Dexie(DB.NAME);
db.version(DB.VERSION).stores({
	data: 'name,data',
	documents: 'hash,type,name,file,encryptedFile,createdAt,inIpfs',
	assets: 'address,type,name,symbol,decimal,balance,network',
	agencies: 'address,name,api,network,rahatAddress,tokenAddress,adminAddress,phone,email,logo,isApproved',
	transactions: 'hash,type,timestamp,amount,to,from,status,image,tokenId',
	nfts: 'tokenId,name,symbol,description,imageUri,metadataUri,value,amount'
});

const DataService = {
	dbInstance: db,

	save(name, data) {
		return db.data.put({ name, data });
	},

	async get(name) {
		let obj = await db.data.get(name);
		if (!obj) return null;
		return obj.data;
	},

	remove(name) {
		return db.data.delete(name);
	},

	list() {
		return db.data.toArray();
	},

	saveProfile(data) {
		return this.save('profile', data);
	},
	async getProfile() {
		let profile = await this.get('profile');
		if (profile) profile.img = await this.get('profileImage');
		return profile;
	},

	saveProfileImage(img) {
		return this.save('profileImage', img);
	},

	saveProfileIdCard(img) {
		return this.save('profileIdCard', img);
	},
	saveHasBackedUp(hasBackedUp) {
		return this.save('hasBackedUp', hasBackedUp);
	},

	async initAppData() {
		let network = await this.getNetwork();
		let address = await this.getAddress();
		let wallet = await this.getWallet();
		let hasBackedUp = await this.get('hasBackedUp');
		let hasSynchronized = await this.get('hasSynchronized');
		return {
			network,
			address,
			wallet,
			hasBackedUp: hasBackedUp ? true : false,
			hasSynchronized
		};
	},
	setSynchronized(val) {
		return this.save('hasSynchronized', val);
	},

	async clearAll() {
		await db.data.clear();
		await db.assets.clear();
		await db.documents.clear();
		await db.nfts.clear();
		await db.transactions.clear();
		await db.agencies.clear();
	},

	saveNetwork(network) {
		return this.save('network', network);
	},

	async getNetwork() {
		let network = await this.get('network');
		if (!network) return getDefaultNetwork();
		return network;
	},

	async decrementNft(tokenId, decreaseBy) {
		if (Math.abs(decreaseBy) <= 0) return 1;
		const nft = await db.nfts.get({ tokenId });
		let newAmount = nft.amount - Math.abs(decreaseBy);
		newAmount = newAmount < 0 ? 0 : newAmount;
		return db.nfts.update(tokenId, { amount: newAmount });
	},

	async batchDecrementNft(tokenIds = [], decrements = []) {
		if (tokenIds.length !== decrements.length) return;
		return tokenIds.forEach(async (ids, index) => await this.decrementNft(ids, decrements[index]));
	},

	async getIpfs() {
		let ipfsUrl = await this.get('ipfsUrl');
		if (!ipfsUrl) ipfsUrl = process.env.REACT_APP_DEFAULT_IPFS;
		let ipfsDownloadUrl = await this.get('ipfsUrlDownload');
		if (!ipfsDownloadUrl) ipfsDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
		return { ipfsUrl, ipfsDownloadUrl };
	},

	saveIpfsUrl(ipfsUrl) {
		return this.save('ipfsUrl', ipfsUrl);
	},

	saveIpfsDownloadUrl(ipfsDownloadUrl) {
		return this.save('ipfsUrlDownload', ipfsDownloadUrl);
	},

	saveAddress(address) {
		localStorage.setItem('address', address);
		return this.save('address', address);
	},

	getAddress() {
		return this.get('address');
	},

	getAddressFromLocal() {
		return localStorage.getItem('address');
	},

	async saveWallet(wallet) {
		return this.save('wallet', wallet);
	},

	getWallet() {
		return this.get('wallet');
	},

	addAgency(agency) {
		return db.agencies.put(agency);
	},

	getAgency(address) {
		return db.agencies.get(address);
	},

	async updateAgency(agencyAddress, data) {
		return db.agencies.update(agencyAddress, data);
	},

	listAgencies() {
		return db.agencies.toArray();
	},

	async getDefaultAgency() {
		let agencies = await this.listAgencies();
		if (!agencies) return null;
		return agencies[0];
	},

	addTx(tx) {
		return db.transactions.put(tx);
	},

	getTx(hash) {
		return db.transactions.get(hash);
	},

	listTx(type) {
		if (!type) return db.transactions.orderBy('timestamp').reverse().toArray();
		return db.transactions.where({ type: type }).reverse().sortBy('timestamp');

		// return db.transactions.get({ type }).orderBy('timestamp').reverse();
	},

	async addNft(nft) {
		const { tokenId } = nft;
		const storedNft = await this.getNft(tokenId);
		if (!storedNft) return db.nfts.put({ ...nft, amount: nft.amount ? nft.amount : 1 });
		storedNft.amount++;
		return db.nfts.put(storedNft);
	},

	getNft(id) {
		return db.nfts.get(parseInt(id));
	},

	listNft() {
		return db.nfts?.toArray(list => list.filter(item => item.amount > 0)).catch(() => []);
	},

	async saveDocuments(docs) {
		if (!Array.isArray(docs)) docs = [docs];
		return db.documents.bulkAdd(docs);
	},

	getDocument(hash) {
		return db.documents.get(hash);
	},

	async updateDocument(key, data) {
		return db.documents.update(key, data);
	},

	listDocuments() {
		return db.documents.toArray();
	},

	getAsset(address) {
		return db.assets.get(address);
	},

	async getAssetBySymbol(symbol, network) {
		if (!network) return db.assets.get({ symbol });
		return db.assets.filter(a => a.symbol === symbol && a.network && a.network.name === network).first();
	},

	async addDefaultAsset(symbol, name) {
		let asset = await this.getAsset('default');
		if (!asset) return db.assets.add({ address: 'default', symbol, name, decimal: 18, balance: 0 });
		asset = {
			...asset,
			symbol,
			name
		};
		return this.updateAsset(asset.address, asset);
	},

	async addMultiAssets(assets) {
		if (!Array.isArray(assets)) assets = [assets];
		return db.assets.bulkAdd(assets);
	},

	saveAsset(asset) {
		return db.assets.put(asset);
	},

	async updateAsset(key, asset) {
		return db.assets.update(key, asset);
	},

	listAssets(network) {
		if (!network) return db.assets.toArray();
		return db.assets.filter(a => a.network === undefined || a.network.name === network).toArray();
	}
};

export default DataService;

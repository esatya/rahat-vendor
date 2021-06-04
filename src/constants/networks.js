const networkList = [
	{
		name: 'rumsan',
		url: 'https://chain.esatya.io',
		display: 'Rumsan Network',
		default: true
	},
	{
		name: 'rumsan_test',
		url: 'https://testnetwork.esatya.io',
		display: 'Rumsan Test Network'
	},
	{
		name: 'mainnet',
		url: 'https://mainnet.infura.io/v3/ae22018377b14a61983be979df457b20',
		display: 'Mainnet (Ethereum)'
	},
	{ name: 'ropsten', url: 'https://ropsten.infura.io/v3/ae22018377b14a61983be979df457b20', display: 'Ropsten' },
	{ name: 'kovan', url: 'https://kovan.infura.io/v3/ae22018377b14a61983be979df457b20', display: 'Kovan' },
	{ name: 'rinkeby', url: 'https://rinkeby.infura.io/v3/ae22018377b14a61983be979df457b20', display: 'Rinkeby' },
	{ name: 'localhost', url: 'http://localhost:8545', display: 'Ganache (http://localhost:8545)' }
];

const _getDefaultNetwork = () => {
	return networkList.find(d => d.default);
};

const _getNetworkByName = name => {
	if (!name) return _getDefaultNetwork();
	return networkList.find(d => d.name === name);
};

export const getNetworkByName = _getNetworkByName;
export const getDefaultNetwork = _getDefaultNetwork;
export const NETWORKS = networkList;

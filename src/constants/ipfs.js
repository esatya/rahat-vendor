const ipfsList = [
	{
		name: 'rumsan',
		view: 'https://ipfs.rumsan.com',
		upload: 'http://172.110.7.136:5001',
		display: 'Rumsan',
		default: true
	},
	{
		name: 'localhost',
		view: 'http://localhost:8080/ipfs',
		upload: 'http://localhost:5001',
		display: 'localhost'
	}
];

const _getDefault = () => {
	return ipfsList.find(d => d.default);
};

const _getByName = name => {
	if (!name) return _getDefaultNetwork();
	return ipfsList.find(d => d.name === name);
};

export const getIpfsByName = _getByName;
export const getDefaultIpfs = _getDefault;
export const IPFSLIST = ipfsList;

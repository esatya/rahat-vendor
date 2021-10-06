import { ethers } from 'ethers';

export default function Blockchain({ wallet, network }) {
	const provider = network != null ? new ethers.providers.JsonRpcProvider(network.url) : null;
	return {
		async getBalance(address) {
			address = address || wallet.address;
			const balance = await provider.getBalance(address);
			return ethers.utils.formatEther(balance);
		}
	};
}

import { ethers } from 'ethers';

export default function Contract({ wallet, address, type }) {
	const getAbi = () => {
		return require(`./${type}`);
	};

	return {
		abi: getAbi(),
		get() {
			return new ethers.Contract(address, getAbi(), wallet);
		}
	};
}

import { ethers } from 'ethers';
import { getDefaultNetwork } from '../../../constants/networks';

const provider = new ethers.providers.JsonRpcProvider(getDefaultNetwork());
export default function Contract({ address, type }) {
	const getAbi = () => {
		return require(`./${type}`);
	};

	return {
		abi: getAbi(),
		get() {
			return new ethers.Contract(address, getAbi(), provider);
		}
	};
}

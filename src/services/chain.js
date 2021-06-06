import { ethers } from 'ethers';
import { getDefaultNetwork } from '../constants/networks';
import DataService from './db';

const ABI = {
	TOKEN: require(`../assets/contracts/aidToken.json`),
	RAHAT: require(`../assets/contracts/rahat.json`),
	ERC20: require(`../assets/contracts/erc20.json`),
	ERC721: require(`../assets/contracts/erc721.json`)
};

const DefaultProvider = new ethers.providers.JsonRpcProvider(getDefaultNetwork());
const getAgencyDetails = async agencyAddress => {
	const details = await DataService.getAgency(agencyAddress);
	if (!details) throw Error('Agency does not exists');
	const provider = details.network ? new ethers.providers.JsonRpcProvider(details.network) : DefaultProvider;
	const rahatContract = new ethers.Contract(agencyAddress, ABI.RAHAT, provider);
	const tokenContract = new ethers.Contract(details.tokenAddress, ABI.TOKEN, provider);
	return {
		details,
		provider,
		rahatContract,
		tokenContract
	};
};

const RahatService = (agencyAddress, wallet) => {
	return {
		async getContract() {
			const agency = await getAgencyDetails(agencyAddress);
			return agency.rahatContract.connect(wallet);
		},
		async chargeCustomer(phone, amount) {
			const contract = await this.getContract();
			let benBalance = await contract.tokenBalance(phone);
			console.log(benBalance.toNumber());
			// if (amount > benBalance.toNumber()) {
			// 	// waring token amount is greater than remaining blance
			// }
			console.log(phone, amount);
			const tx = await contract.createClaim(Number(phone), Number(amount));
			return tx.wait();
		}
	};
};

const TokenService = async (agencyAddress, wallet) => {
	const agency = await getAgencyDetails(agencyAddress);
	const contract = agency.tokenContract.connect(wallet);
	return {
		contract,
		getBalance() {}
	};
};

export { DefaultProvider, RahatService, TokenService };

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
			//let benBalance = await contract.tokenBalance(phone);
			// if (amount > benBalance.toNumber()) {
			// 	// waring token amount is greater than remaining blance
			// }
			const tx = await contract.createClaim(Number(phone), Number(amount));
			return tx.wait();
		},
		async verifyCharge(phone, otp) {
			const contract = await this.getContract();
			const tx = await contract.getTokensFromClaim(Number(phone), otp);
			return tx.wait();
		}
	};
};

const TokenService = (agencyAddress, wallet) => {
	return {
		async getContract() {
			const agency = await getAgencyDetails(agencyAddress);
			return wallet ? agency.tokenContract.connect(wallet) : agency.tokenContract;
		},
		async getBalance(address) {
			if (!address) address = await DataService.getAddress();
			const contract = await this.getContract();
			return contract.balanceOf(address);
		},
		async transfer(address, amount) {
			const contract = await this.getContract();
			const tx = await contract.transfer(address, Number(amount));
			return tx.wait();
		}
	};
};

export { DefaultProvider, RahatService, TokenService };

import { ethers } from 'ethers';
import { getDefaultNetwork } from '../constants/networks';
import DataService from './db';

const ABI = {
	TOKEN: require(`../assets/contracts/RahatERC20.json`),
	RAHAT: require(`../assets/contracts/Rahat.json`),
	ERC20: require(`../assets/contracts/RahatERC20.json`),
	ERC721: require(`../assets/contracts/erc721.json`)
};

const DefaultProvider = new ethers.providers.JsonRpcProvider(getDefaultNetwork());
const getAgencyDetails = async agencyAddress => {
	const details = await DataService.getAgency(agencyAddress);
	if (!details) throw Error('Agency does not exists');
	const provider = details.network ? new ethers.providers.JsonRpcProvider(details.network) : DefaultProvider;
	const rahatContract = new ethers.Contract(agencyAddress, ABI.RAHAT.abi, provider);
	const tokenContract = new ethers.Contract(details.tokenAddress, ABI.TOKEN.abi, provider);
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
		async chargeCustomerForERC20(phone, amount) {
			const contract = await this.getContract();
			//let benBalance = await contract.tokenBalance(phone);
			// if (amount > benBalance.toNumber()) {
			// 	// waring token amount is greater than remaining blance
			// }
			const tx = await contract.createERC20Claim(Number(phone), Number(amount));
			return tx.wait();
		},
		async verifyChargeForERC20(phone, otp) {
			const contract = await this.getContract();
			const tx = await contract.getERC20FromClaim(Number(phone), otp);
			return tx.wait();
		},
		async chargeCustomerForERC1155(phone, amount,tokenId) {
			const contract = await this.getContract();
			//let benBalance = await contract.tokenBalance(phone);
			// if (amount > benBalance.toNumber()) {
			// 	// waring token amount is greater than remaining blance
			// }
			const tx = await contract.createERC1155Claim(Number(phone), Number(amount),Number(tokenId));
			return tx.wait();
		},
		async verifyChargeForERC1155(phone, otp) {
			const contract = await this.getContract();
			const tx = await contract.getERC1155FromClaim(Number(phone), otp,Number(tokenId));
			return tx.wait();
		},

		async getBeneficiaryTokenIds(phone) {
			const contract = await this.getContract();
			const tokenIds = await contract.getTokenIdsOfBeneficiary(Number(phone));
			return tokenIds;
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

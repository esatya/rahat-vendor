import axios from 'axios';

import API from '../constants/api';

export async function registerToAgency(payload) {
	try {
		const res = await fetch(`${API.REGISTER}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
		return { res: res.data };
	} catch (e) {
		throw Error(e);
	}
}

export async function getVendorByWallet(walletAddress) {
	try {
		const res = await axios.get(`${API.VENDORS}/${walletAddress}`);
		return res.data;
	} catch (e) {
		throw Error(e);
	}
}

export const getDefautAgency = async () => {
	let appData = await fetch(`${process.env.REACT_APP_DEFAULT_AGENCY_API}/app/settings`).then(async r => {
		if (!r.ok) throw Error(r.message);
		return r.json();
	});
	const agencyData = {
		api: process.env.REACT_APP_DEFAULT_AGENCY_API,
		address: appData.agency.contracts.rahat,
		adminAddress: appData.agency.contracts.rahat_admin,
		network: appData.networkUrl,
		erc20Address: appData.agency.contracts.rahat_erc20,
		erc1155Address: appData.agency.contracts.rahat_erc1155,
		name: appData.agency.name,
		email: appData.agency.email,
		isApproved: false
	};
	return agencyData;
};

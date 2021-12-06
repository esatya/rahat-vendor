import API from '../constants/api';
import axios from 'axios';

export async function registerToAgency(payload) {
	try {
		const res = await axios.post(`${API.REGISTER}`, JSON.stringify(payload), {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});
		return { res: res.data };
	} catch (e) {
		throw Error(e);
	}
}

export async function getPackageDetails(id) {
	try {
		const res = await axios.get(`${API.NFT}/token/${id}`);
		return res.data;
	} catch (e) {
		throw Error(e);
	}
}

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

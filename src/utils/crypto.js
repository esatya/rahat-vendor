import CryptoJS from 'crypto-js';

export const encryptData = (key, data) => {
	let raw_data = '';
	if (typeof data === 'string') raw_data = data;
	if (typeof data === 'object') raw_data = JSON.stringify(data);
	const ciphertext = CryptoJS.AES.encrypt(raw_data, key).toString();
	return ciphertext;
};

export const decryptData = (key, ciphertext) => {
	const bytes = CryptoJS.AES.decrypt(ciphertext, key);
	const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
	return decryptedData;
};

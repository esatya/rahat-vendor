const server_url = process.env.REACT_APP_DEFAULT_AGENCY_API;
const base_url = server_url + '/api/v1';

module.exports = {
	REGISTER: base_url + '/vendors/register',
	NFT: base_url + '/nft',
	VENDORS: base_url + '/vendors',
	SERVER_URL: server_url,
	APP: base_url + '/app',
	BASE_URL: base_url
};

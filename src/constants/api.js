const server_url = process.env.REACT_APP_DEFAULT_AGENCY_API;
const base_url = server_url + '/api/v1';

module.exports = {
	REGISTER: base_url + '/vendors/register',
	NFT: server_url + '/nft'
};

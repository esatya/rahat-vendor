import axios from 'axios';
import * as API_CALLS from '../../src/services';
import 'regenerator-runtime/runtime';
import api from '../../src/constants/api';

jest.mock('axios');

describe('API calls', () => {
	it('Gets Package Details', async () => {
		const tokenId = 1;
		axios.get.mockResolvedValue({
			data: {
				_id: {
					$oid: '6198873d6063fd2e2424fad2'
				},
				is_archived: false,
				name: 'RICE',
				symbol: 'RIC',
				totalSupply: 17,
				metadata: {
					categories: ['foods'],
					fiatValue: '1000',
					description: 'Rice package',
					items: [],
					currency: 'NPR',
					packageImgURI: 'QmRBf9ZJgynFakt19JS5Y2i4qSXjoCCpUtshFqqL9ZoDWA'
				},
				project: {
					$oid: '619886b06063fd2e2424fad1'
				},
				tokenId: 1,
				updated_by: {
					$oid: '5ff99ccbc00c1432b1ecd903'
				},
				created_by: {
					$oid: '5ff99ccbc00c1432b1ecd903'
				},
				metadataURI: 'QmPhqCqwJbDSp8GkPmmhUPA6NCzsYZ4sh2qFEnojd9SFRe',
				created_at: {
					$date: '2021-11-20T05:27:25.311Z'
				},
				updated_at: {
					$date: '2021-11-22T04:44:10.162Z'
				},
				__v: 0
			}
		});

		await API_CALLS.getPackageDetails(tokenId);

		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${api.NFT}/token/${tokenId}`);
	});

	it('Registers to Agency', async () => {
		const payload = {
			name: 'Rasil Baidar',
			phone: '9813704512'
		};
		const data = {
			_id: '1827asd91237',
			name: 'Rasil Baidar',
			gender: 'M'
		};
		axios.post.mockImplementationOnce(() => Promise.resolve(data));

		await API_CALLS.registerToAgency(payload);
		expect(axios.post).toHaveBeenCalled();
		expect(axios.post).toHaveBeenCalledWith(`${api.REGISTER}`, JSON.stringify(payload), {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});
	});
	it('Checks for Approval Correctly', async () => {
		const walletAddress = '981c21250604365793d43080fa303De29D1bcF42';

		axios.get.mockResolvedValue({
			address: 'Address 1',
			agencies: [{ status: 'new' }],
			email: 'joeBiden@gmail.com'
		});

		await API_CALLS.checkApproval(walletAddress);

		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(`${api.SERVER_URL}/vendors/0x${walletAddress}`);
	});
});

import DataService from '../../src/services/db';
import 'fake-indexeddb/auto';
import 'regenerator-runtime/runtime';

describe('Testing Index DB', () => {
	//Data Table
	describe('Tests major function in indx db data table', () => {
		it('Saves and gets data correctly', async () => {
			const name = 'Test Data';
			const data = {
				0: 'abx',
				1: 'qwery'
			};
			await DataService.save(name, data);
			const savedData = await DataService.get(name);

			expect(savedData).toMatchObject(data);
		});
		it('gets init app', async () => {
			const data = {
				network: {
					name: 'rumsan_test',
					url: 'https://testnetwork.esatya.io',
					display: 'Rumsan Test Network',
					default: true
				},
				address: null,
				wallet: null
			};
			const initApp = await DataService.initAppData();
			expect(initApp).toMatchObject({ ...data });
		});
	});

	//Agency Table
	describe('Test major functions in index db agency table', () => {
		it('Saves and gets agency properly', async () => {
			const mockAgency = {
				address: '0xeddA7538FB64f60589605AFeFC90c510d2cAfA18',
				adminAddress: '0x9e38B973887aE2803e1Cc7bdeAe30F423eE3DBe7',
				api: 'https://agency-nft.rahat.io/api/v1',
				email: 'esatya@gmail.com',
				isApproved: true,
				name: 'eSatya',
				network: 'https://testnetwork.esatya.io',
				nftAddress: '0x0Ac5a729E7085416184d5f8f912D9AFE30b10235',
				tokenAddress: '0x04BD44185a2B38448c1d60a9fD7252228cFB4f75'
			};

			await DataService.addAgency(mockAgency);

			const savedAgency = await DataService.getAgency(mockAgency.address);

			expect(savedAgency).toMatchObject(mockAgency);
		});
		it('Updates agency properly', async () => {
			const mockAgency = {
				address: '0xeddA7538FB64f60589605AFeFC90c510d2cAfA18',
				adminAddress: '0x9e38B973887aE2803e1Cc7bdeAe30F423eE3DBe7',
				api: 'https://agency-nft.rahat.io/api/v1',
				email: 'esatya@gmail.com',
				isApproved: true,
				name: 'eSatya',
				network: 'https://testnetwork.esatya.io',
				nftAddress: '0x0Ac5a729E7085416184d5f8f912D9AFE30b10235',
				tokenAddress: '0x04BD44185a2B38448c1d60a9fD7252228cFB4f75'
			};

			const updateField = {
				name: 'updated esatya'
			};

			await DataService.addAgency(mockAgency);

			const savedAgency = await DataService.getAgency(mockAgency.address);

			expect(savedAgency.name).toBe(mockAgency.name);

			await DataService.updateAgency(mockAgency.address, {
				...mockAgency,
				...updateField
			});

			const updatedAgency = await DataService.getAgency(mockAgency.address);
			expect(updatedAgency.name).toBe(updateField.name);
		});

		it('lists agencies properly', async () => {
			const agencyList = await DataService.listAgencies();
			expect(agencyList[0]).toMatchObject({
				address: '0xeddA7538FB64f60589605AFeFC90c510d2cAfA18',
				adminAddress: '0x9e38B973887aE2803e1Cc7bdeAe30F423eE3DBe7',
				api: 'https://agency-nft.rahat.io/api/v1',
				email: 'esatya@gmail.com',
				isApproved: true,
				name: 'updated esatya',
				network: 'https://testnetwork.esatya.io',
				nftAddress: '0x0Ac5a729E7085416184d5f8f912D9AFE30b10235',
				tokenAddress: '0x04BD44185a2B38448c1d60a9fD7252228cFB4f75'
			});
		});
	});

	//Trasnaction

	describe('Tests major functions of index db in transaction table', () => {
		const mockTrxn = {
			hash: '0x4b69fb35f7f337eaef7a98cc4ad265b5f110220e82058b4a7d13c367ce07e0cf',
			type: 'tokenRecieved',
			timestamp: Date.now(),
			amount: 10,
			to: 2222,
			from: '0xa1c9753e7181313585b07bcd88a64a8ebd808ed7',
			status: 'success'
		};
		it('adds and gets trasnaction properly', async () => {
			await DataService.addTx(mockTrxn);
			const savedTxn = await DataService.getTx(mockTrxn.hash);
			expect(savedTxn).toMatchObject(mockTrxn);
		});

		it('lists trasnaction properly', async () => {
			const txnList = await DataService.listTx(mockTrxn.type);
			expect(txnList[0]).toMatchObject(mockTrxn);
		});
	});

	//NFT

	describe('Tests major functions of index db in nft table', () => {
		const mockNft = {
			name: 'RICE',
			symbol: 'RIC',
			amount: 3,
			imageUri: 'QmRBf9ZJgynFakt19JS5Y2i4qSXjoCCpUtshFqqL9ZoDWA',
			tokenId: 1,
			value: 370,
			description: 'Mock description',
			metadataURI: 'QmPhqCqwJbDSp8GkPmmhUPA6NCzsYZ4sh2qFEnojd9SFRe'
		};
		it('adds and gets nft properly', async () => {
			await DataService.addNft(mockNft);
			const savedNft = await DataService.getNft(mockNft.tokenId);
			console.log({ savedNft });
			expect(savedNft).toMatchObject(mockNft);
		});

		it('lists nfts properly', async () => {
			const nftList = await DataService.listNft();

			expect(nftList[0]).toMatchObject(mockNft);
		});
	});
});

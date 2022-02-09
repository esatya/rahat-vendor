import DataService from '../../src/services/db';
import 'fake-indexeddb/auto';
import 'regenerator-runtime/runtime';
import { NETWORKS, getNetworkByName } from '../../src/constants/networks';
describe('Testing Index DB', () => {
	//Data Table
	describe('Tests major function in indx db data table', () => {
		it('gets network by name', async () => {
			const fetchNetwork = getNetworkByName('mainnet');

			expect(fetchNetwork).toMatchObject(NETWORKS.find(network => network.name === 'mainnet'));
		});
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
		it('gets removes data properly', async () => {
			const mockData = {
				name: 'testData',
				data: 'Hello world'
			};
			await DataService.save(mockData.name, mockData.data);

			const saveData = await DataService.get(mockData.name);
			expect(saveData).toBe(mockData.data);

			await DataService.remove(mockData.name);

			const removedData = await DataService.get(mockData.name);

			expect(removedData).toBeNull();
		});

		it('lists data table properly', async () => {
			const mockData = {
				name: 'Test Data',
				data: {
					0: 'abx',
					1: 'qwery'
				}
			};
			const list = await DataService.list();
			expect(list).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: mockData.name
					})
				])
			);
		});
		it('saves profile and gets properly', async () => {
			const mockProfileData = {
				name: 'Test Data',
				email: 'test@gmail.com',
				img: 'QmRBf9ZJgynFakt19JS5Y2i4qSXjoCCpUtshFqqL9ZoDWA'
			};
			await DataService.saveProfile(mockProfileData);
			await DataService.saveProfileImage(mockProfileData.img);

			const profile = await DataService.getProfile();
			expect(profile).toMatchObject(mockProfileData);

			expect(profile.img).toBe(mockProfileData.img);
		});

		it('saves profile image properly', async () => {
			const mockProfileImg = 'QmRBf9ZJgynFakt19JS5Y2i4qSXjoCCpUtshFqqL9ZoDWA';

			await DataService.saveProfileImage(mockProfileImg);

			const profileImg = await DataService.get('profileImage');
			expect(profileImg).toEqual(mockProfileImg);
		});

		it('saves profile id card properly', async () => {
			const mockProfileIdCard = 'QmRBf9ZJgynFakt19JS5Y2i4qSXjoCCpUtshFqqL9ZoDWA';

			await DataService.saveProfileIdCard(mockProfileIdCard);

			const profileIdCard = await DataService.get('profileIdCard');
			expect(profileIdCard).toEqual(mockProfileIdCard);
		});

		it('saves and gets network properly', async () => {
			// await DataService.clearAll();
			const network = NETWORKS.filter(netwrk => netwrk.name === 'rumsan');
			await DataService.saveNetwork(network);

			const savedNetwork = await DataService.getNetwork();
			expect(savedNetwork).toMatchObject(network);
		});

		it('gets ipfsUrl and ipfsDownloadUrl properyl', async () => {
			const mockUrl = process.env.REACT_APP_DEFAULT_IPFS;
			const mockDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
			const savedIpfsUrl = await DataService.getIpfs();
			expect(savedIpfsUrl).toMatchObject({ ipfsUrl: mockUrl, ipfsDownloadUrl: mockDownloadUrl });
		});

		it('saves and gets ipfsUrl properly', async () => {
			const mockUrl = process.env.REACT_APP_DEFAULT_IPFS;
			const mockDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
			await DataService.saveIpfsUrl(mockUrl);

			const saveUrl = await DataService.getIpfs();
			expect(saveUrl).toMatchObject({ ipfsUrl: mockUrl, ipfsDownloadUrl: mockDownloadUrl });
		});

		it('saves and gets ipfsDownloadUrl properly', async () => {
			const mockDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
			await DataService.saveIpfsDownloadUrl(mockDownloadUrl);
			const savedUrl = await DataService.get('ipfsUrlDownload');
			expect(savedUrl).toEqual(mockDownloadUrl);
		});

		it('saves and gets address properly', async () => {
			const mockAddress = 'banepa123';
			await DataService.saveAddress(mockAddress);

			const savedAddress = await DataService.getAddress();
			expect(savedAddress).toEqual(mockAddress);

			const locallySavedAddress = DataService.getAddressFromLocal();
			expect(locallySavedAddress).toEqual(mockAddress);
		});

		it('saves wallet properly', async () => {
			const mockWallet = {
				address: '0xeddA7538FB64f60589605AFeFC90c510d2cAfA18',
				network: 'https://testnetwork.esatya.io'
			};

			await DataService.saveWallet(mockWallet);

			const savedWallet = await DataService.getWallet();
			expect(savedWallet).toMatchObject(mockWallet);
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

			const defaultAgency = await DataService.getDefaultAgency();
			expect(defaultAgency).toMatchObject(mockAgency);
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
		const secondNft = {
			name: 'RICE',
			symbol: 'RIC',
			imageUri: 'QmRBf9ZJgynFakt19JS5Y2i4qSXjoCCpUtshFqqL9ZoDWA',
			tokenId: 1,
			value: 370,
			description: 'Mock description',
			metadataURI: 'QmPhqCqwJbDSp8GkPmmhUPA6NCzsYZ4sh2qFEnojd9SFRe'
		};
		it('adds and gets nft properly', async () => {
			await DataService.addNft(mockNft);
			const savedNft = await DataService.getNft(mockNft.tokenId);
			expect(savedNft).toMatchObject(mockNft);
			await DataService.addNft(secondNft);
			const savedSecondNft = await DataService.getNft(mockNft.tokenId);

			expect(savedSecondNft).toMatchObject({ ...savedNft, amount: savedNft.amount + 1 });
		});

		it('lists nfts properly', async () => {
			await DataService.clearAll();

			await DataService.addNft(mockNft);
			const nftList = await DataService.listNft();

			expect(nftList[0]).toMatchObject(mockNft);
		});
	});

	//Assets

	describe('Tests major functions of index db in assests table', () => {
		const mockAsset = {
			address: 'default',
			balance: 0,
			decimal: 18,
			name: 'Ether',
			symbol: 'ETH'
		};
		const secondaryAsset = {
			address: 'secondary',
			balance: 0,
			decimal: 18,
			name: 'Rasil',
			symbol: 'RAS'
		};
		const assetWithNetwork = {
			address: 'third',
			balance: 0,
			decimal: 18,
			name: 'Rasilo',
			symbol: 'RASO',
			network: NETWORKS[0]
		};

		it('adds and gets default assets properly', async () => {
			await DataService.clearAll();
			await DataService.saveAsset(mockAsset);
			const defaultSavedAsset = await DataService.getAsset('default');
			expect(defaultSavedAsset).toMatchObject(mockAsset);
		});

		it('gets assests by symbol and network', async () => {
			await DataService.saveAsset(assetWithNetwork);
			const savedAsset = await DataService.getAssetBySymbol(
				assetWithNetwork.symbol,
				assetWithNetwork.network.name
			);
			expect(savedAsset).toMatchObject(assetWithNetwork);
		});

		it(' gets assets by symbol properly', async () => {
			const savedAsset = await DataService.getAssetBySymbol(mockAsset.symbol);

			expect(savedAsset).toMatchObject(mockAsset);

			await DataService.saveAsset(assetWithNetwork);
			const savedAssetWithNetwork = await DataService.getAssetBySymbol(assetWithNetwork.symbol, NETWORKS[0].name);

			expect(savedAssetWithNetwork).toMatchObject(assetWithNetwork);
		});

		it(' saves multiple assets  properly and lists all of them properly', async () => {
			await DataService.clearAll();
			await DataService.addMultiAssets([mockAsset, secondaryAsset, assetWithNetwork]);
			const assetsList = await DataService.listAssets();
			expect(assetsList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: mockAsset.name
					})
				])
			);
			expect(assetsList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: secondaryAsset.name
					})
				])
			);
			const assetsListWIthNetwork = await DataService.listAssets(NETWORKS[0].name);
			expect(assetsListWIthNetwork).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: assetWithNetwork.name
					})
				])
			);
		});

		it(' saves multiple assets  properly and lists all of them properly (passing single object)', async () => {
			await DataService.clearAll();
			await DataService.addMultiAssets(mockAsset);
			const assetsList = await DataService.listAssets();
			expect(assetsList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: mockAsset.name
					})
				])
			);
		});

		it('updates assets properly', async () => {
			const update = { name: 'updatedAsset' };
			await DataService.updateAsset(mockAsset.address, {
				...mockAsset,
				name: update.name
			});

			const updatedAsset = await DataService.getAsset(mockAsset.address);
			expect(updatedAsset).toMatchObject({ ...mockAsset, name: update.name });
		});

		it(' adds default asset (when no default asset present)', async () => {
			await DataService.clearAll();
			await DataService.addDefaultAsset(mockAsset.symbol, mockAsset.name);
			const defAsset = await DataService.getAsset('default');
			expect(defAsset).toMatchObject(mockAsset);
		});
		it(' adds default asset (when default asset is present)', async () => {
			await DataService.clearAll();
			await DataService.saveAsset(mockAsset);

			await DataService.addDefaultAsset(secondaryAsset.symbol, secondaryAsset.name);
			const defAsset = await DataService.getAsset('default');
			expect(defAsset).toMatchObject({ ...secondaryAsset, address: 'default' });
		});
	});

	//Document

	describe('Tests major functions of index db in document table', () => {
		const mockDocument = {
			hash: 'hash1',
			type: 'type',
			name: 'name',
			file: 'file',
			encryptedFile: 'encryptedFile',
			createdAt: 'createdAt',
			inIpfs: 'inIpfs'
		};
		const secondMockDocument = {
			hash: 'hash2',
			type: 'type',
			name: 'name',
			file: 'file',
			encryptedFile: 'encryptedFile',
			createdAt: 'createdAt',
			inIpfs: 'inIpfs'
		};

		it('saves and gets document properly', async () => {
			await DataService.saveDocuments(mockDocument);

			let document = await DataService.getDocument(mockDocument.hash);

			expect(document).toMatchObject(mockDocument);
			let documentList;

			documentList = await DataService.listDocuments();
			expect(documentList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						hash: mockDocument.hash
					})
				])
			);

			await DataService.clearAll();

			await DataService.saveDocuments([mockDocument, secondMockDocument]);
			documentList = await DataService.listDocuments();
			expect(documentList.length).toBeGreaterThan(1);
			expect(documentList).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						hash: secondMockDocument.hash
					})
				])
			);
		});

		it('updates document properly', async () => {
			const update = {
				name: 'Edited name'
			};
			await DataService.updateDocument(secondMockDocument.hash, { ...secondMockDocument, ...update });

			const updatedDoc = await DataService.getDocument(secondMockDocument.hash);
			expect(updatedDoc.name).not.toEqual(secondMockDocument.name);
		});
	});
});

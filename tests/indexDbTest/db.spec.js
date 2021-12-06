import DataService from '../../src/services/db';
import 'fake-indexeddb/auto';
import 'regenerator-runtime/runtime';

describe('Testing Index DB', () => {
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

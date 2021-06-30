const fileFields = 'id,version,name,appProperties';

class GFolder {
	constructor(gapi) {
		this.gapi = gapi;
	}
	/**
	 * Create a folder on Google Drive. Can reject
	 *
	 * @method renameFile
	 * @param {String} driveId Google Drive file identifier
	 * @param {String} newName New name that will be displayed in drive
	 * @return {Promise|Object} A promise of the result that returns
	 * a file description: {driveId, driveVersion, name, ifid}
	 */
	create(name, options) {
		options = options || {};
		const metadata = {
			name,
			mimeType: 'application/vnd.google-apps.folder',
			appProperties: { ifid: options.ifid }
		};
		return new Promise((resolve, reject) => {
			this.gapi.client.drive.files
				.create({
					resource: metadata,
					fields: fileFields
				})
				.then(response => resolve(response.result), reject);
		});
	}

	getByName(name) {
		return new Promise((resolve, reject) => {
			this.gapi.client.drive.files
				.list({
					pageSize: 1,
					q: `name='${name}' and trashed = false and mimeType = 'application/vnd.google-apps.folder'`
				})
				.then(response =>
					resolve({
						files: response.result.files,
						incompleteSearch: response.result.incompleteSearch,
						firstFile: response.result.files.length > 0 ? response.result.files[0] : null,
						exists: response.result.files.length > 0
					})
				);
		});
	}

	async ensureExists(name, options) {
		let { firstFile } = await this.getByName(name);
		if (firstFile) return { id: firstFile.id, name: firstFile.name };
		return this.create(name, options);
	}
}

export default GFolder;

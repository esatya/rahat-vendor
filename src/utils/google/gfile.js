const driveUploadPath = 'https://www.googleapis.com/upload/drive/v3/files';
const fileFields = 'id,version,name,appProperties';

export default class GFile {
	constructor(gapi) {
		this.gapi = gapi;
	}

	/**
	 * Get all stories available on the Google Drive. Never rejects
	 *
	 * @method listFiles
	 * @return {Promise|Array} A promise of the result that
	 * returns an array of file descriptions:
	 * [{driveId, driveVersion, name, ifid}]
	 */
	listFiles(parentId) {
		function formatResult(response) {
			const stories = [];
			for (let i = 0; i < response.files.length; i++) {
				const file = response.files[i];
				stories.push(file);
			}
			return stories;
		}

		let q = 'trashed=false';
		if (parentId) q = `'${parentId}' in parents and trashed=false`;

		return new Promise((resolve, reject) => {
			this.gapi.client.drive.files
				.list({
					pageSize: 300,
					fields: `files(${fileFields})`,
					q
				})
				.execute(response => resolve(formatResult(response)));
		});
	}

	/**
	 * Creates file with name and uploads data. Never rejects
	 *
	 * @method createFile
	 * @param {String} name Name of the new file on Google Drive
	 * @param {String} data Data to put into the file
	 * @param {String} ifid Interactive Fiction Identifier. Internal id
	 * @return {Promise|Object} A promise of the result that returns
	 * a file description: {driveId, driveVersion, name, ifid}
	 */
	createFile({ name, data, parentId, ifid }) {
		// Current version of this.gapi.client.drive is not capable of
		// uploading the file so we'll do it with more generic
		// interface. This will create file with given name and
		// properties in one request with multipart request.

		// Some random string that is unlikely to be in transmitted data:
		const boundary = '-batch-31415926579323846boundatydnfj111';
		const delimiter = `\r\n--${boundary}\r\n`;
		const closeDelim = `\r\n--${boundary}--`;

		const metadata = {
			mimeType: 'Content-Type: text/xml',
			name,
			appProperties: { ifid }
		};
		if (parentId) metadata.parents = [parentId];

		const multipartRequestBody = `${delimiter}Content-Type: application/json\r\n\r\n${JSON.stringify(
			metadata
		)}${delimiter}Content-Type: text/xml\r\n\r\n${data}${closeDelim}`;

		return new Promise((resolve, reject) => {
			this.gapi.client
				.request({
					path: driveUploadPath,
					method: 'POST',
					params: {
						uploadType: 'multipart',
						fields: fileFields
					},
					headers: {
						'Content-Type': `multipart/related; boundary="${boundary}"`
					},
					body: multipartRequestBody
				})
				.then(
					response => resolve(response.result),
					error => resolve({})
				);
		});
	}

	/**
	 * Get the file description. Never rejects
	 *
	 * @method getFileDescription
	 * @param {String} driveId Google Drive file identifier
	 * @return {Promise|Object} A promise of the result that returns
	 * a file description: {driveId, driveVersion, name, ifid}
	 */
	getFileDescription(driveId) {
		return new Promise((resolve, reject) => {
			this.gapi.client.drive.files
				.get({
					fileId: driveId,
					fields: fileFields
				})
				.execute(response => resolve(response));
		});
	}

	/**
	 * Downloads the content of the file. Can reject
	 *
	 * @method downloadFile
	 * @param {String} driveId Google Drive file identifier
	 * @return {Promise|String} A promise of the result that returns
	 * a file data string
	 */
	downloadFile(driveId) {
		return new Promise((resolve, reject) => {
			this.gapi.client.drive.files
				.get({
					fileId: driveId,
					alt: 'media'
				})
				.then(data => resolve(data.body), reject);
		});
	}

	/**
	 * Changes the name of the file on Google Drive. Can reject
	 *
	 * @method renameFile
	 * @param {String} driveId Google Drive file identifier
	 * @param {String} newName New name that will be displayed in drive
	 * @return {Promise|Object} A promise of the result that returns
	 * a file description: {driveId, driveVersion, name, ifid}
	 */
	renameFile(driveId, newName) {
		return new Promise((resolve, reject) => {
			this.gapi.client.drive.files
				.update({
					fileId: driveId,
					name: newName,
					fields: fileFields
				})
				.then(response => resolve(response.result), reject);
		});
	}

	/**
	 * Removes file completely from drive. Can reject
	 *
	 * @method deleteFile
	 * @param {String} driveId Google Drive file identifier
	 * @return {Promise} A promise of the result
	 */
	deleteFile(driveId) {
		return new Promise((resolve, reject) => {
			this.gapi.client.drive.files
				.delete({
					fileId: driveId
				})
				.then(resolve, reject);
		});
	}

	/**
	 * Replaces the file content with newData. Can reject
	 *
	 * @method updateFile
	 * @param {String} driveId Google Drive file identifier
	 * @param {String} newData Data to put into the file
	 * @return {Promise|Object} A promise of the result that returns
	 * a story description: {driveId, driveVersion, name, ifid}
	 */
	updateFile(driveId, newData) {
		return new Promise((resolve, reject) => {
			this.gapi.client
				.request({
					path: `${driveUploadPath}/${driveId}`,
					method: 'PATCH',
					params: { uploadType: 'media', fields: fileFields },
					body: newData
				})
				.then(response => resolve(response.result), reject);
		});
	}

	async getByName(name, parentId) {
		let q = `name='${name}' and trashed = false`;
		if (parentId) q = `name='${name}' and trashed = false and '${parentId}' in parents`;
		return new Promise((resolve, reject) => {
			this.gapi.client.drive.files
				.list({
					pageSize: 1,
					q
				})
				.then(response => {
					resolve({
						files: response.result.files,
						incompleteSearch: response.result.incompleteSearch,
						firstFile: response.result.files.length > 0 ? response.result.files[0] : null,
						exists: response.result.files.length > 0
					});
				});
		});
	}
}

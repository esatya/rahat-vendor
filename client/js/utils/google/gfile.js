'use strict';

const driveUploadPath = 'https://www.googleapis.com/upload/drive/v3/files';

// 'id' is driveId - unique file id on google drive
// 'version' is driveVersion - version of file on google drive
// 'name' name of the file on google drive
// 'appProperties' keep the custom `ifid` field
const fileFields = 'id,version,name,appProperties';

function formatFileDescription(response) {
  response = response || null;
  if (response && !response.error) {
    return {
      driveId: response.id,
      driveVersion: response.version,
      name: response.name,
      ifid: response.appProperties ? response.appProperties.ifid : ''
    };
  }
  else {
    return {
      driveId: '',
      driveVersion: -1,
      name: '',
      ifid: ''
    };
  }
}

export default {
	/**
	 * Get all stories available on the Google Drive. Never rejects
	 *
	 * @method listFiles
	 * @return {Promise|Array} A promise of the result that 
	 * returns an array of file descriptions: 
	 * [{driveId, driveVersion, name, ifid}]
	 */
  listFiles() {
    function formatResult(response) {
      var stories = [];
      for (var i = 0; i < response.files.length; i++) {
        const file = response.files[i];
        stories.push(formatFileDescription(file));
      }
      return stories;
    };

    return new Promise((resolve, reject) => {
      gapi.client.drive.files.list({
        'pageSize': 300,
        'fields': 'files(' + fileFields + ')',
        'q': 'trashed=false'
      }).execute(
        (response) => resolve(formatResult(response))
      );
    });
  },

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
    // Current version of gapi.client.drive is not capable of 
    // uploading the file so we'll do it with more generic
    // interface. This will create file with given name and 
    // properties in one request with multipart request.

    // Some random string that is unlikely to be in transmitted data:
    const boundary = '-batch-31415926579323846boundatydnfj111';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const metadata = {
      'mimeType': 'Content-Type: text/xml',
      'name': name,
      'appProperties': { ifid }
    }
    if (parentId) metadata.parents = [parentId]

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: text/xml\r\n\r\n' +
      data +
      close_delim;

    return new Promise((resolve, reject) => {
      gapi.client.request({
        'path': driveUploadPath,
        'method': 'POST',
        'params': {
          'uploadType': 'multipart',
          'fields': fileFields
        },
        'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody,
      }).then(
        (response) => resolve(formatFileDescription(response.result)),
        (error) => resolve(formatFileDescription())
      );
    });
  },

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
      gapi.client.drive.files.get({
        'fileId': driveId,
        'fields': fileFields,
      }).execute(
        (response) => resolve(formatFileDescription(response))
      );
    });
  },

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
      gapi.client.drive.files.get({
        'fileId': driveId,
        'alt': 'media'
      }).then(
        (data) => resolve(data.body),
        reject
      );
    });
  },

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
      gapi.client.drive.files.update({
        'fileId': driveId,
        'name': newName,
        'fields': fileFields
      }).then(
        (response) => resolve(formatFileDescription(response.result)),
        reject
      );
    });
  },

	/**
	 * Removes file completely from drive. Can reject
	 *
	 * @method deleteFile
	 * @param {String} driveId Google Drive file identifier
	 * @return {Promise} A promise of the result
	 */
  deleteFile(driveId) {
    return new Promise((resolve, reject) => {
      gapi.client.drive.files.delete({
        'fileId': driveId
      }).then(resolve, reject);
    });
  },

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
      gapi.client.request({
        'path': driveUploadPath + '/' + driveId,
        'method': 'PATCH',
        'params': { 'uploadType': 'media', 'fields': fileFields },
        'body': newData
      }).then(
        (response) => resolve(formatFileDescription(response.result)),
        reject
      );
    });
  },

  async getByName(name, parentId) {
    let q = `name='${name}' and trashed = false`;
    if (parentId) q = `name='${name}' and trashed = false and '${parentId}' in parents`;
    return new Promise((resolve, reject) => {
      gapi.client.drive.files.list({
        pageSize: 1, q,
      }).then(
        (response) => resolve({
          files: response.result.files,
          incompleteSearch: response.result.incompleteSearch,
          firstFile: response.result.files.length > 0 ? response.result.files[0] : null,
          exists: response.result.files.length > 0
        })
      )
    });
  },

  // async saveFile(parentId, fileId) {
  //   const accessToken = gapi.auth.getToken().access_token;
  //   const form = new FormData();
  //   let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id'
  //   let method = 'POST'
  //   let metadata = {
  //     name: 'sanduk', // Filename at Google Drive
  //     parents: [parentId], // Folder ID at Google Drive
  //   };

  //   if (fileId) {
  //     url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart&fields=id`,
  //       method = 'PATCH',
  //       metadata = {}
  //   }

  //   const fileContent = GDrive.getBackupData(); // As a sample, upload a text file.
  //   if (!fileContent) return;
  //   const file = new Blob([fileContent], { type: 'text/plain' });
  //   form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  //   form.append('file', file);
  //   const res = await fetch(url, {
  //     method,
  //     headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
  //     body: form,
  //   });
  //   const data = await res.json();
  //   store.set('backup_google_fileId', data.id);
  //   console.log('Uploaded to GDrive');
  // },
};
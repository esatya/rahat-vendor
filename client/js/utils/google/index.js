'use strict';
let clientLoaded = false;
import GFile from './gfile'
import GFolder from './gfolder'
import config from '../../config';


export default {
  /**
   * Loads the client. When ready isLoaded() will return true.
   * Never rejects
   *
   * @method init
   * @return {Promise}
   */
  isLoaded() {
    return clientLoaded;
  },

  /**
   * Loads the client. When ready isLoaded() will return true.
   * Never rejects
   *
   * @method init
   * @return {Promise}
   */
  load() {
    return new Promise(resolve => {
      gapi.load('client', () =>
        gapi.client.load('drive', 'v3', () => {
          clientLoaded = true;
          resolve();
        })
      );
    })
  },

  init(callback) {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: config.services.google.clientId,
        scope: config.services.google.scope,
        ux_mode: config.services.google.ux_mode,
        redirect_uri: config.services.google.redirect_uri
      }).then(() => {
        // gapi.auth2.getAuthInstance().isSignedIn.listen(Google.onSignIn);
        if (callback)
          callback(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    })
  },

  signIn() {
    return gapi.auth2.getAuthInstance().signIn()
  },

  getUser() {
    const auth = gapi.auth2.getAuthInstance();
    return auth.currentUser.get()
  },

  checkGDrivePermission() {
    let user = this.getUser();
    return user.hasGrantedScopes("https://www.googleapis.com/auth/drive")
  },

  requestGDrivePermission() {
    const auth = gapi.auth2.getAuthInstance();
    const option = new gapi.auth2.SigninOptionsBuilder();
    option.setScope('https://www.googleapis.com/auth/drive');
    const googleUser = auth.currentUser.get();
    googleUser.grant(option).then(
      () => {
        Google.checkFolderAndBackupData();
      },
      (fail) => {
        alert(JSON.stringify({ message: 'fail', value: fail }));
      },
    );
  },

  file: GFile,
  folder: GFolder
}
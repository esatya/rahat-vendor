/* global $ gapi */
import Google from './google';

$(document).ready(() => {
  Google.loadAuth();
  $('#btnGoogleLogin').on('click', () => {
    gapi.auth2.getAuthInstance().signIn();
  });
});

/* global $ */
import {
  Modal,
} from 'rumsan-ui';
import store from 'store';

export default class extends Modal {
  constructor(cfg) {
    super(cfg);
    this.registerEvents('passcode-set')

    this.firstCode = null;
    this.select('.passcode').on('keyup', (e) => {
      //this.select('.message').removeClass('text-danger').text('');
      this.select('.modal-footer').hide();
      const passcode = e.currentTarget.value;
      if (passcode.length === 6) {
        if (!this.firstCode) {
          this.firstCode = e.currentTarget.value;
          e.currentTarget.value = '';
          this.select('.message').text('Please enter passcode again.');
        } else if (this.firstCode === e.currentTarget.value) {
          this.onSet(e.currentTarget.value);
        } else {
          this.firstCode = null;
          e.currentTarget.value = '';
          this.select('.message').addClass('text-danger').text('Passcodes do not match. Please try again from the beginning.');
        }
      }
    });
  }

  exists() {
    let appChabi = store.get('appChabi')
    return appChabi != null;
  }

  onSet(passcode) {
    store.set('appChabi', passcode);
    this.firstCode = null;
    this.select('.message').removeClass('text-danger').text('');
    this.select('.passcode').val('')
    this.close();
    this.fire('passcode-set', passcode)
  }
}

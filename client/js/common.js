import store from 'store';
import Wallet from './blockchain/wallet';

export default {
  checkSanduk() {
    if (!store.get('sanduk')) { window.location.replace('/'); }
  },

  showProcessing(msg) {
    if (msg) $('#processing .processing-msg').text(msg);
    $('#processing').show();
  },

  hideProcessing() {
    $('#processing').hide();
    $('#processing .processing-msg').text('processing');
  },

  showUnlockScreen(callback) {
    $('#cmpMain').hide();
    $('#cmpAction').hide();
    $('#cmpUnlock').show();
    $('.footer-locked').hide();
    $('.footer-unlocked').hide();
    $('#unlockCode').focus();
    $('#unlockCode').off('keyup');
    $('#unlockCode').on('keyup', (e) => {
      $('#cmpUnlock .message').text('');
      const password = e.currentTarget.value;
      if (password.length === 6) {
        $('#cmpUnlock .message').removeClass('text-danger');
        $('#cmpUnlock .message').addClass('text-success');
        $('#cmpUnlock .message').text('Unlocking wallet. Please wait...');
        setTimeout(async () => {
          const wallet = await Wallet.load(password);
          if (wallet) {
            store.set('appChabi', password);
            $('#cmpMain').show();
            $('#cmpUnlock').hide();
            $('.footer-unlocked').show();
            if (callback) callback(wallet);
          } else {
            store.remove('appChabi');
            $(e.currentTarget).val('');
            $('#cmpUnlock .message').addClass('text-danger');
            $('#cmpUnlock .message').removeClass('text-success');
            $('#cmpUnlock .message').text('Invalid passcode. Please try again.');
          }
        }, 250);
      }
    });
  },

  lockApp(showUnlock = true) {
    store.remove('appChabi');
    if (showUnlock) {
      return this.showUnlockScreen();
    }

    $('.footer-unlocked').hide();
    $('.footer-locked').show();
    return null;
  },

  checkLocked(callback, showUnlock = true) {
    $('#btnUnlock').on('click', () => {
      this.showUnlockScreen();
    });

    const password = store.get('appChabi');
    if (password) {
      $('.footer-unlocked').show();
      $('.footer-locked').hide();
      $('#btnUnlock').show();
      if (callback) callback();
      return null;
    }

    if (showUnlock) {
      return this.showUnlockScreen(callback);
    }

    $('.footer-unlocked').hide();
    $('.footer-locked').show();
    return null;
  },

};

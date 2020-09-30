/* global $ gapi */
import store from 'store';
import { ethers } from 'ethers';
//import Google1 from '../utils/google1';
import Google from '../utils/google'
import Wallet from '../blockchain/wallet'


$(document).ready(() => {
  if (!store.get('appChabi')) location.replace('/')


  const createWallet = async () => {
    $('.progress-bar').css('width', '0%')
    $('.message').text('Logging into Google Drive.')
    await Google.load();
    let folder = await Google.folder.ensureExists('eSatyaWalletBackup')
    $('.progress-bar').css('width', '25%')
    $('.message').text('Checking if previous backup exists...')
    let file = await Google.file.getByName('sanduk', folder.id)
    $('.progress-bar').css('width', '50%')
    if (file.exists) {
      $('.message').text('Previous backup found. Downloading Wallet...')
      let encryptedWallet = await Google.file.downloadFile(file.firstFile.id)
      $('.message').text('Wallet downloaded. Decrypting wallet...')
      $('.progress-bar').css('width', '75%')
      let wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, store.get('appChabi'))
      store.set('sanduk', encryptedWallet)
      store.set('chabi', wallet.privateKey)
      $('.message').html(`Wallet backed up successfully.<br/>Your address is ${wallet.address}`)
    } else {
      $('.message').text('Previous backup not found. Creating new wallet....')
      let { wallet, encryptedWallet } = await Wallet.create();
      if (!wallet) wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, store.get('appChabi'));
      $('.progress-bar').css('width', '75%')
      $('.message').text('Backing up encrypted wallet to Google Drive')
      let newfile = await Google.file.createFile({ name: 'sanduk', data: encryptedWallet, parentId: folder.id })
      $('.message').html(`Wallet backed up successfully.<br/>Your address is ${wallet.address}`)
    }
    $('.progress-bar').css('width', '100%')
    $('.in-progress').hide();
    $('.btn-home').show();

  }

  $('.btn-home').on('click', async (e) => {

    window.location.href = "/home";
  })

  Google.init((isSignedIn) => {

    if (isSignedIn) {
      if (!Google.checkGDrivePermission()) {
        Google.requestGDrivePermission();
      } else {
        createWallet();
      }
    } else {
      gapi.auth2.getAuthInstance().signIn()
    }
  });
});

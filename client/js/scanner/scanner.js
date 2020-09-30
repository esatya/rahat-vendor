/* global $ Instascan */
import { Modal } from 'rumsan-ui';

import EtherQR from 'ethereum-qr-code';
import common from '../common';
import ethers from '../blockchain/ethers';
import Wallet from '../blockchain/wallet';

function isJson(item) {
  item = typeof item !== 'string'
    ? JSON.stringify(item)
    : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === 'object' && item !== null) {
    return true;
  }

  return false;
}

export default class extends Modal {
  constructor(cfg) {
    super(cfg);
    this.result = null;
    this.registerEvents('scan-success');

    this.comp.on('shown.bs.modal', (e) => {
      this.load(this);
    });

    this.on('close', (e) => {
      this.camera.stop();
    });

    $(this.btnOpen).on('click', (e) => {
      this.open();
    });
  }

  async processResult(data) {
    try {
      if (isJson(data)) {
        await this.processAction(JSON.parse(data));
        return;
      }
      if (typeof data === 'string') {
        if (data.substr(0, 5).toLocaleLowerCase() === 'ether') {
          const eqr = new EtherQR();
          data = eqr.readStringToJSON(data);
          this.processTransfer(data);
          return;
        }

        if (ethers.utils.isAddress(data)) {
          this.processTransfer({ to: data });
          return;
        }
      }
      if (this.onScan) this.onScan(data);
      throw new Error(`Error: Try Again [${data}]`);
    } catch (e) {
      alert(e.message);
    } finally {
      common.hideProcessing();
    }
  }

  processTransfer(data) {
    if (this.onScan) return this.onScan(data);
    if (!ethers.utils.isAddress(data.to)) throw Error('Bad address. Please scan again.');
    window.location.replace(`/transfer?to=${data.to}&value=${data.value}`);
    this.fire('scan-success', data);
    return null;
  }

  async processAction(data) {
    if (this.onScan) return this.onScan(data);
    if (data.action === 'sign-transactions') {
      window.location.replace(`/sign/contract?requesturl=${data.callbackUrl}`);
      return null;
    }
    $('#remoteResponse').empty();
    $('#remoteResponse').html('Processing instructions from QRCode. <br> Waiting for response from the remote server...');
    $('.btn-done').hide();
    $('#cmpMain').hide();
    $('#cmpAction').show();

    const body = await this.signData(data);
    const res = await fetch(data.callbackUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const resData = await res.json();
    if (!res.ok) {
      $('#remoteResponse').html(`<p><span class='text-danger'>ERROR:</span> ${resData.message}</p>`);
    } else {
      $('#remoteResponse').html(`<p><span class='text-success'>SUCCESS:</span> ${resData.message}</p>`);
      this.fire('scan-success', data);
    }
    $('.btn-done').show();
    return null;
  }

  async signData(data) {
    const wallet = await Wallet.load();
    const signedData = await wallet.signMessage(data.token);
    return Object.assign(data, { signedData });
  }

  open(callback) {
    this.onScan = callback;
    super.open();
  }

  async load(me) {
    // const vWidth = $('#camera').outerWidth();
    // $('#qrscanner').height(vWidth);

    const scanner = new Instascan.Scanner({ video: document.getElementById('camera'), mirror: false });
    scanner.on('scan', (qrData) => {
      me.close();
      common.showProcessing('Processing QR Code data. Please wait...');
      setTimeout(() => me.processResult(qrData), 250);
    });

    const devices = await Instascan.Camera.getBackCamera();
    this.camera = devices[0];
    scanner.camera = this.camera;
    scanner.start();
  }
}

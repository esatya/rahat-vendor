/* global $ */
import AppSettings from './app';
import common from '../common';

const networks = [
  { name: 'rumsan', url: 'https://rumsannetwork.esatya.io', display: 'Rumsan Network' },
  { name: 'mainnet', url: 'https://mainnet.infura.io/v3/ae22018377b14a61983be979df457b20', display: 'Mainnet (Ethereum)' },
  { name: 'ropsten', url: 'https://ropsten.infura.io/v3/ae22018377b14a61983be979df457b20', display: 'Ropsten' },
  { name: 'kovan', url: 'https://kovan.infura.io/v3/ae22018377b14a61983be979df457b20', display: 'Kovan' },
  { name: 'rinkeby', url: 'https://rinkeby.infura.io/v3/ae22018377b14a61983be979df457b20', display: 'Rinkeby' },
  { name: 'localhost', url: 'http://localhost:7545', display: 'Localhost (Ganache: Port 7545)' },
  { name: 'custom', url: AppSettings.get('network').url, display: 'Custom Network' },
];

const customNetwork = (network) => {
  if (network.name === 'custom') {
    $('#cmpNetworkUrl').show();
    $('#customNetworkUrl').val(network.url);
  } else {
    $('#cmpNetworkUrl').hide();
  }
};

$(document).ready(() => {
  common.checkLocked(null, false);
  $(`#${AppSettings.get('network').name}`).prop('checked', true);
  customNetwork(AppSettings.get('network'));

  $('[name=selNetwork]').on('click', (e) => {
    const network = networks.find((d) => d.name === e.currentTarget.value);
    if (network) AppSettings.set('network', network);
    customNetwork(network);
  });

  $('#customNetworkUrl').on('keyup', (e) => {
    AppSettings.set('network', { name: 'custom', url: e.currentTarget.value, display: 'Custom Network' });
  });
});

/* global $ */
import {
  Form,
} from 'rumsan-ui';
import Service from './service';

const NodeRSA = require('node-rsa');

const hideMessages = () => {
  $('#error').hide();
  $('#info').hide();
};

const getPublicKey = async () => {
  const { key, serverTime } = await Service.getPublicKey();
  const PublicKey = new NodeRSA(
    `-----BEGIN PUBLIC KEY-----
    ${key}
    -----END PUBLIC KEY-----`,
  );
  return { PublicKey, serverTime };
};

export default {
  loginWithUserName() {
    const form = new Form({
      target: '#frmLogin',
      onSubmit: async () => {
        hideMessages();
        const data = form.get();
        try {
          const { PublicKey, serverTime } = await getPublicKey();
          data.serverTime = serverTime;
          const loginData = PublicKey.encrypt(data, 'base64');
          const resData = await Service.login({ loginData });
          window.location.replace(`/passport-control?token=${resData.accessToken}`);
        } catch (e) {
          $('#error').html(e.message).show();
        }
      },
    });
  },
  loginWithMetaMask(web3) {
    $('#btnMetamask').on('click', async () => {
      hideMessages();
      const { PublicKey, serverTime } = await getPublicKey();
      const ethAddress = await web3.eth.getCoinbase();
      const signature = await web3.eth.personal.sign('Rumsan App Authentication', ethAddress);
      const loginData = PublicKey.encrypt({
        loginMethod: 'metamask',
        serverTime,
        signature,
        ethAddress,
      }, 'base64');
      try {
        const resData = await Service.login({ loginData });
        window.location.replace(`/passport-control?token=${resData.accessToken}`);
      } catch (e) {
        $('#error').html(e.message).show();
      }
    });
  },
};

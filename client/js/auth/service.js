import { REST } from 'rumsan-ui';
import config from '../config';

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  async login(body) {
    return rest.post({
      url: '/auth',
      useAccessToken: false,
      body,
    });
  }

  async getData(accessToken) {
    return rest.get({ url: '/auth', accessToken });
  }

  async getPublicKey() {
    return rest.get({ url: '/auth/publickey' });
  }

  forgetPassword(body) {
    return rest.post({
      path: '/users/password_forgot',
      useAccessToken: false,
      body,
    });
  }
}

export default new Service();

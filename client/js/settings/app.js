import store from 'store';

const AppSettings = {
  get: (key) => {
    const app = store.get('settings');
    if (!app) return null;
    return app[key];
  },
  set: (key, value) => {
    const app = store.get('settings') || {};
    app[key] = value;
    store.set('settings', app);
  },
};

const network = AppSettings.get('network') || AppSettings.set('network', { name: 'Rumsan Network', url: 'https://rumsannetwork.esatya.io', display: 'RumSan' });
//const network = { name: 'localhost', url: 'http://localhost:7545', display: 'Localhost (Ganache: Port 7545)' }
AppSettings.network = network;

export default AppSettings;

/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const router = require('express').Router();

const ui = {

};

const pkg = require('./package.json');

router.use(async (req, res, next) => {
  const commonData = {
    app: { version: pkg.version.replace(/\./g, '-') },
  };

  res.renderWithData = async (view, data = {}) => {
    const resData = Object.assign(data, commonData);
    res.render(view, resData);
  };
  next();
});

router.get('/', (req, res) => {
  res.renderWithData('slider', { title: 'Rumsan Sanduk' });
});
router.get('/register', (req, res) => {
  res.renderWithData('register', { title: 'Rumsan Sanduk' });
});
router.get('/home', (req, res) => {
  res.renderWithData('index', { title: 'Rumsan Sanduk' });
});

router.get('/request', (req, res) => {
  const {
    to, address, amount, value,
  } = req.query;
  res.renderWithData('request', { title: 'Transfer - Sanduk', address: address || to, amount: amount || value });
});

router.get('/history', (req, res) => {
  res.renderWithData('history', { title: 'Transfer - Sanduk' });
});
router.get('/transactions', (req, res) => {
  res.renderWithData('transactions', { title: 'Transactions' });
});

router.get('/vault', (req, res) => {
  res.renderWithData('vault', { title: 'Transfer - Sanduk' });
});

router.get('/profile', (req, res) => {
  res.renderWithData('profile', { title: 'Transfer - Sanduk' });
});

router.get('/wip', (req, res) => {
  res.renderWithData('wip', { title: 'Coming Soon - Sanduk' });
});

router.get('/settings/network', (req, res) => {
  res.renderWithData('settings/network', { title: 'Settings' });
});

router.get('/setup/google', (req, res) => {
  res.renderWithData('setup/google', { title: 'Google Auth' });
});

Object.keys(ui).forEach((key) => {
  router.use(`/${key}`, require(ui[key]));
});

module.exports = router;

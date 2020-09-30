import ethers from '../blockchain/ethers';

export default (data) => {
  if (!ethers.utils.isAddress(data.to)) throw Error('Bad address. Please scan again.');
  window.location.replace(`/transfer?to=${data.to}&value=${data.value}`);
};

export default (data) => {
  window.location.replace(`/sign/contract?requesturl=${data.callbackUrl}`);
};

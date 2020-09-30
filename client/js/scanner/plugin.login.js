import Wallet from '../blockchain/wallet';

const signData = async (data) => {
  const wallet = await Wallet.load();
  const signedData = await wallet.signMessage(data.token);
  return Object.assign(data, { signedData });
};

export default async (data) => {
  $('#remoteResponse').empty();
  $('#remoteResponse').html('Processing instructions from QRCode. <br> Waiting for response from the remote server...');
  $('.btn-done').hide();
  $('#cmpMain').hide();
  $('#cmpAction').show();

  const body = await signData(data);
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
  }
  $('.btn-done').show();
};

/* global $ */
import Service from './service';
// import LoginUtil from './login.util';
import getWeb3 from './getWeb3';

const hideMessages = () => {
  $('#msg').hide();
  $('#info').hide();
};

$(document).ready(async () => {
  // LoginUtil.loginWithUserName();
  // const web3 = await getWeb3();
  // LoginUtil.loginWithMetaMask(web3);

  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  localStorage.removeItem('permissions');

  $('#loginForm').submit(async (e) => {
    e.preventDefault();
    hideMessages();

    try {
      const data = await Service.login({
        username: $("input[name='username']").val(),
        password: $("input[name='password']").val(),
      });

      if (data) {
        window.location.replace('/passport-control');
      }
    } catch (err) {
      $('#msg').html(err.message);
      $('#msg').show();
    }
  });

  $('#frmForgotPass').submit(async (e) => {
    e.preventDefault();
    hideMessages();

    try {
      await Service.forgetPassword({
        email: $('#forgot_email').val(),
      });

      $('#info').html('Please check your email for further instructions.');
      $('#info').show();
      $('#forgotPassModal').modal('hide');
    } catch (err) {
      $('#info').html('Please check your email for further instructions.');
      $('#info').show();
      $('#forgotPassModal').modal('hide');
    }
  });
});

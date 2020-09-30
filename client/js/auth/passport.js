/* global $ redirectUrl access_token */
import { Session } from 'rumsan-ui';
import Service from './service';

$(document).ready(async () => {
  const data = await Service.getData(access_token);
  if (!data.access_token) window.location.replace('/login');

  Session.set(data);
  if (redirectUrl) window.location.replace(redirectUrl);
  else window.location.replace('/');
});

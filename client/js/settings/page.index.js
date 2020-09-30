import Profile from './profile';

$(document).ready(() => {
  const profile = new Profile();

  (async () => {
    let data = await profile.vendorInfo()
    $("#greetVendor").text(`Hello ${data.name}`)
    $("#phone").text(`${data.phone}`)
    $("#email").text(`${data.email}`)
  })();


});
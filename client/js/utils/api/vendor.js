import config from '../../config';


async function checkVendor(address) {
  try {
    let res = await fetch(
      `${config.api}/vendor/${address}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    console.log("data", data);
    return data;
  }
  catch (e) {
    console.log("error", e);
    return false;
  }

}

export { checkVendor };
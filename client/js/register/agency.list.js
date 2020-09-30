import config from "../config";

class AgencyList {
  constructor(cfg) {
    this.target = cfg.target;
    this.renderList(cfg.target);
  }

  async agencyList() {
    const res = await fetch(`${config.api}/agency/list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const resData = await res.json();

    return resData;
  }

  async renderList() {
    let { data } = await this.agencyList();

    data.forEach((el) => {
      $(`${this.target}`).append(
        ` <div class="card text-center mt-2 mb-2 ml-5 mr-5 agency">
        <div class="card-body ">
          <img src="images/Fav-icon 1.png" alt="avatar" class="imaged w64 rounded mt-n2">
          <h5 hidden>${el._id}<h5>
          <h4 class="card-title name">${el.name}</h4>
          <div class="text">
          <strong>Token Name:</strong> <em>${el.token.name}</em> 
          </div>
        </div>

      </div>`
      );
    });
  }
}

export default AgencyList;

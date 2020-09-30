import { TablePanel } from "rumsan-ui";
import config from "../config";

class ListTx extends TablePanel {
  constructor(cfg) {
    cfg.tblConfig = { "pageLength": 8, "paging": true, "pagingType": "simple" };
    super(cfg);
    this.registerEvents("get-token");
    this.timestamp = Math.floor(new Date().getTime() / 1000);
    this.render();
  }

  setColumns() {
    return [
      { data: "phone" },
      { data: "amount" },
      // {
      //   data: null,
      //   class: "text-center",
      //   render: (d) => {
      //     if (d.expiryDate > this.timestamp) {
      //       return `&nbsp;&nbsp;
      //     <button onclick="$('${this.target}').trigger('get-token', {phone: '${d.phone}',amount:'${d.amount}'})" type="button" class="btn btn-primary btn-sm">Get Tokens</button>`;
      //     }
      //     return "<span style='color: #ff0000;'>Expired</span>";
      //   },
      // },
    ];
  }
}

export default ListTx;

import { TablePanel } from "rumsan-ui";

class ListTx extends TablePanel {
  constructor(cfg) {
    cfg.tblConfig = {
      "paging": false,
      "info": false,
      "pageLength": 3,


    };
    super(cfg);
    this.registerEvents("get-token");
    this.timestamp = Math.floor(new Date().getTime() / 1000);
    this.render();
  }

  setColumns() {
    return [
      { data: "phone" },
      { data: "amount" },
      {
        data: null,
        class: "text-center",
        render: (d) => {
          if (d.date + 500 > this.timestamp) {
            return `&nbsp;&nbsp;
          <button onclick="$('${this.target}').trigger('get-token', {phone: '${d.phone}',amount:'${d.amount}'})" type="button" class="btn btn-primary btn-sm mt-n2" style="font-size:11px; white-space:nowrap">Get Tokens</button>`;
          }
          return "<span style='color: #ff0000;'>Expired</span>";
        },
      },
    ];
  }
}

export default ListTx;

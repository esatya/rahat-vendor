import { TablePanel } from "rumsan-ui";

class ListTx extends TablePanel {
  constructor(cfg) {
    cfg.tblConfig = {
      paging: false,
      info: false,
      pageLength: 3,
    };
    super(cfg);
    this.registerEvents("get-token");
    this.timestamp = Math.floor(new Date().getTime() / 1000);
    this.render();
  }

  setColumns() {
    return [{ data: "date" }, { data: "phone" }, { data: "amount" }];
  }
}

export default ListTx;

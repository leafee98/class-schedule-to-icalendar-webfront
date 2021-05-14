import React from 'react';
import PubSub from 'pubsub-js';

import apiReq from '../../apilib/apiReq';
import overall from '../../overall';
import stringSlice from '../../utils/stringSlice';

const bootstrap = require('bootstrap');

class SelectPanel extends React.Component {
  constructor(props) {
    super(props);

    this.reqItems = this.reqItems.bind(this);
    this.select = this.select.bind(this);

    // this.props.select == 'config' || 'favorConfig';
    // this.props.onSelect == function(configId_or_configShareId);

    this.state = {
      param: {
        select: "",
        onSelect: "",
      },
      activeId: -1,
      offset: 0,
      items: []
    }
  }

  __subToken = "";

  componentDidMount() {
    let ele = document.getElementById("select-panel-popup");
    this.popup = new bootstrap.Modal(ele, {backdrop: false, keyboard: false});

    this.__subToken = PubSub.subscribe(overall.topics.mainPage.myPlan.selectPopup.show, (topic, param) => {
      this.setState({ param: param });
      this.popup.show();
      this.reqItems();

      console.log(ele);
    })
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.__subToken);
  }

  reqItems(offset = 0) {
    switch (this.state.param.select) {
      case "config":
        apiReq.configGetList(
          { sortBy: "id", offset: offset, count: 30 },
          (j) => {
            if (j.status === "ok") {
              this.setState({ items: j.data.configs });
            } else {
              PubSub.publish(overall.topics.toast, { head: "select panel", body: "failed to get config: " + j.data, fine: false });
            }
          }
        )
        break;

      case "favorConfig":
        apiReq.favorConfigGetList(
          { offset: offset, count: 30 },
          (j) => {
            if (j.status === "ok") {
              this.setState({ items: j.data.configs });
            } else {
              PubSub.publish(overall.topics.toast, { head: "select panel", body: "failed to get favor configs: " + j.data, fine: false })
            }
          }
        )
        break;

      default:
        break;
    }
  }

  select(submit) {
    if (submit) {
      if (this.state.activeId < 0) {
        PubSub.publish(overall.topics.toast, { head: "select panel", body: "please select an item before submit", fine: false });
      } else {
        this.popup.hide();
        this.state.param.onSelect(this.state.activeId);
      }
    } else {
      this.popup.hide();
      this.state.param.onSelect(-1);
    }
  }

  render() {
    let rows = [];

    for (let x of this.state.items) {
      let id = -1;
      switch (this.state.param.select) {
        case "config":
          id = x.id;
          break;
        case "favorConfig":
          id = x.shareId;
          break;
        default:
          break;
      }

      let row = (
        <tr key={id}
          className={this.state.activeId === id ? "table-active" : ""}
          onClick={() => { this.setState((state, props) => { return { activeId: id === state.activeId ? -1 : id } }) }}>
          <td>{id}</td>
          <td>
            {x.type === 1 && "Global"}
            {x.type === 1 || "Lesson"}
          </td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.name}>{stringSlice(x.name, 24)}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.remark}>{stringSlice(x.remark, 24)}</td>
          <td>{x.createTime}</td>
          <td>{x.modifyTime}</td>
        </tr>
      )

      rows.push(row);
    }

    if (rows.length <= 0) {
      rows.push(
        <tr key="-1">
          <td className="text-center" colSpan="6">
            Got no config.
          </td>
        </tr>
      )
    }

    return (
      <div className="modal fade" id="select-panel-popup" data-bs-backdrop="static" data-bs-keyboard="false">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              {this.state.param.select === "config" && "Select From My Config"}
              {this.state.param.select === "favorConfig" && "Select From My Favor Config"}
            </div>
            <div className="modal-body">

              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>
                      {this.state.param.select === "config" && "Config Id"}
                      {this.state.param.select === "favorConfig" && "Share Id"}
                    </th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Remark</th>
                    <th>Create Time</th>
                    <th>Modify Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => this.select(false)}>Close</button>
                <button className="btn btn-primary" onClick={() => this.select(true)}>Ok</button>
              </div>

            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default SelectPanel;

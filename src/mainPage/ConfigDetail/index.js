import React from 'react';
import PubSub from 'pubsub-js';

import apiReq from '../../apilib/apiReq';
import overall from '../../overall';

const bootstrap = require('bootstrap');

class ConfigDetail extends React.Component {
  constructor(props) {
    super(props);

    // this.props.onModify;
    // this.props.onHidden;
    // this.props.configId;
    // this.props.shared;
    // this.props.newConfig;

    this.reqConfigCreate = this.reqConfigCreate.bind(this);
    this.reqConfigModify = this.reqConfigModify.bind(this);
    this.reqConfigGetById = this.reqConfigGetById.bind(this);
    this.reqConfigShareGetList = this.reqConfigShareGetList.bind(this);
    this.reqConfigShareModify = this.reqConfigShareModify.bind(this);
    this.reqConfigShareRevoke = this.reqConfigShareRevoke.bind(this);
    this.reqConfigShareCreate = this.reqConfigShareCreate.bind(this);
    this.hide = this.hide.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.getConfigContent = this.getConfigContent.bind(this);
    this.getShareLinks = this.getShareLinks.bind(this);

    this.tabs = {
      configContent: "configContent",
      shareLinks: "shareLinks"
    };

    this.state = {
      tab: "configContent",
      editShare: {
        id: -1,
        remark: ""
      },
      newShare: {
        exist: false,
        remark: ""
      },
      config: {
        id: -1,
        type: 2, // default is lesson config
        format: 1,
        name: "",
        content: "",
        remark: "",
        createTime: "",
        modifyTime: ""
      },
      shares: []
    }
  }

  componentDidMount() {
    let ele = document.getElementById("config-detail-popup");
    this.popup = new bootstrap.Modal(ele, {backdrop: false, keyboard: false});
    this.popup.show();

    if (this.props.newConfig) {
      return;
    }

    if (this.props.shared) {
      this.reqConfigGetByShare(this.props.configId);
      return;
    }

    this.reqConfigGetById(this.props.configId);
    this.reqConfigShareGetList(this.props.configId);
  }

  reqConfigCreate() {
    apiReq.configCreate(
      {
        name: this.state.config.name,
        type: this.state.config.type,
        format: this.state.config.format,
        content: this.state.config.content,
        remark: this.state.config.remark,
      },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "new config", body: "success to create config", fine: true });
        } else {
          PubSub.publish(overall.topics.toast, { head: "new config", body: "failed to create config:" + j.data, fine: false });
        }
      }
    );
  }

  reqConfigModify() {
    apiReq.configMofidy(
      {
        id: this.state.config.id,
        name: this.state.config.name,
        content: this.state.config.content,
        format: this.state.config.format,
        remark: this.state.config.remark
      },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "success to modify config", fine: true });
        } else {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "failed to modify config: " + j.data, fine: false });
        }
      }
    )
  }

  reqConfigGetByShare(shareId) {
    apiReq.configGetByShare(
      { id: shareId },
      (j) => {
        if (j.status === "ok") {
          this.setState({ config: j.data });
        } else {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "failed to get config detail from share:" + j.data, fine: false });
        }
      }
    )
  }

  reqConfigGetById(configId) {
    apiReq.configGetById(
      { id: configId },
      (j) => {
        if (j.status === "ok") {
          this.setState({ config: j.data });
        } else {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "failed to get config detail:" + j.data, fine: false });
        }
      }
    );
  }

  reqConfigShareGetList(configId) {
    apiReq.configshareGetList(
      { id: configId },
      (j) => {
        if (j.status === "ok") {
          this.setState({ shares: j.data.shares });
        } else {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "failed to get config share links:" + j.data, fine: false });
        }
      }
    )
  }

  reqConfigShareModify() {
    apiReq.configShareModify(
      { id: this.state.editShare.id, remark: this.state.editShare.remark},
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "success to modify config share links.", fine: true });
          this.setState({ editShare: { id: -1, remark: "" } });

          this.reqConfigShareGetList(this.props.configId);
        } else {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "failed to modify config share links:" + j.data, fine: false });
        }
      }
    )
  }

  reqConfigShareRevoke(shareId) {
    apiReq.configShareRevoke(
      { id: shareId },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "success to remove share links.", fine: true });

          this.reqConfigShareGetList(this.props.configId);
        } else {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "failed to remove share links:" + j.data, fine: false });
        }
      }
    );
  }

  reqConfigShareCreate(remark) {
    apiReq.configShareCreate(
      { id: this.props.configId, remark: remark },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "success to create share links.", fine: true });

          this.reqConfigShareGetList(this.props.configId);
        } else {
          PubSub.publish(overall.topics.toast, { head: "config detail", body: "failed to create share links:" + j.data, fine: false });
        }
      }
    );
  }

  hide(save) {
    if (save === true) {
      if (this.props.newConfig) {
        this.reqConfigCreate();
      } else {
        this.reqConfigModify();
      }
      this.popup.hide();
      this.props.onModify();
    } else {
      this.popup.hide();
    }
    this.props.onHidden();
  }

  switchTab(e, tab) {
    e.preventDefault();
    this.setState({ tab: tab });
  }

  getConfigContent() {
    return (
      <div>
        <div className="row mb-2">
          <div className="col-1">
            {this.props.shared && <strong> Share Id: </strong>}
            {this.props.shared || <strong> Id: </strong>}
          </div>
          <div className="col-2"> {this.state.config.id} </div>

          <div className="col-1"> <strong> Type: </strong> </div>
          <div className="col-2"> 
            <select className="form-select" disabled={this.props.shared || !this.props.newConfig}
              value={this.state.config.type}
              onChange={(e) => this.setState((state) => { state.config.type = parseInt(e.target.value); return state })}>
              <option value={1}>Global Config</option>
              <option value={2}>Lesson Config</option>
            </select>
          </div>

          <div className="col-1"> <strong> Create Time: </strong> </div>
          <div className="col-2"> {this.state.config.createTime} </div>

          <div className="col-1"> <strong> Modify Time: </strong> </div>
          <div className="col-2"> {this.state.config.modifyTime} </div>
        </div>
        <div className="row mb-2">
          <div className="col-1"> <strong> Name: </strong> </div>
          <div className="col">
            <textarea className="form-control" rows="1" disabled={this.props.shared}
              value={this.state.config.name}
              onChange={(e) => this.setState((state) => { state.config.name = e.target.value; return state })} />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-1"> <strong> Remark: </strong> </div>
          <div className="col">
            <textarea className="form-control" rows="2" disabled={this.props.shared}
              value={this.state.config.remark}
              onChange={(e) => this.setState((state) => { state.config.remark = e.target.value; return state })} />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-1"> <strong> Content: </strong> </div>
          <div className="col">
            <textarea className="form-control" rows="5" disabled={this.props.shared}
              value={this.state.config.content}
              onChange={(e) => this.setState((state) => { state.config.content = e.target.value; return state })} />
          </div>
        </div>
      </div >
    )
  }

  getShareLinks() {
    let rows = [];
    for (let x of this.state.shares) {
      let tmp = (
        <tr key={x.id} className="text-center align-middle">
          <td>{x.id}</td>

          {x.id === this.state.editShare.id && 
            <td>
              <textarea className="form-control" rows="1" value={this.state.editShare.remark}
                onChange={(e) => { this.setState((state) => { state.editShare.remark = e.target.value; return state; }) }} />
            </td>}
          {x.id === this.state.editShare.id ||
            <td>{x.remark}</td>}

          <td>{x.createTime}</td>

          {x.id === this.state.editShare.id &&
            <td>
              <button className="btn p-1" onClick={this.reqConfigShareModify}>
                <img src="./assets/icons/check2.svg" alt="save"></img>
              </button>
            <button className="btn p-1" onClick={() => this.setState({ editShare: { id: -1, remark: "" } })}>
                <img src="./assets/icons/x.svg" alt="cancel"></img>
              </button>
            </td>
          }
          {x.id === this.state.editShare.id ||
            <td>
              <button className="btn p-1" onClick={() => this.setState({ editShare: { id: x.id, remark: x.remark } })}>
                <img src="./assets/icons/pencil-square.svg" alt="edit"></img>
              </button>
              <button className="btn p-1" onClick={() => this.reqConfigShareRevoke(x.id)}><img src="./assets/icons/trash.svg" alt="remove"></img></button>
            </td>}
        </tr>
      );
      rows.push(tmp);
    }

    if (rows.length === 0) {
      rows.push(
        <tr className="align-middle text-center" key={-1}>
          <td colSpan="4">
            No content now.
          </td>
        </tr>
      )
    }

    let newShare = null;
    if (this.state.newShare.exist)
      newShare = (
        <tr className="text-center align-middle">
          <td><input className="form-control w-100" disabled value="" /></td>
          <td>
            <textarea className="form-control w-100" rows="1" value={this.state.newShare.remark}
              onChange={(e) => { this.setState((state) => { state.newShare.remark = e.target.value; return state; }) }} />
          </td>
          <td><input className="form-control w-100" disabled value="" /></td>

          <td>
            <button className="btn p-1" onClick={() => { this.reqConfigShareCreate(this.state.newShare.remark); this.setState({ newShare: { exist: false, remark: "" } }) }}>
              <img src="./assets/icons/check2.svg" alt="save"></img>
            </button>
            <button className="btn p-1" onClick={() => this.setState({ newShare: { exist: false, remark: "" } })}>
              <img src="./assets/icons/x.svg" alt="cancel"></img>
            </button>
          </td>
        </tr>
      )

    return (
      <div>
        <table className="table">
          <thead>
            <tr className="text-center">
              <th>Share Id</th>
              <th>Remark</th>
              <th>Create Time</th>
              <th>Operating</th>
            </tr>
          </thead>
          <tbody>
            {rows}

            {newShare}
          </tbody>
        </table>

        {this.state.newShare.exist ||
          <div className="d-grid">
            <button className="btn btn-primary" onClick={() => this.setState({ newShare: { exist: true, remark: "" } })}>Add Share</button>
          </div>}
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="modal modal-fade" id="config-detail-popup">
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                {this.props.newConfig && "New Config"}
                {this.props.newConfig || "Config Detail"}
              </div>

              <div className="modal-body">
                <div className="container-fluid">

                  <ul className="nav nav-tabs mb-2">
                    <li className="nav-item">
                      <a className={`nav-link ${this.state.tab === this.tabs.configContent ? "active" : ""}`}
                        href="/#" onClick={(e) => this.switchTab(e, this.tabs.configContent)}>
                        Config
                      </a>
                    </li>
                    {this.props.shared ||
                      <li className="nav-item">
                        <a className={`nav-link ${this.state.tab === this.tabs.shareLinks ? "active" : ""}`}
                          href="/#" onClick={(e) => this.switchTab(e, this.tabs.shareLinks)}>
                          Share Links
                      </a>
                      </li>}
                  </ul>

                  {this.state.tab === this.tabs.configContent && this.getConfigContent()}
                  {this.state.tab === this.tabs.shareLinks && this.getShareLinks()}

                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary"
                  onClick={() => this.hide(false)}>
                  Close
                </button>
                {this.props.shared ||
                  <button className="btn btn-primary"
                    onClick={() => this.hide(true)}>
                    Save
                  </button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ConfigDetail;

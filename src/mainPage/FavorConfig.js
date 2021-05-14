import React from 'react';
import PubSub from 'pubsub-js';

import apiReq from '../apilib/apiReq';
import overall from '../overall';
import stringSlice from '../utils/stringSlice';
import ConfigDetail from './ConfigDetail';

class FavorConfig extends React.Component {
  constructor(props) {
    super(props);

    this.reqFavorConfigAdd = this.reqFavorConfigAdd.bind(this);
    this.reqFavorConfigRemove = this.reqFavorConfigRemove.bind(this);
    this.reqFavorConfigGetList = this.reqFavorConfigGetList.bind(this);
    this.btnAddShare = this.btnAddShare.bind(this);
    
    this.state = {
      detailId: -1,
      directAddShareId: "",
      offset: 0,
      shares: []
    }
  }

  componentDidMount() {
    this.reqFavorConfigGetList();
  }

  reqFavorConfigGetList() {
    apiReq.favorConfigGetList(
      { offset: this.state.offset, count: 30 },
      (j) => {
        if (j.status === "ok") {
          this.setState({ shares: j.data.configs });
        } else {
          PubSub.publish(overall.topics.toast, { head: "favor config", body: "failed to get favor configs: " + j.data, fine: false })
        }
      }
    )
  }

  reqFavorConfigAdd(shareId) {
    apiReq.favorConfigAdd(
      { id: shareId },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "favor config", body: "success to add favor config.", fine: true });
          this.reqFavorConfigGetList();
        } else {
          PubSub.publish(overall.topics.toast, { head: "favor config", body: "failed to add favor config: " + j.data, fine: false });
        }
      }
    )
  }

  reqFavorConfigRemove(shareId) {
    apiReq.favorConfigRemove(
      { id: shareId },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "favor config", body: "success to remove favor config.", fine: true });
          this.reqFavorConfigGetList();
        } else {
          PubSub.publish(overall.topics.toast, { head: "favor config", body: "failed to remove favor config: " + j.data, fine: false });
        }
      }
    )
  }

  btnAddShare() {
    let shareId = parseInt(this.state.directAddShareId);
    if (isNaN(shareId)) {
      PubSub.publish(overall.topics.toast, { head: "favor config", body: this.state.directAddShareId + " is not a valid number.", fine: false });
      return;
    }

    this.reqFavorConfigAdd(shareId);
  }

  render() {
    let rows = [];

    for (let x of this.state.shares) {
      let id = x.shareId;

      let row = (
        <tr key={id} className="align-middle" onClick={() => this.setState({ detailId: id })}>
          <td>{id}</td>
          <td>
            {x.type === 1 && "Global"}
            {x.type === 1 || "Lesson"}
          </td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.name}>{stringSlice(x.name, 24)}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.remark}>{stringSlice(x.remark, 24)}</td>
          <td>{x.createTime}</td>
          <td>{x.modifyTime}</td>
          <td>
            <button className="btn p-1" onClick={(e) => { e.stopPropagation(); this.reqFavorConfigRemove(id); }}>
              <img src="/assets/icons/trash.svg" alt="remove"></img>
            </button>
          </td>
        </tr>
      )

      rows.push(row);
    }

    if (rows.length <= 0) {
      rows.push(
        <tr key="-1" className="align-middle">
          <td className="text-center" colSpan="7">
            Got no config.
          </td>
        </tr>
      )
    }
    return (
      <div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Share Id</th>
              <th>Type</th>
              <th>Name</th>
              <th>Remark</th>
              <th>Create Time</th>
              <th>Modify Time</th>
              <th>Operating</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>

        <div className="d-grid">
          <div className="input-group w-100">
            <button className="btn btn-primary"
              onClick={this.btnAddShare}>
              Direct Add:
                </button>
            <input type="number" className="form-control" placeholder="Share Id"
              value={this.state.directAddShareId}
              onChange={(e) => this.setState({ directAddShareId: e.target.value })} />
          </div>
        </div>

        {this.state.detailId === -1 ||
          <ConfigDetail
            configId={this.state.detailId}
            onModify={this.reqFavorConfigGetList}
            onHidden={() => this.setState({ detailId: -1 })}
            newConfig={false}
            shared={true} />}
      </div>
    )
  }
}

export default FavorConfig;

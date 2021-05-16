import React from 'react';
import PubSub from 'pubsub-js';

import ConfigDetail from './ConfigDetail';

import overall from '../overall';
import apiReq from '../apilib/apiReq';
import stringSlice from '../utils/stringSlice';

class MyConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newConfig: false,
      offset: 0,
      detailId: -1,
      configs: []
    }
  }

  componentDidMount() {
    this.reqConfigGetList(this.state.offset);
  }

  reqConfigGetList(offset) {
    apiReq.configGetList(
      { sortBy: "id", offset: offset, count: 30 },
      (j) => {
        if (j.status === "ok") {
          this.setState({ configs: j.data.configs });
        } else {
          PubSub.publish(overall.topics.toast, { head: "my config", body: "failed to get config: " + j.data, fine: false });
        }
      }
    )
  }

  reqConfigRemove(configId) {
    apiReq.configRemove(
      {id: configId},
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "my config", body: "success to remove config: " + configId, fine: true });
        } else {
          PubSub.publish(overall.topics.toast, { head: "my config", body: "failed to remove config: " + j.data, fine: false });
        }
      }
    );
    this.reqConfigGetList();
  }

  render() {
    let rows = [];

    for (let x of this.state.configs) {
      let id = x.id;

      let row = (
        <tr key={id} className="align-middle"
          onClick={() => this.setState({detailId: id})}>
          <td>{id}</td>
          <td>
            {x.type === 1 && "Global Config"}
            {x.type === 1 || "Lesson Config"}
          </td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.name}>{stringSlice(x.name, 24)}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.remark}>{stringSlice(x.remark, 24)}</td>
          <td>{x.createTime}</td>
          <td>{x.modifyTime}</td>
          <td>
            <button className="btn p-1" onClick={(e) => { e.stopPropagation(); this.reqConfigRemove(x.id); }}>
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
            <tr className="align-middle">
              <th>
                Config Id
              </th>
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
          <button className="btn btn-primary"
            onClick={() => this.setState({ newConfig: true })}>
            Add Config
              </button>
        </div>

        {this.state.detailId === -1 ||
          <ConfigDetail configId={this.state.detailId}
            onModify={() => this.reqConfigGetList(this.state.offset)}
            onHidden={() => this.setState({detailId: -1})}
            newConfig={false} />}
        {this.state.newConfig &&
          <ConfigDetail
            onModify={() => this.reqConfigGetList(this.state.offset)}
            onHidden={() => this.setState({newConfig: false})}
            newConfig={true} />}
      </div>
    )
  }
}

export default MyConfig;

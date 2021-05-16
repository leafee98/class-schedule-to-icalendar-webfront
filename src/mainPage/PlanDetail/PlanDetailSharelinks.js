import React from 'react';
import PubSub from 'pubsub-js';

import apiReq from '../../apilib/apiReq';
import overall from '../../overall';

class PlanDetailSharelinks extends React.Component {
  constructor(props) {
    super(props);

    // this.props.planId;

    this.reqPlanShareGetList = this.reqPlanShareGetList.bind(this);
    this.reqPlanShareModify = this.reqPlanShareModify.bind(this);
    this.reqPlanShareRevoke = this.reqPlanShareRevoke.bind(this);
    this.reqPlanShareCreate = this.reqPlanShareCreate.bind(this);

    this.state = {
      newShare: {
        exist: false,
        remark: ""
      },
      editShare: {
        id: -1,
        remark: ""
      },
      shares: []
    };
  }

  componentDidMount() {
    this.reqPlanShareGetList();
  }

  reqPlanShareGetList() {
    apiReq.planShareGetList(
      { id: this.props.planId },
      (j) => {
        if (j.status === "ok") {
          this.setState({ shares: j.data.shares });
        } else {
          PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "failed to get config share links:" + j.data, fine: false });
        }
      }
    )
  }

  reqPlanShareModify() {
    apiReq.planShareModify(
      { id: this.state.editShare.id, remark: this.state.editShare.remark},
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "success to modify plan share links.", fine: true });
          this.setState({ editShare: { id: -1, remark: "" } });

          this.reqPlanShareGetList(this.props.planId);
        } else {
          PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "failed to modify plan share links:" + j.data, fine: false });
        }
      }
    );
  }

  reqPlanShareRevoke(shareId) {
    apiReq.planShareRevoke(
      { id: shareId },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "success to remove share links.", fine: true });

          this.reqPlanShareGetList(this.props.planId);
        } else {
          PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "failed to remove share links:" + j.data, fine: false });
        }
      }
    );
  }

  reqPlanShareCreate(remark) {
    apiReq.planShareCreate(
      { id: this.props.planId, remark: remark },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "success to create share links.", fine: true });

          this.reqPlanShareGetList(this.props.planId);
        } else {
          PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "failed to create share links:" + j.data, fine: false });
        }
      }
    );
  }

  render() {
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
              <button className="btn p-1" onClick={this.reqPlanShareModify}>
                <img src="/assets/icons/check2.svg" alt="save"></img>
              </button>
            <button className="btn p-1" onClick={() => this.setState({ editShare: { id: -1, remark: "" } })}>
                <img src="/assets/icons/x.svg" alt="cancel"></img>
              </button>
            </td>
          }
          {x.id === this.state.editShare.id ||
            <td>
              <button className="btn p-1" onClick={() => this.setState({ editShare: { id: x.id, remark: x.remark } })}>
                <img src="/assets/icons/pencil-square.svg" alt="edit"></img>
              </button>
              <button className="btn p-1" onClick={() => this.reqPlanShareRevoke(x.id)}><img src="/assets/icons/trash.svg" alt="remove"></img></button>
            </td>}
        </tr>
      );
      rows.push(tmp);
    }

    if (rows.length === 0) {
      rows.push(
        <tr className="align-middle text-center align-middle" key={-1}>
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
            <button className="btn p-1" onClick={() => { this.reqPlanShareCreate(this.state.newShare.remark); this.setState({ newShare: { exist: false, remark: "" } }) }}>
              <img src="/assets/icons/check2.svg" alt="save"></img>
            </button>
            <button className="btn p-1" onClick={() => this.setState({ newShare: { exist: false, remark: "" } })}>
              <img src="/assets/icons/x.svg" alt="cancel"></img>
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
}

export default PlanDetailSharelinks;

import React from 'react';
import PubSub from 'pubsub-js';

import apiReq from '../../apilib/apiReq';
import overall from '../../overall';
import stringSlice from '../../utils/stringSlice';

class PlanDetailSharedConfig extends React.Component {
  constructor(props) {
    super(props);

    this.reqPlanAddShare = this.reqPlanAddShare.bind(this);
    this.reqPlanRemoveShare = this.reqPlanRemoveShare.bind(this);
    this.btnAddShare = this.btnAddShare.bind(this);
    this.btnDirectAddShare = this.btnDirectAddShare.bind(this);

    // this.props.planId;
    // this.props.shares;
    // this.props.shared;
    // this.props.onModify;
    this.state = {
      directAddShareId: ""
    }
  }

  reqPlanRemoveShare(shareId) {
    apiReq.planRemoveShare(
      { planId: this.props.planId, configShareId: shareId },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "success to remove share", fine: true });
          this.props.onModify();
        } else {
          PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "failed to remove share: " + j.data, fine: false });
        }
      }
    )
  }

  reqPlanAddShare(shareId, showPopup=true) {
    if (showPopup)
      PubSub.publishSync(overall.topics.mainPage.myPlan.planDetail.popupShow);

    if (shareId >= 0) {
      apiReq.planAddShare(
        { planId: this.props.planId, configShareId: shareId },
        (j) => {
          if (j.status === "ok") {
            PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "success to add share", fine: true });
            this.props.onModify();
          } else {
            PubSub.publish(overall.topics.toast, { head: "plan detail share", body: "failed to add share: " + j.data, fine: false });
          }
        }
      )
    }
  }

  btnAddShare() {
    PubSub.publishSync(overall.topics.mainPage.myPlan.planDetail.popupHide);
    PubSub.publish(overall.topics.mainPage.myPlan.selectPopup.show, { select: "favorConfig", onSelect: this.reqPlanAddShare })
  }

  btnDirectAddShare() {
    let shareId = parseInt(this.state.directAddShareId);
    if (isNaN(shareId)) {
      PubSub.publish(overall.topics.toast, { head: "plan detail share", body: this.state.directAddShareId + " is not a valid number.", fine: false });
      return;
    }

    this.reqPlanAddShare(shareId, false);
  }

  render() {
    let shares = [];
    for (let x of this.props.shares) {
      let tmp = 
        <tr key={x.id} className="align-middle">
          <td>{x.id}</td>
          <td>{x.type === 1 && "global"}{x.type === 1 || "lesson"}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.name}>{stringSlice(x.name, 24)}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.content}>{stringSlice(x.content, 24)}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.remark}>{stringSlice(x.remark, 24)}</td>
          <td>{x.createTime}</td>
          <td>{x.modifyTime}</td>
          <td>
            <button className="btn p-1" onClick={() => this.reqPlanRemoveShare(x.id)} disabled={this.props.shared}>
              <img src="/assets/icons/trash.svg" alt="remove"></img>
            </button>
          </td>
        </tr>
      shares.push(tmp);
    }

    if (shares.length === 0) {
      shares.push(
        <tr key="-1" className="align-middle">
          <td className="text-center" colSpan="8">
            There's no content now.
          </td>
        </tr>
      )
    }

    return (
      <div>
        <table className="table">
          <thead>
            <tr className="align-middle">
              <th>Share Id</th>
              <th>Type</th>
              <th>Name</th>
              <th>Content</th>
              <th>Remark</th>
              <th>CreateTime</th>
              <th>ModifyTime</th>
              <th>Operating</th>
            </tr>
          </thead>
          <tbody>

            {shares}

          </tbody>
        </table>
        <div className="container-fluid">
          <div className="row justify-content-evenly">
            <div className="col-4">
              <button className="btn btn-primary w-100" disabled={this.props.shared}
                onClick={this.btnAddShare}>
                Add Shared Config From Favor
              </button>
            </div>
            <div className="col-4">
              <div className="input-group w-100">
                <button className="btn btn-primary" disabled={this.props.shared}
                  onClick={this.btnDirectAddShare}>
                  Direct Add:
                </button>
                <input type="number" className="form-control" placeholder="Share Id" 
                  disabled={this.props.shared}
                  value={this.state.directAddShareId}
                  onChange={(e) => this.setState({ directAddShareId: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PlanDetailSharedConfig;

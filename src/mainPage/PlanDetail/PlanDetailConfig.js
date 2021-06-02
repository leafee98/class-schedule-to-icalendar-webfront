import React from 'react';
import PubSub from 'pubsub-js';

import apiReq from '../../apilib/apiReq';
import overall from '../../overall';
import stringSlice from '../../utils/stringSlice';

class PlanDetailConfig extends React.Component {
  constructor(props) {
    super(props);

    // this.props.planId;
    // this.props.configs;
    // this.props.shared
    // this.props.onModify;

    this.reqAddConfig = this.reqAddConfig.bind(this);
    this.reqPlanRemoveConfig = this.reqPlanRemoveConfig.bind(this);
    this.btnAddConfig = this.btnAddConfig.bind(this);
    this.planAddConfig = this.planAddConfig.bind(this);
  }

  componentDidMount() {
    // let eles = document.querySelectorAll(".to-show-tooltip");
    // for (let x of eles) {
    //   new bootstrap.Tooltip(x);
    // }
  }

  reqAddConfig(configId) {
    apiReq.planAddConfig(
      { planId: this.props.planId, configId: configId },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, {head: "plan detail", body: "success to add config to plan", fine: true});
        } else {
          PubSub.publish(overall.topics.toast, {head: "plan detail", body: "failed to add config: " + j.data, fine: false});
        }

        this.props.onModify();
      }
    )
  }

  reqPlanRemoveConfig(planId, configId) {
    apiReq.planRemoveConfig(
      { planId: planId, configId: configId },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "plan detail", body: "removed config: " + configId, fine: true });
        } else {
          PubSub.publish(overall.topics.toast, { head: "plan detail", body: "failed to remove config: " + j.data, fine: false });
        }

        this.props.onModify();
      }
    );
  }

  btnAddConfig() {
    PubSub.publishSync(overall.topics.mainPage.myPlan.planDetail.popupHide);
    PubSub.publish(overall.topics.mainPage.myPlan.selectPopup.show, { select: "config", onSelect: this.planAddConfig });
  }

  planAddConfig(configId) {
    PubSub.publish(overall.topics.mainPage.myPlan.planDetail.popupShow);
    if (configId >= 0) {
      this.reqAddConfig(configId);
    }
  }

  render() {
    let configs = [];
    for (let x of this.props.configs) {
      let tmp = 
        <tr key={x.id} className="align-middle">
          <td>{x.id}</td>
          <td>{x.type === 1 ? "global" : "lesson"}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.name}>{stringSlice(x.name, 24)}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.content}>{stringSlice(x.content, 24)}</td>
          <td data-bs-toggle="tooltip" data-bs-placement="top" title={x.remark}>{stringSlice(x.remark, 24)}</td>
          <td>{x.createTime}</td>
          <td>{x.modifyTime}</td>
          <td>
            <button className="btn p-1" onClick={() => this.reqPlanRemoveConfig(this.props.planId, x.id)} disabled={this.props.shared}>
              <img src="./assets/icons/trash.svg" alt="remove"></img>
            </button>
          </td>
        </tr>
      configs.push(tmp);
    }

    if (configs.length === 0) {
      configs.push(
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
              <th>id</th>
              <th>type</th>
              <th>name</th>
              <th>content</th>
              <th>remark</th>
              <th>createTime</th>
              <th>modifyTime</th>
              <th>operating</th>
            </tr>
          </thead>
          <tbody>

            {configs}

          </tbody>
        </table>
        <div className="d-grid">
          <button className="btn btn-primary" disabled={this.props.shared}
            onClick={this.btnAddConfig}>
            Add Config
          </button>
        </div>
      </div>
    )
  }
}

export default PlanDetailConfig;

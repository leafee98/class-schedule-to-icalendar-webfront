import React from 'react';
import PubSub from 'pubsub-js';

import PlanDetailConfig from './PlanDetailConfig';
import PlanDetailTokens from './PlanDetailTokens';

import apiReq from '../../apilib/apiReq';
import overall from '../../overall';
import PlanDetailSharedConfig from './PlanDetailSharedConfig';
import PlanDetailSharelinks from './PlanDetailSharelinks';

const bootstrap = require('bootstrap');

class PlanDetailPopup extends React.Component {
  constructor(props) {
    super(props);

    // this.props.shared;
    // this.props.planId;

    this.reqPlanGetDetail = this.reqPlanGetDetail.bind(this);
    this.tabs = {
      configs: "configs",
      shares: "sharedConfigs",
      generatedToken: "generatedToken",
      shareLinks: "shareLinks"
    }

    this.state = {
      tab: this.tabs.configs,
      plan: {
        name: "",
        remark: "",
        id: -1,
        createTime: "",
        modifyTime: "",
        configs: [],
        shares: [] // share id replace config id
      }
    }
  }

  __subPopupShow = "";
  __subPopupHide = "";

  componentDidMount() {
    let ele = document.getElementById("plan-detail-popup");

    // ele.addEventListener("hidden.bs.modal", this.props.onClose);

    this.popup = new bootstrap.Modal(ele, { backdrop: false, keyboard: false });
    this.popup.show();

    this.reqPlanGetDetail();

    this.__subPopupShow = PubSub.subscribe(overall.topics.mainPage.myPlan.planDetail.popupShow, () => this.popup.show());
    this.__subPopupHide = PubSub.subscribe(overall.topics.mainPage.myPlan.planDetail.popupHide, () => this.popup.hide());
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.__subPopupShow);
    PubSub.unsubscribe(this.__subPopupHide);
  }

  reqPlanGetDetail() {
    const handleReq = (j) => {
      if (j.status === "ok") {
        this.setState({ plan: j.data });
      } else {
        PubSub.publish(overall.topics.toast, { head: "plan detail", body: "failed to get plan detail: " + j.data, fine: false });
      }
    }

    if (this.props.shared) {
      apiReq.planGetByShare(
        { id: this.props.planId },
        handleReq
      )
    } else {
      apiReq.planGetById(
        { id: this.props.planId },
        handleReq
      )
    }
  }

  copyGenearteURLFromShare(shareId) {
    // this only work in HTTPS
    const url = window.location.protocol + "//" + window.location.host + overall.apiPath + "/generate-by-plan-share?shareId=" + shareId;
    if (navigator.clipboard !== undefined) {
      navigator.clipboard.writeText(url).then(
        () => { PubSub.publish(overall.topics.toast, { head: "plan detail", body: "success to copy generate url", fine: true }); },
        (e) => { PubSub.publish(overall.topics.toast, { head: "plan detail", body: "failed to copy generate url: " + e, fine: false }); },
      )
    } else {
        PubSub.publish(overall.topics.toast, { head: "plan detail", body: "the copy action is only available in https environment.", fine: false });
    }
  }

  switchTab(e, tab) {
    e.preventDefault();
    this.setState({ tab: tab });
  }

  render() {
    const planSummary =
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-1">
            <strong>
              Plan Id:
            </strong>
          </div>
          <div className="col-2">
            {this.state.plan.id}
          </div>

          <div className="col-auto ms-4">
            <strong>
              Create Time:
                    </strong>
          </div>
          <div className="col-2">
            {this.state.plan.createTime}
          </div>

          <div className="col-auto ms-4">
            <strong>
              Modify Time:
                    </strong>
          </div>
          <div className="col-2">
            {this.state.plan.modifyTime}
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-1">
            <strong>
              Name:
                    </strong>
          </div>
          <div className="col">
            {this.state.plan.name}
          </div>
          {this.props.shared &&
            <div className="col-auto">
              <button className="btn btn-outline-primary p-1" onClick={() => this.copyGenearteURLFromShare(this.props.planId)}>
                Copy Generate URL
              </button>
            </div>}
        </div>

        <div className="row mb-2">
          <div className="col-1">
            <strong>
              Remark:
                    </strong>
          </div>
          <div className="col">
            {this.state.plan.remark}
          </div>
        </div>
      </div>

    
    let tabs = (
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a className={`nav-link ${this.state.tab === this.tabs.configs ? "active" : ""}`}
            href="/#" onClick={(e) => this.switchTab(e, this.tabs.configs)}>
            Configs
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${this.state.tab === this.tabs.shares ? "active" : ""}`}
            href="/#" onClick={(e) => this.switchTab(e, this.tabs.shares)}>
            Shared Configs
          </a>
        </li>
        {this.props.shared ||
          <li className="nav-item">
            <a className={`nav-link ${this.state.tab === this.tabs.generatedToken ? "active" : ""}`}
              href="/#" onClick={(e) => this.switchTab(e, this.tabs.generatedToken)}>
              Generated Tokens
            </a>
          </li>}
        {this.props.shared ||
          <li className="nav-item">
            <a className={`nav-link ${this.state.tab === this.tabs.shareLinks ? "active" : ""}`}
              href="/#" onClick={(e) => this.switchTab(e, this.tabs.shareLinks)}>
              Shared Link
            </a>
          </li>}
      </ul>
    );

    let tabContent = null;
    switch (this.state.tab) {
      case this.tabs.configs:
        tabContent = <PlanDetailConfig
          planId={this.props.planId}
          configs={this.state.plan.configs}
          shared={this.props.shared}
          onModify={this.reqPlanGetDetail} />
          break;
      case this.tabs.generatedToken:
        tabContent = <PlanDetailTokens
          planId={this.props.planId} />
        break;
      case this.tabs.shares:
        tabContent = <PlanDetailSharedConfig
          planId={this.props.planId}
          shares={this.state.plan.shares}
          shared={this.props.shared}
          onModify={this.reqPlanGetDetail} />
        break;
      case this.tabs.shareLinks:
        tabContent = <PlanDetailSharelinks
          planId={this.props.planId} />
        break;

      default:
        break;
    }


    return (
      <div>
        <div className="modal fade" id="plan-detail-popup">
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                {this.props.shared && "Shared Plan Detail"}
                {this.props.shared || "Plan Detail"}

                <button type="button" className="btn-close" onClick={() => { this.popup.hide(); this.props.onClose() }}></button>
              </div>
              <div className="modal-body">

                {/* plan summary info */}
                {planSummary}

                {/* plan configs and shares info */}
                {tabs}

                {/* tab contents */}
                {tabContent}

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PlanDetailPopup;

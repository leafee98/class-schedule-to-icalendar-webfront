import React from 'react';
import PubSub from 'pubsub-js';
import apiReq from '../apilib/apiReq';
import overall from '../overall';
import './MyPlan.css';
import PlanDetailPopup from './PlanDetail';
import SelectPanel from './PlanDetail/SelectPanel';

const bootstrap = require('bootstrap');

class MyPlan extends React.Component {
  constructor(props) {
    super(props);

    this.reqGetPlanList = this.reqGetPlanList.bind(this);
    this.reqPlanCreate = this.reqPlanCreate.bind(this);
    this.reqPlanRemove = this.reqPlanRemove.bind(this);

    this.handleReqGetPlanList = this.handleReqGetPlanList.bind(this);
    this.handleReqPlanCreate = this.handleReqPlanCreate.bind(this);

    this.handlePlanRemove = this.handlePlanRemove.bind(this);
    this.handlePlanRemoveConfirm = this.handlePlanRemoveConfirm.bind(this);

    this.handleAddPlan = this.handleAddPlan.bind(this);
    this.handleSaveNewPlan = this.handleSaveNewPlan.bind(this);
    this.handleDropNewPlan = this.handleDropNewPlan.bind(this);

    this.handlePlanModify = this.handlePlanModify.bind(this);
    this.handlePlanModifySave = this.handlePlanModifySave.bind(this);
    this.handlePlanModifyCancel = this.handlePlanModifyCancel.bind(this);

    this.onChange = this.onChange.bind(this);

    this.getPlansTableRows = this.getPlansTableRows.bind(this);

    this.state = { 
      plans: [],
      currentOffset: 0,
      addPlan: false,
      planRemoveWarningId: -1,
      planDetailId: -1,

      editingPlan: {
        id: -1,
        name: "",
        remark: "",
        createTime: "",
        modifyTime: ""
      },
      newPlan: {
        name: "",
        remark: "",
      }
    };
  }

  componentDidMount() {
    this.reqGetPlanList(this.state.currentOffset);
  }

  reqGetPlanList(offset=0) {
    apiReq.planGetList(
      {
        sortBy: "id",
        offset: offset,
        count: 30
      },
      this.handleReqGetPlanList
    )
  }

  reqPlanCreate() {
    apiReq.planCreate(
      {
        name: this.state.newPlan.name,
        remark: this.state.newPlan.remark,
      },
      this.handleReqPlanCreate
    )
  }
  
  reqPlanRemove(planId) {
    apiReq.planRemove(
      {
        id: planId
      },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "my plan", body: "plan remove successed.", fine: true });
          this.reqGetPlanList()
        } else {
          PubSub.publish(overall.topics.toast, { head: "my plan", body: "plan remove failed: " + j.data, fine: false });
        }
      }
    )
  }

  reqPlanModify(plan) {
    apiReq.planModify({
      id: plan.id,
      name: plan.name,
      remark: plan.remark
    }).then(
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "my plan", body: "plan modify successed.", fine: true });
          this.handlePlanModifyCancel();
          this.reqGetPlanList();
        } else {
          PubSub.publish(overall.topics.toast, { head: "my plan", body: "plan modify failed: " + j.data, fine: false });
        }
      }
    )
  }

  handleReqGetPlanList(j) {
    if (j.status === "ok") {
      this.setState({ plans: j.data.plans });
    } else {
      PubSub.publish(overall.topics.toast, {head: "my plan", body: "failed to get plans.\n" + j.data, fine: false});
    }
  }

  handleReqPlanCreate(j) {
    if (j.status === "ok") {
      this.setState({ addPlan: false, newPlan: { name: "", remark: "" } });
      this.reqGetPlanList(this.state.offset);
      PubSub.publish(overall.topics.toast, {head: "my plan", body: "create plan success", fine: true});
    } else {
      PubSub.publish(overall.topics.toast, {head: "my plan", body: "failed to create plan.\n" + j.data, fine: false});
    }
  }

  handleAddPlan() {
    this.setState({ addPlan: true });
  }

  handlePlanRemove(planId) {
    this.setState({planRemoveWarningId: planId});
    let popup = new bootstrap.Modal(document.getElementById("plan-remove-warning-popup"));
    popup.show();
  }
  
  handlePlanRemoveConfirm() {
    this.reqPlanRemove(this.state.planRemoveWarningId);
  }

  handleSaveNewPlan() {
    this.reqPlanCreate();
  }

  handleDropNewPlan() {
    this.setState({
      addPlan: false, // remove inputs
      newPlan: {
        name: "",     // reset content in inputs
        remark: "",
      }
    })
  }

  handlePlanModify(planId) {
    this.setState((state, props) => {
      let i = state.plans.map(x => x.id).indexOf(planId);
      let p = state.plans[i];
      state.editingPlan = p;
      return state;
    });
  }

  handlePlanModifyCancel(e) {
    e.stopPropagation();
    this.setState({ editingPlan: { id: -1, name: "", remark: "", createTime: "", modifyTime: "" } });
  }

  handlePlanModifySave(e) {
    e.stopPropagation();
    this.reqPlanModify(this.state.editingPlan);
  }

  onChange(subject, p, v) {
    this.setState((state, props) => {
      switch (subject) {
        case "newPlan":
          state.newPlan[p] = v;
          break;
        case "editingPlan":
          state.editingPlan[p] = v;
          break;
        default:
          break;
      }
      return state;
    });
  }

  getPlansTableRowsNew() {
    return (
      <tr key="0" className="align-middle">
        <th className="myplan-table-col-id">
          <input type="text" className="myplan-table-input" disabled rows="1"
            value="" />
        </th>
        <th className="myplan-table-col-name">
          <textarea type="text" className="myplan-table-input form-control form-control-sm" rows="1"
            value={this.state.newPlan.name}
            maxLength="64"
            onChange={(e) => this.onChange("newPlan", "name", e.target.value)} />
        </th>
        <th className="myplan-table-col-remark">
          <textarea type="text" className="myplan-table-input form-control form-control-sm" rows="1"
            value={this.state.newPlan.remark}
            maxLength="300"
            onChange={(e) => this.onChange("newPlan", "remark", e.target.value)} />
        </th>
        <th className="myPlan-table-col-create-time">
          <input type="text" className="myplan-table-input" disabled
            value="" />
        </th>
        <th className="myPlan-table-col-modify-time">
          <input type="text" className="myplan-table-input" disabled
            value="" />
        </th>
        <th className="myPlan-table-col-operating">
          <button className="btn p-1 me-2" onClick={this.handleSaveNewPlan}>
            <img alt="save" src="/assets/icons/check2.svg" />
          </button>
          <button className="btn p-1" onClick={this.handleDropNewPlan}>
            <img alt="drop" src="/assets/icons/trash.svg" />
          </button>
        </th>
      </tr>
    )
  }

  getPlansTableRowsEditing(x) {
    return (
      <tr key={x.id} className="align-middle">
        <th className="myplan-table-col-id">
          <input type="text" className="myplan-table-input" disabled
            value={this.state.editingPlan.id} />
        </th>
        <th className="myplan-table-col-name">
          <textarea type="text" className="myplan-table-input" rows="1"
            value={this.state.editingPlan.name}
            maxLength="64"
            onChange={(e) => this.onChange("editingPlan", "name", e.target.value)} />
        </th>
        <th className="myplan-table-col-remark">
          <textarea type="text" className="myplan-table-input" rows="1"
            value={this.state.editingPlan.remark}
            maxLength="300"
            onChange={(e) => this.onChange("editingPlan", "remark", e.target.value)} />
        </th>
        <th className="myPlan-table-col-create-time">
          <input type="text" className="myplan-table-input" disabled
            value={this.state.editingPlan.createTime} />
        </th>
        <th className="myPlan-table-col-modify-time">
          <input type="text" className="myplan-table-input" disabled
            value={this.state.editingPlan.modifyTime} />
        </th>
        <th className="myPlan-table-col-operating">
          <button className="btn p-1 me-2" onClick={this.handlePlanModifySave}>
            <img alt="save" src="/assets/icons/check2.svg" />
          </button>
          <button className="btn p-1" onClick={this.handlePlanModifyCancel}>
            <img alt="drop" src="/assets/icons/x.svg" />
          </button>
        </th>
      </tr>
    )
  }

  getPlansTableRows() {
    let planRows = [];
    for (let x of this.state.plans) {
      let r = null;

      if (this.state.editingPlan.id === x.id) {
        r = this.getPlansTableRowsEditing(x);
      } else {
        r =
          <tr key={x.id} className="align-middle" onClick={() => this.setState({planDetailId: x.id})}>
            <th className="myplan-table-col-id">{x.id}</th>
            <td className="myplan-table-col-name">{x.name}</td>
            <td className="myplan-table-col-remark">{x.remark}</td>
            <td className="myplan-table-col-create-time">{x.createTime}</td>
            <td className="myplan-table-col-modify-time">{x.modifyTime}</td>
            <td className="myplan-table-col-operating">
              <button className="btn p-1 me-2"
                onClick={(e) => { e.stopPropagation(); this.handlePlanModify(x.id); }}>
                <img alt="edit" src="/assets/icons/pencil-square.svg" />
              </button>
              <button className="btn p-1"
                onClick={(e) => { e.stopPropagation(); this.handlePlanRemove(x.id); }}>
                <img alt="drop" src="/assets/icons/trash.svg" />
              </button>
            </td>
          </tr> ;
      }

      planRows.push(r);
    }

    // if adding new plan
    if (this.state.addPlan) {
      planRows.push(this.getPlansTableRowsNew());
    }

    if (planRows.length === 0) {
      planRows.push(
        <tr key="-1">
          <td colSpan="6">
            <div className="d-grid">
              <span className="m-auto">
                You have no plans yet...
              </span>
            </div>
          </td>
        </tr>
      );
    }

    return planRows;
  }

  getPlanRemoveWarning() {
    return (
      <div className="modal fade" id="plan-remove-warning-popup">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              Remove Plan Warning
            </div>
            <div className="modal-body">
              Are you sure to remove this plan(id={this.state.planRemoveWarningId}), this operating cannot be undo.
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={this.handlePlanRemoveConfirm}>Remove</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getPlanDetailPopup(planId) {
    return (
      <PlanDetailPopup planId={planId} onClose={() => this.setState({ planDetailId: -1 })} />
    );
  }

  render() {
    return (
      <div>
        <table className="table table-hover" style={{ tableLayout: "fixed", wordWrap: 'break-word' }} >
          <thead>
            <tr>
              <th className="myplan-table-col-id">id</th>
              <th className="myplan-table-col-name">name</th>
              <th className="myplan-table-col-remark">remark</th>
              <th className="myplan-table-col-create-time">create time</th>
              <th className="myplan-table-col-modify-time">modify time</th>
              <th className="myplan-table-col-operating">operating</th>
            </tr>
          </thead>

          <tbody>
            {this.getPlansTableRows()}
          </tbody>
        </table>

        { this.state.addPlan || 
          <div className="d-grid">
            <button className="btn btn-primary" onClick={this.handleAddPlan}>Add Plan</button>
          </div> }

        {this.getPlanRemoveWarning()}

        {this.state.planDetailId >= 0 && this.getPlanDetailPopup(this.state.planDetailId)}

        <SelectPanel />
      </div>
    )
  }
}

export default MyPlan;

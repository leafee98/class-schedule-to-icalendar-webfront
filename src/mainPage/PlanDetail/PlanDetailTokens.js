import React from 'react';
import PubSub from 'pubsub-js';
import apiReq from '../../apilib/apiReq';
import overall from '../../overall';

class PlanDetailTokens extends React.Component {
  constructor(props) {
    super(props);

    this.reqAddToken = this.reqAddToken.bind(this);
    this.reqPlanGetTokenList = this.reqPlanGetTokenList.bind(this);
    this.copyGenerateUrl = this.copyGenerateUrl.bind(this);

    // this.props.planId;
    this.state = {
      tokens: []
    }
  }

  componentDidMount() {
    this.reqPlanGetTokenList();
  }

  reqPlanGetTokenList() {
    apiReq.planGetTokenList(
      {id: this.props.planId},
      (j) => {
        if (j.status === "ok") {
          this.setState({ tokens: j.data.tokens })
        } else {
          PubSub.publish(overall.topics.toast, { head: "plan tokens", body: "failed to get tokens: " + j.data, fine: false });
        }
      }
    )
  }

  reqAddToken() {
    apiReq.planCreateToken(
      { id: this.props.planId },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "plan tokens", body: "success to add token.", fine: true });
        } else {
          PubSub.publish(overall.topics.toast, { head: "plan tokens", body: "failed to create token: " + j.data, fine: false });
        }

        this.reqPlanGetTokenList();
      }
    )
  }

  reqPlanRevokeToken(token) {
    apiReq.planRevokeToken(
      { token: token },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "plan tokens", body: "success to revoke token.", fine: true });
        } else {
          PubSub.publish(overall.topics.toast, { head: "plan tokens", body: "failed to revoke token: " + j.data, fine: false });
        }

        this.reqPlanGetTokenList();
      }
    )
  }

  copyGenerateUrl(token) {
    // this only work in HTTPS
    const url = window.location.protocol + "//" + window.location.host + overall.apiPath + "/generate-by-plan-token?token=" + token;
    navigator.clipboard.writeText(url).then(
      () => { PubSub.publish(overall.topics.toast, { head: "plan tokens", body: "success to copy generate url", fine: true }); },
      (e) => { PubSub.publish(overall.topics.toast, { head: "plan tokens", body: "failed to copy generate url: " + e, fine: false }); },
    )
  }

  render() {
    let rows = [];
    for (let x of this.state.tokens) {
      let tmp = (
        <tr key={x.token}>
          <td>{x.token}</td>
          <td>{x.createTime}</td>
          <td>
            <button className="btn p-1" onClick={() => this.copyGenerateUrl(x.token)}>
              <img src="/assets/icons/clipboard.svg" alt="copy generate url"></img>
            </button>
            <button className="btn p-1" onClick={() => this.reqPlanRevokeToken(x.token)}>
              <img src="/assets/icons/trash.svg" alt="remove"></img>
            </button>
          </td>
        </tr>
      );
      rows.push(tmp);
    }

    if (rows.length === 0) {
      rows.push(
        <tr key="-1">
          <td colSpan="3" className="text-center">
            No tokens now.
          </td>
        </tr>
      );
    }

    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Create Time</th>
              <th>Operating</th>
            </tr>
          </thead>

          <tbody>
            {rows}
          </tbody>
        </table>

        <div className="d-grid">
          <button className="btn btn-primary" onClick={this.reqAddToken}>
            Add Token
          </button>
        </div>

      </div>
    )
  }
}

export default PlanDetailTokens;
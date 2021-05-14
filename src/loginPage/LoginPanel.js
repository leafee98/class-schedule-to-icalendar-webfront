import React from 'react';
import PubSub from 'pubsub-js';
import apiReq from '../apilib/apiReq';
import overall from '../overall';

class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.reqLogin = this.reqLogin.bind(this);
    this.handleReqLogin = this.handleReqLogin.bind(this);

    this.state = {
      username: "",
      password: "",
    };
  }

  reqLogin(event) {
    event.preventDefault();
    apiReq.login(
      {
        username: this.state.username,
        password: this.state.password,
        tokenDuration: 7,
      },
      this.handleReqLogin
    )
  }

  handleReqLogin(j) {
    if (j["status"] === "ok") {
      PubSub.publish(overall.topics.toast, { head: "login", body: "login success", fine: true });
      PubSub.publish(overall.topics.switchPage, overall.data.switchPage.mainPage);

      localStorage.setItem(overall.storageKey.username, this.state.username);
      localStorage.setItem(overall.storageKey.userId, j.id);
    } else {
      PubSub.publish(overall.topics.toast, { head: "login", body: j.data, fine: false });
    }
  }

  handleChangle(p, v) {
    this.setState({[p]: v});
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.reqLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" placeholder="type your username..."
              value={this.state.username}
              onChange={(e) => this.handleChangle("username", e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="type your password..."
              value={this.state.password}
              onChange={(e) => this.handleChangle("password", e.target.value)}/>
          </div>

          <div className="d-grid">
            <button type="submit"
              className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    )
  }

}

export default LoginPanel;

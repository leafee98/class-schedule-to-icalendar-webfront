import React from 'react'
import PubSub from 'pubsub-js';
import apiReq from '../apilib/apiReq';
import overall from '../overall';

class RegisterPanel extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.reqRegister = this.reqRegister.bind(this);

    this.state = {
      email: "",
      username: "",
      nickname: "",
      password: ""
    };
  }

  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }

  reqRegister(e) {
    e.preventDefault();
    apiReq.register(
      {
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
        nickname: this.state.nickname
      },
      (j) => {
        if (j.status === "ok") {
          PubSub.publish(overall.topics.toast, { head: "register", body: "register success", fine: true })
          PubSub.publish(overall.topics.loginPage.switch, overall.data.loginPage.switch.login);
        } else {
          PubSub.publish(overall.topics.toast, { head: "register", body: j.data, fine: false })
        }
      }
    )
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.reqRegister}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="text" className="form-control" placeholder="type your email..."
              value={this.state.email} onChange={(e) => this.handleChange("email", e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" placeholder="type your username..."
              value={this.state.username} onChange={(e) => this.handleChange("username", e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Nickname</label>
            <input type="text" className="form-control" placeholder="type your nickname..."
              value={this.state.nickname} onChange={(e) => this.handleChange("nickname", e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="type your password..."
              value={this.state.password} onChange={(e) => this.handleChange("password", e.target.value)} />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    )
  }
}

export default RegisterPanel;

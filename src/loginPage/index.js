import React from 'react';
import PubSub from 'pubsub-js';
import LoginPanel from './LoginPanel';
import RegisterPanel from './RegisterPanel';
import overall from '../overall';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.changeStatus = this.changeStatus.bind(this);

    this.state = {
      status: 'l' // l: login, r: register
    }
  }

  __subToken = "";

  componentDidMount() {
    this.__subToken = PubSub.subscribe(overall.topics.loginPage.switch,
      (msg, data) => {
        switch (data) {
          case overall.data.loginPage.switch.login:
            this.changeStatus('l');
            break;
          case overall.data.loginPage.switch.register:
            this.changeStatus('r');
            break;
          default:
            break;
        }
      });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.__subToken);
  }

  changeStatus(s) {
    this.setState({
      status: s
    });
  }

  render() {
    return (
      <div className="container w-25 pt-3">
        <div className="container">
          <ul className="nav nav-tabs justify-content-center">
            <li className="nav-item">
              <button className={`nav-link ${this.state.status === 'l' && "active"}`}
                onClick={() => this.changeStatus('l')}>login</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${this.state.status === 'r' && "active"}`}
                onClick={() => this.changeStatus('r')}>register</button>
            </li>
          </ul>
        </div>

        <div className="container mt-3">
          {this.state.status === 'l' ? <LoginPanel /> : <RegisterPanel />}
        </div>
      </div>
    )
  }
}

export default LoginPage;

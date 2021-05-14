import React from 'react';
import PubSub from 'pubsub-js';

import apiReq from '../apilib/apiReq';
import overall from '../overall';
import cookie from '../utils/cookie';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.reqLogout = this.reqLogout.bind(this);
  }

  reqLogout() {
    // request reset server to revoke token
    apiReq.logout().finally(
      () => {
        // clear page history
        localStorage.clear();
        // clear cookie even if network error
        cookie.set("token", "", 0);
        // switch to login page
        PubSub.publish(overall.topics.switchPage, overall.data.switchPage.loginPage);

        // logout can be done even offline totally, so never failed, just toast a success message.
        PubSub.publish(overall.topics.toast, { head: "logout", body: "logout success", fine: true });
      }
    );
  }

  render() {
    return (
      <div className="container-fluid align-center">
      {/* <div className="position-fixed top-0 start-0 pt-3 ps-3"> */}
        <span className="me-3">{localStorage.getItem(overall.storageKey.username)}</span>
        <button 
          onClick={this.reqLogout}
          className="btn btn-outline-warning btn-sm">
          logout
        </button>
      </div>
    );
  }
}

export default Profile;

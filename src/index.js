import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';
import 'bootstrap/dist/css/bootstrap.css';

import LoginPage from './loginPage';
import MainPage from './mainPage';
import ToastPanel from './component/ToastPanel';
import apiReq from './apilib/apiReq';
import overall from './overall';

apiReq.networkErrorHandler = () => {
  PubSub.publish(overall.topics.toast,
    { head: "error", body: "server side error or network error, try to relogin.", fine: false });
};

apiReq.apiPath = overall.apiPath;

class Global extends React.Component {
  constructor(props) {
    super(props);

    this.switchPage = this.switchPage.bind(this);

    let tmpPage = localStorage.getItem("page");
    if (tmpPage == null) {
      tmpPage = overall.data.switchPage.loginPage;
    }

    this.state = {
      page: tmpPage
    };
  }

  __subToken = "";

  componentDidMount() {
    this.__subToken = PubSub.subscribe(overall.topics.switchPage, this.switchPage);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.__subToken);
  }

  switchPage(topic, data) {
    localStorage.setItem(overall.storageKey.page, data);
    this.setState({page: data});
  }

  render() {
    let page = null;
    switch (this.state.page) {
      case overall.data.switchPage.loginPage:
        page = <LoginPage />
        break;
      case overall.data.switchPage.mainPage:
        page = <MainPage />
        break;

      default:
          break;
    }

    return (
      <div className="container-fluid">
        
        <div>
          {page}
        </div>

        <ToastPanel />
      </div>
    )
  }
}


ReactDOM.render(
  <React.StrictMode>
    <Global />
  </React.StrictMode>,
  document.getElementById('root')
);

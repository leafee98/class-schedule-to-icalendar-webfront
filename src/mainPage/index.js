import React from 'react';
import Profile from '../component/Profile';

import MyPlan from './MyPlan';
import MyConfig from './MyConfig';
import FavorConfig from './FavorConfig';
import FavorPlan from './FavorPlan';

import cookie from '../utils/cookie';
import overall from '../overall';

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.subPages = {
      myPlan: "myPlan",
      favorPlan: "favorPlan",
      myConfig: "myConfig",
      favorConfig: "favorConfig"
    }

    this.state = {
      subPage: this.subPages.myPlan
    }
  }

  switchSubPage(e, p) {
    e.preventDefault();
    this.setState({ subPage: p });
  }

  render() {
    let subPage = null;
    let subTitle = null;

    switch (this.state.subPage) {
      case this.subPages.myPlan:
        subPage = <MyPlan />
        subTitle = "My Plan";
        break;

      case this.subPages.favorPlan:
        subPage = <FavorPlan />;
        subTitle = "Favor Plan";
        break;

      case this.subPages.myConfig:
        subPage = <MyConfig />
        subTitle = "My Config";
        break;

      case this.subPages.favorConfig:
        subPage = <FavorConfig />
        subTitle = "Favor Config";
        break;
      
      default:
        break;
    }

    let profile = null;
    if (cookie.get("token") != null || localStorage.getItem(overall.storageKey.userId) !== null)
      profile = <Profile />;

    return (
      <div className="container-fluid">

        <div className="bg-light">
          <nav className="navbar navbar-expand navbar-light bg-light">
            <div className="container-fluid">

              <ul className="navbar-nav">
                <li className="nav-item me-3">
                  {profile}
                </li>

                <li className="nav-item dropdown me-3">
                  <a className="dropdown-toggle" data-bs-toggle="dropdown" href="/#">Plan</a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/#" onClick={(e) => this.switchSubPage(e, this.subPages.myPlan)}>My Plan</a></li>
                    <li><a className="dropdown-item" href="/#" onClick={(e) => this.switchSubPage(e, this.subPages.favorPlan)}>Favor Plan</a></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a className="dropdown-toggle" data-bs-toggle="dropdown" href="/#">Config</a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/#" onClick={(e) => this.switchSubPage(e, this.subPages.myConfig)}>My Config</a></li>
                    <li><a className="dropdown-item" href="/#" onClick={(e) => this.switchSubPage(e, this.subPages.favorConfig)}>Favor Config</a></li>
                  </ul>
                </li>
              </ul>

              <span className="m-auto">{subTitle}</span>

            </div>
          </nav>
        </div>

        <div className="container">
          {subPage}
        </div>

      </div>
    );
  }
}

export default MainPage;

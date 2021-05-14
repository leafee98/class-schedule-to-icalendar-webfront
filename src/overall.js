var overall = {
  // modify this to your config before build
  apiPath: "/api",

  storageKey: {
    page: "page",
    username: "username",
    userId: "userId",
    mainPage: "mainPage"
  },
  data: {
    switchPage: {
      loginPage: "switchPage.loginPage",
      mainPage: "switchPage.mainPage"
    },
    loginPage: {
      switch: {
        login: "loginPanel.login",
        register: "loginPanel.register"
      }
    },
    mainPage: {
      switch: {
        myPlan: "mainPage.myPlan",
        favorPlan: "mainPage.favorPlan",
        myConfig: "mainPage.myConfig",
        favorConfig: "mainPage.favorConfig",
        
        planDetail: "mainPage.planDetail",
        configDetail: "mainPage.configDetail"
      }
    }
  },
  topics: {
    toast: "toast",
    switchPage: "switchPage",
    loginPage: {
      switch: "loginPage.switch"
    },
    mainPage: {
      switch: "mainPage.switch",
      myPlan: {
        planDetail: {
          popupShow: "mainpage.myPlan.planDetil.popupShow",
          popupHide: "mainpage.myPlan.planDetil.popupHide",
        },
        selectPopup: {
          show: "mainPage.myPlan.planDetail.selectPopup.show"
        }
      }
    }
  }
}

export default overall;

class apiReq {
    static __priReq (path, param, successCallback) {
        return fetch(this.apiPath + path, {
            method: "post",
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        }).then((res) => res.json(), this.networkErrorHandler)
        .then(successCallback);
    }

    static networkErrorHandler = (e) => { console.log(e); };
    static apiPath = "/api";

    static __target = {
        login: "/login",
        register: "/register",
        logout: "/logout",

        configCreate: "/config-create",
        configRemove: "/config-remove",
        configMofidy: "/config-modify",
        configGetById: "/config-get-by-id",
        configGetByShare: "/config-get-by-share",
        configGetList: "/config-get-list",

        configShareCreate: "/config-share-create",
        configShareModify: "/config-share-modify",
        configShareRevoke: "/config-share-revoke",
        configshareGetList: "/config-share-get-list",

        planCreate: "/plan-create",
        planRemove: "/plan-remove",

        planModify: "/plan-modify",
        planAddConfig: "/plan-add-config",
        planRemoveConfig: "/plan-remove-config",
        planAddShare: "/plan-add-share",
        planRemoveShare: "/plan-remove-share",

        planGetById: "/plan-get-by-id",
        planGetByShare: "/plan-get-by-share",
        planGetList: "/plan-get-list",

        planCreateToken: "/plan-create-token",
        planRevokeToken: "/plan-revoke-token",
        planGetTokenList: "/plan-get-token-list",

        planShareCreate: "/plan-share-create",
        planShareModify: "/plan-share-modify",
        planShareRevoke: "/plan-share-revoke",
        planShareGetList: "/plan-share-get-list",

        favorConfigAdd: "/favor-config-add",
        favorConfigRemove: "/favor-config-remove",
        favorConfigGetList: "/favor-config-get-list",
        favorPlanAdd: "/favor-plan-add",
        favorPlanRemove: "/favor-plan-remove",
        favorPlanGetList: "/favor-plan-get-list",

        generateByPlanToken: "/generate-by-plan-token"
    }

    static login(param, successCallback) { return this.__priReq(this.__target.login, param, successCallback); }
    static register(param, successCallback) { return this.__priReq(this.__target.register, param, successCallback); }
    static logout(param, successCallback) { return this.__priReq(this.__target.logout, param, successCallback); }

    static configCreate(param, successCallback) { return this.__priReq(this.__target.configCreate, param, successCallback); }
    static configRemove(param, successCallback) { return this.__priReq(this.__target.configRemove, param, successCallback); }
    static configMofidy(param, successCallback) { return this.__priReq(this.__target.configMofidy, param, successCallback); }
    static configGetById(param, successCallback) { return this.__priReq(this.__target.configGetById, param, successCallback); }
    static configGetByShare(param, successCallback) { return this.__priReq(this.__target.configGetByShare, param, successCallback); }
    static configGetList(param, successCallback) { return this.__priReq(this.__target.configGetList, param, successCallback); }

    static configShareCreate(param, successCallback) { return this.__priReq(this.__target.configShareCreate, param, successCallback); }
    static configShareModify(param, successCallback) { return this.__priReq(this.__target.configShareModify, param, successCallback); }
    static configShareRevoke(param, successCallback) { return this.__priReq(this.__target.configShareRevoke, param, successCallback); }
    static configshareGetList(param, successCallback) { return this.__priReq(this.__target.configshareGetList, param, successCallback); }

    static planCreate(param, successCallback) { return this.__priReq(this.__target.planCreate, param, successCallback); }
    static planRemove(param, successCallback) { return this.__priReq(this.__target.planRemove, param, successCallback); }

    static planModify(param, successCallback) { return this.__priReq(this.__target.planModify, param, successCallback); }
    static planAddConfig(param, successCallback) { return this.__priReq(this.__target.planAddConfig, param, successCallback); }
    static planRemoveConfig(param, successCallback) { return this.__priReq(this.__target.planRemoveConfig, param, successCallback); }
    static planAddShare(param, successCallback) { return this.__priReq(this.__target.planAddShare, param, successCallback); }
    static planRemoveShare(param, successCallback) { return this.__priReq(this.__target.planRemoveShare, param, successCallback); }

    static planGetById(param, successCallback) { return this.__priReq(this.__target.planGetById, param, successCallback); }
    static planGetByShare(param, successCallback) { return this.__priReq(this.__target.planGetByShare, param, successCallback); }
    static planGetList(param, successCallback) { return this.__priReq(this.__target.planGetList, param, successCallback); }

    static planCreateToken(param, successCallback) { return this.__priReq(this.__target.planCreateToken, param, successCallback); }
    static planRevokeToken(param, successCallback) { return this.__priReq(this.__target.planRevokeToken, param, successCallback); }
    static planGetTokenList(param, successCallback) { return this.__priReq(this.__target.planGetTokenList, param, successCallback); }

    static planShareCreate(param, successCallback) { return this.__priReq(this.__target.planShareCreate, param, successCallback); }
    static planShareModify(param, successCallback) { return this.__priReq(this.__target.planShareModify, param, successCallback); }
    static planShareRevoke(param, successCallback) { return this.__priReq(this.__target.planShareRevoke, param, successCallback); }
    static planShareGetList(param, successCallback) { return this.__priReq(this.__target.planShareGetList, param, successCallback); }

    static favorConfigAdd(param, successCallback) { return this.__priReq(this.__target.favorConfigAdd, param, successCallback); }
    static favorConfigRemove(param, successCallback) { return this.__priReq(this.__target.favorConfigRemove, param, successCallback); }
    static favorConfigGetList(param, successCallback) { return this.__priReq(this.__target.favorConfigGetList, param, successCallback); }
    static favorPlanAdd(param, successCallback) { return this.__priReq(this.__target.favorPlanAdd, param, successCallback); }
    static favorPlanRemove(param, successCallback) { return this.__priReq(this.__target.favorPlanRemove, param, successCallback); }
    static favorPlanGetList(param, successCallback) { return this.__priReq(this.__target.favorPlanGetList, param, successCallback); }

    static generateByPlanToken(param, successCallback) { return this.__priReq(this.__target.generateByPlanToken, param, successCallback); }
};

export default apiReq;

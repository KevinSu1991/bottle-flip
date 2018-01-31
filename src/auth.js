import { request } from './utils';

let { sdk, anfeng, location } = window;

var uaMatch = function(str) {
    return navigator.userAgent.match(str) !== null;
}
  
var isAnfengHelper = uaMatch('anfan'),
    isAnfengGame = uaMatch('afgame'),
    isAnfengSdkAndroid = uaMatch('anfeng_mobile_android_sdk'),
    isAnfengSdkiOS = uaMatch('anfeng_mobile_ios_sdk');

class Auth {
  static IOS_SDK_WATING_TIME = 1000;

  _logging = true;
  _user = null;
  _token = null;
  _pid = null;
  
  login(redirect = location.href) {
    if(isAnfengHelper) {
      anfeng.users_login();
    } else if (isAnfengGame) {
      anfeng.login();
    } else {
      location.href = ('/index.php?redirect_uri='+ encodeURIComponent(redirect));
    }
  }

  async logout() {
    if (isAnfengHelper || isAnfengGame) {
      this.login();
    } else {
      await request('/index.php?c=ActivityAction&m=logout');
      this._user = null;
      this.login();
    }
  }

  token() {
    return new Promise(resolve => {
      if (isAnfengHelper) resolve(anfeng.get_users_status());
      else if (isAnfengGame) resolve(anfeng && anfeng.getToken());
      else if (isAnfengSdkAndroid) resolve(sdk && sdk.requestToken && sdk.requestToken());
      else if (isAnfengSdkiOS) {
        if (this._token) resolve(this._token);
        else {
          let callback = window.user_login;
          window.user_login = (token, pid) => {
            callback && callback(token, pid);
            this._token = token;
            this._pid = pid;
            resolve(this._token);
          };
        }
      }
      setTimeout(() => {
        resolve(null);
      }, Auth.IOS_SDK_WATING_TIME);
    });
}
  
  pid() {
    if (isAnfengSdkAndroid) {
      return sdk && sdk.getGameId && sdk.getGameId();
    } else if (isAnfengSdkiOS) {
      return this._pid;
    } else {
      return null;
    }
  }

  async user() {
    let token = await this.token();
    let result = new Promise(async (resolve) => {

      
      this._logging = true;
      try {
        const user = token
            ? await request('/index.php?c=activityAction&m=login', {token: token})
            : await request('/index.php?c=activityAction&m=status');
        this._user = user;
        resolve(user)
      } catch (error) {
        resolve(null);
      }
      this._logging = false;
    })
    return result;
  }
}

export default new Auth();
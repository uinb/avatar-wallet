import browser from 'webextension-polyfill';
import { injectExtension } from "@polkadot/extension-inject";
import { EventEmitter } from "events";
import { resolveRequest } from "./messaging/in-page";

console.log('injection');
console.log('browser', browser);

class AvatarWalletProvider extends EventEmitter {
  constructor() {
    super();
    this.request = this.request.bind(this);
  }
  request(){
    console.log('browser obj', browser);
    const NOTIFICATION_URL = browser.runtime.getURL('index.html');
    /* const POPUP_WINDOW_OPTS = {
      focused: true,
      height: 621,
      left: 150,
      top: 150,
      type: 'popup',
      url: 'https://baidu.com',
      width: 380
    }; */

    browser.tabs.create({url: NOTIFICATION_URL})
    return 'request'
  }
  alert(){
    alert(11111);
  }
 /*  async getAccounts(payload){
    const res = await getAccounts(payload);
    return res;
  }
  async signer(payload){
      const res = await signTransaction(payload);
      return res;
  }
  async signRaw(payload) {
    const res = await signMessage(payload);
    return res;
  } */
}

window.avatar = new AvatarWalletProvider();

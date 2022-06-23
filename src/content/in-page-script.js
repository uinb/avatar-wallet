/* global chrome browser */
import { injectExtension } from "@polkadot/extension-inject";
import { EventEmitter } from "events";
import { resolveRequest } from "./messaging/in-page";
const extension = require('extensionizer');

console.log('injection');

const metadata = {
  url: window.location.origin,
};

console.log(metadata);
const getAccounts = async () => {
  const result = await resolveRequest('get-account', {}, metadata);
  return result;
};

const signTransaction = async (payload) => {
  const result = await resolveRequest('send', payload, metadata);
  return result;
};

// eslint-disable-next-line no-unused-vars
const signMessage = async (payload) => {
  const result = await resolveRequest(
    'sign message',
    payload,
    metadata
  );
  return result;
};

const enable = async (origin) => {
  const metadata = {
    origin,
    url: window.location.origin,
  };
  await resolveRequest('sign enable', { origin }, metadata);
  return {
    accounts: {
      get: async () => {
        const res = await getAccounts();
        return res;
      },
    },
    name:'xxx',
    signer: {
      signPayload: async (payload) => {
        const res = await signTransaction(payload);
        return res;
      },
      signRaw: async (payload) => {
        const res = await signMessage(payload);
        return res;
      },
    },
    sign: {
      signMessage: async (payload) => {
        const res = await signMessage(payload);
        return res;
      },
    },
    version: '1.0.0',
  };
};

injectExtension(enable, {
  name: 'xxx',
  version: '1.0.0',
});

class AvatarWalletProvider extends EventEmitter {
  constructor() {
    super();
    this.request = this.request.bind(this);
  }
  request(){
    console.log(extension.runtime, extension, chrome);
    //const NOTIFICATION_URL = extension.runtime.getURL('index.html');
    const POPUP_WINDOW_OPTS = {
      focused: true,
      height: 621,
      left: 150,
      top: 150,
      type: 'popup',
      url: 'https://baidu.com',
      width: 380
    };

    browser.windows.create(POPUP_WINDOW_OPTS)
    return 'request'
  }
  async getAccounts(payload){
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
  }
}

window.avatar = new AvatarWalletProvider();

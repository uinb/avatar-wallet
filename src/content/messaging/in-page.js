import {
    BG_DAPP_RESPONSE,
    WEB3_RESPONSE,
} from "../../types/response-types";
import { FAILURE } from "../../constant/api";
  
  export function resolveRequest(requestType, opts, metadata) {
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      try {
        const data = { requestType, opts, metadata };
        console.log('request details 1111', requestType, opts, metadata)
        window.postMessage(data, `http://${metadata.url}`);
        window.addEventListener("message", (event) => {
          // We only accept messages from ourselves
          if (event.source !== window) return;
          if (event.data && event.data.type) {
            if (BG_DAPP_RESPONSE === event.data.type) {
              const {
                data: { result, status, message },
              } = event;
              if (status === FAILURE) {
                reject(message);
              }
              resolve(result);
            } else if (WEB3_RESPONSE === event.data.type) {
              const {
                data: { result, status, message },
              } = event;
              if (!result || !result.id || result.id !== opts.id) {
                return;
              }
              if (status === FAILURE) {
                reject(message);
              }
              resolve(result);
            }
          }
        });
        return 
      } catch (e) {
        const error = {
          message: e.message,
          stack: e.stack || {},
        };
        reject(error);
      }
    });
  }
  
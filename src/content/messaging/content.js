/* This ia a bridge to relay messages between background and inPage scripts */
import extension from 'extensionizer';
import * as RequestTypes from '../../lib/request-types';
import * as TransceiverService from '../services/transceiver-service';
import * as Web3TransceiverService from '../services/web3-transceiver-service';
import * as ResponseType from '../../lib/response-types';

window.addEventListener('message', async event => {
  // We only accept messages from ourselves
  if (event.source !== window) return;
  if (event.data && event.data.requestType) {
    const { data } = event;
    console.log('listen message',data);
    try {
     switch (data.requestType) {
        case RequestTypes.ENABLE:
          TransceiverService.authorizeDApp(event.data);
          break;
        case RequestTypes.GET_ACCOUNTS:
          TransceiverService.getAccounts(event.data);
          break;
        case RequestTypes.SEND:
          TransceiverService.submitTransaction(event.data);
          break;
        case RequestTypes.SIGN_MESSAGE:
          TransceiverService.signMessage(event.data);
          break;
        case RequestTypes.WEB3_REQUEST:
          try {
            if (
              RequestTypes.SAFE_METHODS.includes(data.opts.method)
              || data.opts.method === 'eth_accounts'
            ) {
              Web3TransceiverService.handleMethod(data);
            } else {
              Web3TransceiverService.handleDefault(data);
            }
          } catch (err) {
            const error = { message: err.message, stack: err.stack || {} };
            Web3TransceiverService.handleError(error, data);
          }
          break;
        default:
          TransceiverService.handleDefault(event.data);
      }
    } catch (err) {
      const error = { message: err.message, stack: err.stack || {} };
      console.log(error);
      //TransceiverService.handleError(error, data);
    }
  }
});
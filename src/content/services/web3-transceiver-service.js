import { sendMessage, getManifest } from '../../lib/messages';
import * as MessageTypes from '../../lib/message-types';
import * as ResponseTypes from '../../lib/response-types';
import * as status from '../../constant/api';

// return a failure ...
export const failure = {
  status: status.FAILURE,
  message: 'failed',
};

//return a sucess ...
export const success = {
  status: status.SUCCESS,
  message: 'success',
};

export const getManifestInfo = () => {
  const response = getManifest();
  console.log(response)
}

export const handleDefault = data => {
  const out = {
    ...failure,
    message: 'Wrong request type.',
    type: ResponseTypes.WEB3_RESPONSE,
  };
  window.postMessage(out, data.metadata.origin);
};

export const handleError = (err, data) => {
  const out = {
    ...failure,
    message: err.message,
    type: ResponseTypes.WEB3_RESPONSE,
  };
  window.postMessage(out, data.metadata.origin);
};

export const handleMethod = async data => {
  const response = await sendMessage({
    ...data,
    type: MessageTypes.WEB3_REQUEST,
  });
  // console.log('content handle method:', response);
  if (response.result !== undefined || response.status === status.FAILURE) {
    const out = {
      ...response,
      type: ResponseTypes.WEB3_RESPONSE,
    };
    window.postMessage(out, data.metadata.origin);
  }
};

export const dAppResponse = async request => {
  const out = {
    ...request,
  };
  window.postMessage(out, '*');
};

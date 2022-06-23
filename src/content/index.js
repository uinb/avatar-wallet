const extension = require('extensionizer');
require("./messaging/content");

function injectScript(filePath) {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", filePath);
    document.documentElement.appendChild(script);
}
const url = extension.runtime.getURL("inPageScript.js");
injectScript(url);

/* const NOTIFICATION_URL = extension.extension.getURL('index.html');
const POPUP_WINDOW_OPTS = {
  focused: true,
  height: 621,
  left: 150,
  top: 150,
  type: 'popup',
  url: NOTIFICATION_URL,
  width: 380
};

extension.windows.create(POPUP_WINDOW_OPTS) */
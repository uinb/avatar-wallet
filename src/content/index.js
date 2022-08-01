/* global chrome */
import browser from 'webextension-polyfill';

//browser.tabs.executeScript({file: 'browser-polyfill.js'});

console.log('browser obj', browser);

function injectScript(filePath) {
  console.log('injection inpage script');
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", filePath);
  document.documentElement.appendChild(script);
}
const url = browser.runtime.getURL("inPageScript.js");
console.log('get url',url)
injectScript(url);
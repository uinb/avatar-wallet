import browser from 'webextension-polyfill';

browser.runtime.onInstalled?.addListener(function (tab) {
    console.log('show tab',tab);
    /* browser.tabs.executeScript({target: {tabId: tab.id}, file: "browser-polyfill.js"}); */
    console.log('background extension',browser);
    console.log("插件已被安装");
});
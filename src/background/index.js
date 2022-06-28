/* global chrome */

/* chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({pageUrl: {}}),
            ],
            actions: [
                new window.chrome.declarativeContent.showPageAction()
            ]
        }])
    })
}) */

chrome?.runtime?.onInstalled?.addListener(function () {
    console.log("插件已被安装");
});
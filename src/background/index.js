const extension = require('extensionizer');

extension.runtime.onInstalled?.addListener(function () {
    console.log(extension);
    console.log("插件已被安装");
});
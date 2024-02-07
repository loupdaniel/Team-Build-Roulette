"use strict";
exports.__esModule = true;
// polyfills
require("core-js/stable");
require("web-animations-js/web-animations.min");
require("element-remove-polyfill");
var analytics_1 = require("@vercel/analytics");
var speed_insights_1 = require("@vercel/speed-insights");
analytics_1.inject();
speed_insights_1.injectSpeedInsights();
// styles
require("@styles/index.scss");
// main
require("@js/app");
// PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./service-worker.js').then(function (registration) {
            console.log('SW registered: ', registration);
        })["catch"](function (registrationError) {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

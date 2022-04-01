"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioclient = __importStar(require("socket.io-client"));
document.addEventListener("DOMContentLoaded", () => {
    ioclient.connect("http://localhost:3000")
        .on("likedPost", (data) => {
        let { notificationInfo } = data;
        let loggedUserId = getCookie("loggedUser");
        if (notificationInfo.reciver === loggedUserId) {
            setNotificationCounter();
        }
    })
        .on("messageSaved", (data) => {
        let loggedUserId = getCookie("loggedUser");
        if (data.message.reciver === loggedUserId) {
            setMessageNotification();
        }
    });
});
function setNotificationCounter() {
    let notificationCounter = document.querySelector(".notification__counter");
    notificationCounter.style.display = "flex";
    let currentCount = notificationCounter.innerHTML;
    let incresedCount = Number(currentCount) + 1;
    notificationCounter.innerHTML = incresedCount.toString();
}
function setMessageNotification() {
    let messageNotificationCounter = document.querySelector(".notification__message__counter");
    messageNotificationCounter.style.display = "flex";
    let currentCount = messageNotificationCounter.innerHTML;
    let incresedCount = Number(currentCount) + 1;
    messageNotificationCounter.innerHTML = incresedCount.toString();
}
function getCookie(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}
//# sourceMappingURL=navigation.js.map
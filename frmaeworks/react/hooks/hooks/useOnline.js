"use strict";
exports.__esModule = true;
exports.useOnline = void 0;
var react_1 = require("react");
var useOnline = function () {
    var _a = (0, react_1.useState)(window.navigator.onLine), isOnline = _a[0], setIsOnline = _a[1];
    (0, react_1.useEffect)(function () {
        window.addEventListener("offline", function () {
            return setIsOnline(window.navigator.onLine);
        });
        window.addEventListener("online", function () {
            return setIsOnline(window.navigator.onLine);
        });
        return function () {
            window.removeEventListener("offline", function () {
                return setIsOnline(window.navigator.onLine);
            });
            window.removeEventListener("online", function () {
                return setIsOnline(window.navigator.onLine);
            });
        };
    });
    return isOnline;
};
exports.useOnline = useOnline;

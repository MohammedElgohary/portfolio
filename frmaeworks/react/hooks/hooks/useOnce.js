"use strict";
exports.__esModule = true;
exports.useOnce = void 0;
var react_1 = require("react");
var useOnce = function (callback) { return (0, react_1.useEffect)(callback, []); };
exports.useOnce = useOnce;

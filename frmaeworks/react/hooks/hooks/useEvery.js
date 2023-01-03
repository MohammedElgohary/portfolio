"use strict";
exports.__esModule = true;
exports.useEvery = void 0;
var react_1 = require("react");
function useEvery(_a) {
    var duration = _a.duration, callback = _a.callback, _b = _a.condition, condition = _b === void 0 ? true : _b;
    var timer = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        if (condition)
            timer.current = setInterval(callback, duration);
        return function () {
            clearInterval(timer.current);
        };
    }, [condition, duration]);
}
exports.useEvery = useEvery;

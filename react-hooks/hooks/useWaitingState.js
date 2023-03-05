"use strict";
exports.__esModule = true;
var react_1 = require("react");
function useWaitingState(_a) {
    var delay = _a.delay, initialValue = _a.initialValue, preUpdate = _a.preUpdate, _b = _a.formate, formate = _b === void 0 ? function (val) { return val; } : _b;
    var _c = (0, react_1.useState)(formate(initialValue)), state = _c[0], setState = _c[1];
    var ref = (0, react_1.useRef)();
    var updateSate = (0, react_1.useCallback)(function (val) {
        if (ref.current)
            clearTimeout(ref.current);
        ref.current = setTimeout(function () {
            preUpdate === null || preUpdate === void 0 ? void 0 : preUpdate(val);
            setState(formate(val));
        }, delay);
    }, [delay, formate, preUpdate]);
    return [state, updateSate, setState];
}
exports["default"] = useWaitingState;

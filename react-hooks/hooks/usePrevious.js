"use strict";
exports.__esModule = true;
exports.usePrevious = void 0;
var react_1 = require("react");
function usePrevious(object) {
    var ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        ref.current = object;
    });
    return ref.current;
}
exports.usePrevious = usePrevious;

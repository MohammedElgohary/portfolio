"use strict";
exports.__esModule = true;
exports.useOnEnterSection = void 0;
var react_1 = require("react");
var useOnEnterSection = function (_a) {
    var selectors = _a.selectors, _b = _a.delay, delay = _b === void 0 ? 0 : _b, onShown = _a.onShown, onHidden = _a.onHidden;
    (0, react_1.useEffect)(function () {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    onShown === null || onShown === void 0 ? void 0 : onShown(entry.target);
                }
                else {
                    onHidden === null || onHidden === void 0 ? void 0 : onHidden(entry.target);
                }
            });
        });
        var elements = document.querySelectorAll(selectors);
        elements.forEach(function (element) { return observer.observe(element); });
    }, [selectors, onShown, onHidden]);
};
exports.useOnEnterSection = useOnEnterSection;

"use strict";
exports.__esModule = true;
exports.Casher = void 0;
var Casher = /** @class */ (function () {
    /**
     * Create a new Cache instance.
     */
    function Casher(_a) {
        var name = _a.name, initialValue = _a.initialValue, prefix = _a.prefix;
        var _this = this;
        this.name = "".concat(prefix, "#").concat(name);
        this.storage = (window === null || window === void 0 ? void 0 : window.localStorage)
            ? window.localStorage
            : {
                getItem: function (key) {
                    var _a;
                    return (_a = _this.data) === null || _a === void 0 ? void 0 : _a[key];
                },
                setItem: function (key, value) {
                    _this.data[key] = value;
                },
                removeItem: function () {
                    delete _this.data;
                },
                clear: function () {
                    _this.data = {};
                }
            };
        /**
         * The initial value,
         */
        this.data = JSON.parse(this.storage.getItem(this.name) || JSON.stringify(initialValue));
        /**
         * Set data to localStorage.
         */
        if (!this.storage.getItem(this.name))
            this.storage.setItem(this.name, JSON.stringify(initialValue));
    }
    /**
     * Set a specific value to casher.
     */
    Casher.prototype.set = function (key, value) {
        this.data[key] = value;
        this.storage.setItem(this.name, JSON.stringify(this.data));
    };
    /**
     * Update cacher data.
     */
    Casher.prototype.update = function (values) {
        this.data = values;
        this.storage.setItem(this.name, JSON.stringify(values));
    };
    /**
     * Get a specific value from cacher.
     */
    Casher.prototype.get = function (key) {
        return key ? this.data[key] : this.data;
    };
    return Casher;
}());
exports.Casher = Casher;

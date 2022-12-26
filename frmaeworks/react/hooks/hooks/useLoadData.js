"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.useLoadData = void 0;
var react_1 = require("react");
var axios_1 = require("axios");
var prop_types_1 = require("prop-types");
/**
 *
 * @url => request url
 * @options => request options
 * @params => params to start requesting
 * @waitingParams => params that needs to wait for
 * @delay => delay to start requesting in case of waiting prams
 * @callBack => when data received or error occurred
 * @onChange => on something changes
 * @onHistoryChange => on props history changes
 * @condition => condition to start requesting
 * @maintainData => if we will keep the old data and append the new data
 * @uniqueData => if the data will be unique
 * @uniqueKey => if the data will be unique by a prop like id
 * @returns
 */
// Default props
var defaultProps = {
    callBack: function (err, data) {
        if (err) {
            console.error(err);
        }
    },
    condition: true,
    maintainData: false,
    uniqueData: true,
    useHistoryResults: false,
    uniqueKey: "id",
    clearHistoryAfter: 5 * 60 * 1000
};
function useLoadData(_a) {
    var _this = this;
    var url = _a.url, options = _a.options, params = _a.params, waitingParams = _a.waitingParams, delay = _a.delay, _b = _a.callBack, callBack = _b === void 0 ? defaultProps.callBack : _b, onChange = _a.onChange, onHistoryChange = _a.onHistoryChange, _c = _a.condition, condition = _c === void 0 ? defaultProps.condition : _c, _d = _a.maintainData, maintainData = _d === void 0 ? defaultProps.maintainData : _d, _e = _a.uniqueData, uniqueData = _e === void 0 ? defaultProps.uniqueData : _e, _f = _a.uniqueKey, uniqueKey = _f === void 0 ? defaultProps.uniqueKey : _f, _g = _a.useHistoryResults, useHistoryResults = _g === void 0 ? defaultProps.useHistoryResults : _g, _h = _a.clearHistoryAfter, clearHistoryAfter = _h === void 0 ? defaultProps.clearHistoryAfter : _h, onClearPropsHistory = _a.onClearPropsHistory;
    //
    var _j = (0, react_1.useState)(true), loading = _j[0], setLoading = _j[1];
    var _k = (0, react_1.useState)([]), data = _k[0], setData = _k[1];
    // Response Info
    var _l = (0, react_1.useState)(null), status = _l[0], setStatus = _l[1];
    var _m = (0, react_1.useState)(null), error = _m[0], setError = _m[1];
    // Timing
    var _o = (0, react_1.useState)(0), time = _o[0], setTime = _o[1];
    var _p = (0, react_1.useState)(0), requestTime = _p[0], setRequestTime = _p[1];
    // History
    var _q = (0, react_1.useState)([]), propsHistory = _q[0], setPropsHistory = _q[1];
    var currentProps = (0, react_1.useMemo)(function () { return ({
        url: url,
        params: params,
        waitingParams: waitingParams,
        delay: delay,
        condition: condition,
        callBack: callBack,
        onChange: onChange,
        data: data,
        status: status,
        error: error,
        expired: false
    }); }, [
        callBack,
        condition,
        data,
        delay,
        error,
        onChange,
        params,
        status,
        url,
        waitingParams,
    ]);
    var resetDefaults = function () {
        setLoading(true);
        if (!maintainData) {
            setData([]);
        }
        setStatus(null);
        setError(null);
        setTime(0);
        setRequestTime(0);
    };
    var updateItemInData = function (item) {
        return setData(data === null || data === void 0 ? void 0 : data.map(function (row) {
            return (row === null || row === void 0 ? void 0 : row[uniqueKey]) === (item === null || item === void 0 ? void 0 : item[uniqueKey]) ? item : row;
        }));
    };
    var replaceDataItem = function (key, keyValue, newValue) {
        return setData(function (data) {
            return data === null || data === void 0 ? void 0 : data.map(function (item) {
                return key
                    ? item[key] === keyValue
                        ? newValue
                        : item
                    : item === keyValue
                        ? newValue
                        : item;
            });
        });
    };
    var filterNotEmptyParams = function (params) {
        return Object.fromEntries(Object.entries(params).filter(function (_a) {
            var value = _a[1];
            return typeof value !== "undefined" &&
                value !== null &&
                (typeof value === "object"
                    ? ((Array.isArray(value) && value.length) ||
                        Object.keys(value).length) &&
                        value
                    : "" + value);
        }));
    };
    var getUniqueData = function (rows) {
        if (uniqueData) {
            if (rows && (rows === null || rows === void 0 ? void 0 : rows.length)) {
                if (uniqueKey) {
                    var uniqueRows_1 = [];
                    rows.forEach(function (row, index) {
                        Object.keys(row).forEach(function () {
                            if (Object.hasOwnProperty.call(row, uniqueKey)) {
                                if (!uniqueRows_1.some(function (uniqueRow) {
                                    return JSON.stringify(uniqueRow[uniqueKey]) ===
                                        JSON.stringify(row[uniqueKey]);
                                })) {
                                    uniqueRows_1.push(row);
                                }
                            }
                            else {
                                console.error("The object ".concat(row, " at the index ").concat(index, " of the data array does not contain the key \"").concat(uniqueKey, "\""));
                                uniqueRows_1.push(row);
                            }
                        });
                    });
                    return uniqueRows_1;
                }
                else {
                    return Array.from(new Set(rows));
                }
            }
            else {
                return rows;
            }
        }
        else {
            return rows;
        }
    };
    // Fetch Data
    var getData = function () { return __awaiter(_this, void 0, void 0, function () {
        var startDate, endRequest, historyData, filteredParams, res_1, _a, error_1, endDate;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startDate = new Date();
                    historyData = (useHistoryResults &&
                        propsHistory.find(function (row) {
                            return row.url === url &&
                                row.delay === delay &&
                                row.condition === condition &&
                                !row.expired &&
                                JSON.stringify(row.params) === JSON.stringify(params) &&
                                JSON.stringify(row.waitingParams) === JSON.stringify(waitingParams);
                        })) ||
                        undefined;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    if (!condition) return [3 /*break*/, 5];
                    filteredParams = {};
                    if (params || waitingParams) {
                        filteredParams = filterNotEmptyParams(__assign(__assign({}, params), waitingParams));
                    }
                    resetDefaults();
                    if (!historyData) return [3 /*break*/, 2];
                    _a = {
                        data: historyData.data,
                        status: historyData.status,
                        error: historyData.error
                    };
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].get(url, __assign({ params: filteredParams }, options))];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    res_1 = _a;
                    endRequest = new Date();
                    setRequestTime((endRequest.getTime() - startDate.getTime()) / 1000);
                    setData(function (data) {
                        var newData = maintainData
                            ? Array.isArray(data) && Array.isArray(res_1.data) && res_1.data
                                ? __spreadArray(__spreadArray([], data, true), res_1.data, true) : res_1.data
                            : res_1.data;
                        // Make Date unique
                        newData = uniqueData ? getUniqueData(newData) : newData;
                        if (callBack) {
                            // Callback Success
                            callBack(error, newData);
                        }
                        return newData;
                    });
                    if (res_1 === null || res_1 === void 0 ? void 0 : res_1.status) {
                        setStatus(res_1 === null || res_1 === void 0 ? void 0 : res_1.status);
                    }
                    _b.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _b.sent();
                    setError(error_1 === null || error_1 === void 0 ? void 0 : error_1.message);
                    // set data
                    setData(null);
                    if (callBack) {
                        callBack(error_1 === null || error_1 === void 0 ? void 0 : error_1.message, null);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    endDate = new Date();
                    setTime((endDate.getTime() - startDate.getTime()) / 1000);
                    return [2 /*return*/, {
                            loading: loading,
                            propsHistory: propsHistory,
                            data: data,
                            status: status,
                            error: error,
                            getData: getData,
                            filterNotEmptyParams: filterNotEmptyParams,
                            updateItemInData: updateItemInData,
                            replaceDataItem: replaceDataItem,
                            time: (endDate.getTime() - startDate.getTime()) / 1000,
                            requestTime: requestTime,
                            requestsCount: propsHistory.length
                        }];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        if (onHistoryChange)
            onHistoryChange(propsHistory);
    }, [JSON.stringify(propsHistory), onHistoryChange]);
    (0, react_1.useEffect)(function () { return setPropsHistory(__spreadArray(__spreadArray([], propsHistory, true), [currentProps], false)); }, [JSON.stringify(currentProps)]);
    // When props changes
    (0, react_1.useEffect)(function () {
        getData();
    }, [url, JSON.stringify(params)]);
    // When waiting changes
    (0, react_1.useEffect)(function () {
        var delayDebounceFn = setTimeout(function () {
            if ((propsHistory === null || propsHistory === void 0 ? void 0 : propsHistory.length) > 1) {
                getData();
            }
        }, delay || 1000);
        return function () { return clearTimeout(delayDebounceFn); };
    }, [JSON.stringify(waitingParams)]);
    // When change
    (0, react_1.useEffect)(function () {
        if (onChange) {
            onChange({
                loading: loading,
                propsHistory: propsHistory,
                data: data,
                setData: setData,
                status: status,
                error: error,
                getData: getData,
                replaceDataItem: replaceDataItem,
                updateItemInData: updateItemInData,
                filterNotEmptyParams: filterNotEmptyParams,
                time: time,
                requestTime: requestTime,
                requestsCount: propsHistory.length
            });
        }
    }, [
        loading,
        propsHistory,
        data,
        setData,
        status,
        error,
        getData,
        replaceDataItem,
        updateItemInData,
        filterNotEmptyParams,
        time,
        requestTime,
    ]);
    (0, react_1.useEffect)(function () {
        if (!clearHistoryAfter)
            return;
        var timeout = setTimeout(function () {
            setPropsHistory(function (propsHistory) { return __spreadArray([], propsHistory.map(function (row) { return (__assign(__assign({}, row), { expired: true })); }), true); });
            if (onClearPropsHistory)
                onClearPropsHistory(propsHistory, setPropsHistory);
        }, clearHistoryAfter);
        return function () {
            clearTimeout(timeout);
        };
    }, [clearHistoryAfter, onClearPropsHistory]);
    return {
        loading: loading,
        data: data,
        setData: setData,
        status: status,
        error: error,
        getData: getData,
        replaceDataItem: replaceDataItem,
        updateItemInData: updateItemInData,
        filterNotEmptyParams: filterNotEmptyParams,
        time: time,
        requestTime: requestTime,
        propsHistory: propsHistory,
        requestsCount: propsHistory.length
    };
}
exports.useLoadData = useLoadData;
// Props types
useLoadData.propTypes = {
    url: prop_types_1["default"].string.isRequired,
    options: prop_types_1["default"].object,
    params: prop_types_1["default"].object,
    waitingParams: prop_types_1["default"].object,
    delay: prop_types_1["default"].number,
    callBack: prop_types_1["default"].func,
    onChange: prop_types_1["default"].func,
    onHistoryChange: prop_types_1["default"].func,
    condition: prop_types_1["default"].bool,
    maintainData: prop_types_1["default"].bool,
    uniqueData: prop_types_1["default"].bool,
    uniqueKey: prop_types_1["default"].string,
    useHistoryResults: prop_types_1["default"].bool,
    clearHistoryAfter: prop_types_1["default"].number
};

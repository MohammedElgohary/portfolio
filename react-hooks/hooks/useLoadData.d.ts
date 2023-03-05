import React from "react";
export interface useLoadDataProps {
    url: string;
    options?: any;
    params?: any;
    waitingParams?: any;
    delay?: number;
    callBack?: (error?: any, data?: any) => void;
    onChange?: (object: object) => void;
    onHistoryChange?: (array: any[]) => void;
    onClearPropsHistory?: (propsHistory?: CurrentPropsInterface[], setPropsHistory?: React.Dispatch<React.SetStateAction<CurrentPropsInterface[]>>) => void;
    condition?: boolean;
    maintainData?: boolean;
    uniqueData?: boolean;
    uniqueKey?: string;
    useHistoryResults?: boolean;
    clearHistoryAfter?: number;
}
export interface CurrentPropsInterface {
    url: string;
    params?: any;
    waitingParams?: any;
    delay?: number;
    data?: any;
    status?: any;
    error?: any;
    callBack?: (error?: any, data?: any) => void;
    onChange?: (object: object) => void;
    condition?: boolean;
    expired?: boolean;
}
export declare function useLoadData({ url, options, params, waitingParams, delay, callBack, onChange, onHistoryChange, condition, maintainData, uniqueData, uniqueKey, useHistoryResults, clearHistoryAfter, onClearPropsHistory, }: useLoadDataProps): {
    loading: any;
    data: any;
    setData: any;
    status: any;
    error: any;
    getData: () => Promise<{
        loading: any;
        propsHistory: any;
        data: any;
        status: any;
        error: any;
        getData: any;
        filterNotEmptyParams: (params: any) => any;
        updateItemInData: (item: any) => void;
        replaceDataItem: (key: string, keyValue: any, newValue: any) => any;
        time: number;
        requestTime: any;
        requestsCount: any;
    }>;
    replaceDataItem: (key: string, keyValue: any, newValue: any) => any;
    updateItemInData: (item: any) => void;
    filterNotEmptyParams: (params: any) => any;
    time: any;
    requestTime: any;
    propsHistory: any;
    requestsCount: any;
};
export declare namespace useLoadData {
    var propTypes: {
        url: any;
        options: any;
        params: any;
        waitingParams: any;
        delay: any;
        callBack: any;
        onChange: any;
        onHistoryChange: any;
        condition: any;
        maintainData: any;
        uniqueData: any;
        uniqueKey: any;
        useHistoryResults: any;
        clearHistoryAfter: any;
    };
}

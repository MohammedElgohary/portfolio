import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import PropTypes from "prop-types";

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
const defaultProps = {
  callBack: (err: any, data: any) => {
    if (err) {
      console.error(err);
    }
  },
  condition: true,
  maintainData: false,
  uniqueData: true,
  useHistoryResults: false,
  uniqueKey: "id",
  clearHistoryAfter: 5 * 60 * 1000,
};

export interface useLoadDataProps {
  url: string;
  options?: any;
  params?: any;
  waitingParams?: any;
  delay?: number;
  callBack?: (error?: any, data?: any) => void;
  onChange?: (object: object) => void;
  onHistoryChange?: (array: any[]) => void;
  onClearPropsHistory?: (
    propsHistory?: CurrentPropsInterface[],
    setPropsHistory?: React.Dispatch<
      React.SetStateAction<CurrentPropsInterface[]>
    >
  ) => void;
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

export function useLoadData({
  url,
  options,
  params,
  waitingParams,
  delay,

  callBack = defaultProps.callBack,
  onChange,
  onHistoryChange,

  condition = defaultProps.condition,
  maintainData = defaultProps.maintainData,

  uniqueData = defaultProps.uniqueData,
  uniqueKey = defaultProps.uniqueKey,

  useHistoryResults = defaultProps.useHistoryResults,
  clearHistoryAfter = defaultProps.clearHistoryAfter,
  onClearPropsHistory,
}: useLoadDataProps) {
  //
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[] | any>([]);

  // Response Info
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<any>(null);

  // Timing
  const [time, setTime] = useState<number>(0);
  const [requestTime, setRequestTime] = useState<number>(0);

  // History
  const [propsHistory, setPropsHistory] = useState<CurrentPropsInterface[]>([]);

  const currentProps: CurrentPropsInterface = useMemo(
    () => ({
      url,
      params,
      waitingParams,
      delay,
      condition,
      callBack,
      onChange,
      data,
      status,
      error,
      expired: false,
    }),
    [
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
    ]
  );

  const resetDefaults = () => {
    setLoading(true);
    if (!maintainData) {
      setData([]);
    }
    setStatus(null);
    setError(null);
    setTime(0);
    setRequestTime(0);
  };

  const updateItemInData = (item: any): void =>
    setData(
      data?.map((row: any) =>
        row?.[uniqueKey] === item?.[uniqueKey] ? item : row
      )
    );

  const replaceDataItem = (key: string, keyValue: any, newValue: any) =>
    setData((data: any) =>
      data?.map((item: any) =>
        key
          ? item[key] === keyValue
            ? newValue
            : item
          : item === keyValue
          ? newValue
          : item
      )
    );

  const filterNotEmptyParams = (params: any) =>
    Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) =>
          typeof value !== "undefined" &&
          value !== null &&
          (typeof value === "object"
            ? ((Array.isArray(value) && value.length) ||
                Object.keys(value).length) &&
              value
            : "" + value)
      )
    );

  const getUniqueData = (rows: any) => {
    if (uniqueData) {
      if (rows && rows?.length) {
        if (uniqueKey) {
          let uniqueRows: any[] = [];

          rows.forEach((row: any, index: number) => {
            Object.keys(row).forEach(() => {
              if (Object.hasOwnProperty.call(row, uniqueKey)) {
                if (
                  !uniqueRows.some(
                    (uniqueRow) =>
                      JSON.stringify(uniqueRow[uniqueKey]) ===
                      JSON.stringify(row[uniqueKey])
                  )
                ) {
                  uniqueRows.push(row);
                }
              } else {
                console.error(
                  `The object ${row} at the index ${index} of the data array does not contain the key "${uniqueKey}"`
                );
                uniqueRows.push(row);
              }
            });
          });

          return uniqueRows;
        } else {
          return Array.from(new Set(rows));
        }
      } else {
        return rows;
      }
    } else {
      return rows;
    }
  };

  // Fetch Data
  const getData = async () => {
    let startDate = new Date();
    let endRequest;
    const historyData: CurrentPropsInterface | undefined | boolean =
      useHistoryResults &&
      propsHistory.find(
        (row) =>
          row.url === url &&
          row.delay === delay &&
          row.condition === condition &&
          !row.expired &&
          JSON.stringify(row.params) === JSON.stringify(params) &&
          JSON.stringify(row.waitingParams) === JSON.stringify(waitingParams)
      );

    try {
      if (condition) {
        let filteredParams = {};

        if (params || waitingParams) {
          filteredParams = filterNotEmptyParams({
            ...params,
            ...waitingParams,
          });
        }

        resetDefaults();

        let res = historyData
          ? {
              data: historyData.data,
              status: historyData.status,
              error: historyData.error,
            }
          : await axios.get(url, {
              params: filteredParams,
              ...options,
            });

        endRequest = new Date();

        setRequestTime((endRequest.getTime() - startDate.getTime()) / 1000);

        setData((data: any) => {
          let newData = maintainData
            ? Array.isArray(data) && Array.isArray(res.data) && res.data
              ? [...data, ...res.data]
              : res.data
            : res.data;

          // Make Date unique
          newData = uniqueData ? getUniqueData(newData) : newData;

          if (callBack) {
            // Callback Success
            callBack(error, newData);
          }
          return newData;
        });

        if (res?.status) {
          setStatus(res?.status);
        }
      }
    } catch (error: any) {
      setError(error?.message);

      // set data
      setData(null);

      if (callBack) {
        callBack(error?.message, null);
      }
    } finally {
      setLoading(false);
      let endDate = new Date();

      setTime((endDate.getTime() - startDate.getTime()) / 1000);

      return {
        loading,
        propsHistory,
        data,
        status,
        error,
        getData,
        filterNotEmptyParams,
        updateItemInData,
        replaceDataItem,
        time: (endDate.getTime() - startDate.getTime()) / 1000,
        requestTime,
        requestsCount: propsHistory.length,
      };
    }
  };

  useEffect(() => {
    if (onHistoryChange) onHistoryChange(propsHistory);
  }, [JSON.stringify(propsHistory), onHistoryChange]);

  useEffect(
    () => setPropsHistory([...propsHistory, currentProps]),
    [JSON.stringify(currentProps)]
  );

  // When props changes
  useEffect(() => {
    getData();
  }, [url, JSON.stringify(params)]);

  // When waiting changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (propsHistory?.length > 1) {
        getData();
      }
    }, delay || 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [JSON.stringify(waitingParams)]);

  // When change
  useEffect(() => {
    if (onChange) {
      onChange({
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
        requestsCount: propsHistory.length,
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

  useEffect(() => {
    if (!clearHistoryAfter) return;

    const timeout: NodeJS.Timer = setTimeout(() => {
      setPropsHistory((propsHistory: CurrentPropsInterface[]) => [
        ...propsHistory.map((row) => ({ ...row, expired: true })),
      ]);

      if (onClearPropsHistory)
        onClearPropsHistory(propsHistory, setPropsHistory);
    }, clearHistoryAfter);

    return () => {
      clearTimeout(timeout);
    };
  }, [clearHistoryAfter, onClearPropsHistory]);

  return {
    loading,
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
    propsHistory,
    requestsCount: propsHistory.length,
  };
}

// Props types
useLoadData.propTypes = {
  url: PropTypes.string.isRequired,
  options: PropTypes.object,
  params: PropTypes.object,
  waitingParams: PropTypes.object,
  delay: PropTypes.number,
  callBack: PropTypes.func,
  onChange: PropTypes.func,
  onHistoryChange: PropTypes.func,
  condition: PropTypes.bool,
  maintainData: PropTypes.bool,
  uniqueData: PropTypes.bool,
  uniqueKey: PropTypes.string,
  useHistoryResults: PropTypes.bool,
  clearHistoryAfter: PropTypes.number,
};

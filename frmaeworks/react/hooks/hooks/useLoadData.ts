import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export interface IUseLoadData {
  url: string;
  options?: object;
  params?: object;
  waitingParams?: object;
  delay?: number;

  callBack?: (error?: any, data?: any[]) => void;
  onChange?: (obj: object) => void;
  onHistoryChange?: (obj: object) => void;

  condition?: boolean;
  maintainData?: boolean;

  uniqueData?: boolean;
  uniqueKey?: string;
}

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

const useLoadData = ({
  url,
  options,
  params,
  waitingParams,
  delay,

  callBack,
  onChange,
  onHistoryChange,

  condition = true,
  maintainData = false,

  uniqueData = true,
  uniqueKey = "id",
}: IUseLoadData) => {
  const [propsHistory, setPropsHistory] = useState<any[]>([]);

  const currentProps = useMemo(
    () => ({
      url,
      params,
      callBack,
      onChange,
      waitingParams,
      delay,
      condition,
    }),
    [url, params, callBack, onChange, waitingParams, delay, condition]
  );

  useEffect(() => {
    if (onHistoryChange) {
      onHistoryChange(propsHistory);
    }
  }, [onHistoryChange, propsHistory]);

  useEffect(() => {
    setPropsHistory([...propsHistory, currentProps]);
  }, [currentProps, propsHistory]);

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [time, setTime] = useState<number>(0);
  const [requestTime, setRequestTime] = useState<number>(0);

  const resetDefaults = useCallback(() => {
    return () => {
      setLoading(true);
      if (!maintainData) {
        setData([]);
      }
      setStatus(null);
      setError(null);
      setTime(0);
      setRequestTime(0);
    };
  }, [maintainData]);

  const findItemAndUpdate = useCallback(
    (item: any) => {
      console.log("Initializing findItemAndUpdate");

      return setData((data: any[]) =>
        data?.map((row) =>
          row?.[uniqueKey] === item?.[uniqueKey] ? item : row
        )
      );
    },
    [uniqueKey]
  );

  const replaceDataItem = useCallback(
    (key: string, value: any, newValue: any) => {
      console.log("Initializing replaceDataItem");

      setData((data: any[]) => {
        if (key)
          return data?.map((row) => (row[key] === value ? newValue : row));

        return data?.map((row) => (row === value ? newValue : row));
      });
    },
    []
  );

  const filterNotEmptyParams = useCallback((params: any) => {
    console.log("Initializing filterNotEmptyParams");

    return Object.fromEntries(
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
  }, []);

  const getUniqueData = useCallback(
    (data: any[]) => {
      console.log("Initializing getUniqueData");
      if (uniqueData) {
        if (data && data?.length) {
          if (uniqueKey) {
            let uniqueRows: any[] = [];

            data.forEach((object, index) => {
              Object.keys(object).forEach(() => {
                if (Object.hasOwnProperty.call(object, uniqueKey)) {
                  if (
                    !uniqueRows.some(
                      (row) => row[uniqueKey] === object[uniqueKey]
                    )
                  ) {
                    uniqueRows.push(object);
                  }
                }

                console.error(
                  `The object ${object} at the index ${index} of the data array does not contain the key "${uniqueKey}"`
                );

                uniqueRows.push(object);
              });
            });
            return uniqueRows;
          }
          return Array.from(new Set(data));
        }
        return data;
      }
      return data;
    },
    [uniqueData, uniqueKey]
  );

  // Fetch Data
  const getData = useCallback(() => {
    console.log("Initializing getData");

    return async () => {
      let startDate: Date = new Date();
      let endRequest: Date;
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

          let res = await axios?.get(url, {
            params: filteredParams,
            ...options,
          });

          endRequest = new Date();

          setRequestTime((endRequest.getTime() - startDate.getTime()) / 1000);

          let responseData = maintainData
            ? getUniqueData([...data, ...res?.data])
            : res?.data;

          setData(responseData);
          // Callback Success
          if (callBack) {
            callBack(error, responseData);
          }

          if (res?.status) {
            setStatus(res.status);
          }
        }
      } catch (error: any) {
        setError(error?.message);

        // set data
        setData([]);

        if (callBack) {
          callBack(error?.message, data);
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
          findItemAndUpdate,
          replaceDataItem,
          time: (endDate.getTime() - startDate.getTime()) / 1000,
          requestTime,
        };
      }
    };
  }, [
    callBack,
    condition,
    data,
    error,
    filterNotEmptyParams,
    findItemAndUpdate,
    getUniqueData,
    loading,
    maintainData,
    options,
    params,
    propsHistory,
    replaceDataItem,
    requestTime,
    resetDefaults,
    status,
    url,
    waitingParams,
  ]);

  // When props changes
  useEffect(() => {
    getData();
  }, [getData, url]);

  // When waiting changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (propsHistory?.length > 1) {
        getData();
      }
    }, delay || 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [delay, getData, propsHistory?.length]);

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
        findItemAndUpdate,
        filterNotEmptyParams,
        time,
        requestTime,
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
    findItemAndUpdate,
    filterNotEmptyParams,
    time,
    requestTime,
    onChange,
  ]);

  return {
    loading,
    data,
    setData,
    status,
    error,
    getData,
    replaceDataItem,
    findItemAndUpdate,
    filterNotEmptyParams,
    time,
    requestTime,
    propsHistory,
  };
};

// Default props
useLoadData.defaultProps = {
  options: null,
  params: null,
  waitingParams: null,
  delay: 0,
  callBack: (err: any, data: any[]) => {
    if (err) {
      console.error(err);
    }
  },
  onChange: (obj: any) => {},
  onHistoryChange: (obj: any) => {},
  condition: true,
  maintainData: false,
  uniqueData: false,
  uniqueKey: "",
};

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
};

export { useLoadData };

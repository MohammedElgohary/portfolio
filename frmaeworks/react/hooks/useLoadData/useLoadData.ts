import { useState, useEffect } from "react";
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

export interface useLoadDataProps {
  url: string;
  options?: any;
  params?: any;
  waitingParams?: any;
  delay?: number;
  callBack?: (error?: any, data?: any[]) => void;
  onChange?: (object: object) => void;
  onHistoryChange: (array: any[]) => void;
  condition?: boolean;
  maintainData?: boolean;
  uniqueData?: boolean;
  uniqueKey?: string;
}

export interface CurrentPropsInterface {
  url: string;
  params?: any;
  waitingParams?: any;
  delay?: number;
  callBack?: (error?: any, data?: any[]) => void;
  onChange?: (object: object) => void;
  condition?: boolean;
}

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
  maintainData,
  uniqueData,
  uniqueKey = "id",
}: useLoadDataProps) => {
  const [propsHistory, setPropsHistory] = useState<CurrentPropsInterface[]>([]);

  const currentProps: CurrentPropsInterface = {
    url,
    params,
    callBack,
    onChange,
    waitingParams,
    delay,
    condition,
  };

  useEffect(() => {
    if (onHistoryChange) onHistoryChange(propsHistory);
  }, [JSON.stringify(propsHistory)]);

  useEffect(
    () => setPropsHistory([...propsHistory, currentProps]),
    [JSON.stringify(currentProps)]
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[] | any>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [page, setPage] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [time, setTime] = useState<number>(0);
  const [requestTime, setRequestTime] = useState<number>(0);

  const resetDefaults = (): void => {
    setLoading(true);
    if (!maintainData) {
      setData([]);
    }
    setStatus(null);
    setError(null);
    setPageCount(null);
    setLimit(null);
    setPage(null);
    setTotalCount(null);
    setTime(0);
    setRequestTime(0);
  };

  const updateItemInData = (item: any): void =>
    setData(
      data?.map((object: any) =>
        object?.[uniqueKey] === item?.[uniqueKey] ? item : object
      )
    );

  const replaceDataItem = (key: string, value: any, newValue: any) => {
    if (!data?.length) return;

    setData((data: any) =>
      data?.map((item: any) =>
        key
          ? item[key] === value
            ? newValue
            : item
          : item === value
          ? newValue
          : item
      )
    );
  };

  const filterNotEmptyParams = (params) => {
    if (params) {
      return Object?.fromEntries(
        Object?.entries(params)?.filter(([key, value]) => {
          if (value) {
            return typeof value === "object"
              ? (value?.length || Object?.keys(value)?.length) && value
              : "" + value;
          }
        })
      );
    }
  };

  const getUniqueData = (data) => {
    if (uniqueData) {
      if (data && data?.length) {
        if (uniqueKey) {
          let uniqueArr = [];
          data.forEach((object, index) => {
            for (const k in object) {
              if (Object.hasOwnProperty.call(object, uniqueKey)) {
                if (
                  !uniqueArr.some((x) => x[uniqueKey] === object[uniqueKey])
                ) {
                  uniqueArr.push(object);
                }
              } else {
                console.error(
                  `The object ${object} at the index ${index} of the data array does not contain the key "${uniqueKey}"`
                );
                uniqueArr.push(object);
              }
            }
          });

          return uniqueArr;
        } else {
          return Array.from(new Set(data));
        }
      } else {
        return data;
      }
    } else {
      return data;
    }
  };

  // Fetch Data
  const getData = async () => {
    let startDate = new Date();
    let endRequest;
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

        setRequestTime((endRequest - startDate) / 1000);

        // Required Section
        if (res?.data) {
          if (res?.data?.data) {
            /* the data with the rules
              *- maintainData ==> it saves the old data and append the new data to our data array,

              *- uniqueData ==> it defines if the data will be unique or not ,

              *- uniqueKey ==> it defines if the data will be unique with a specific prop like [id],

            */
            const dataTarget = getUniqueData(
              maintainData ? [...data, ...res?.data?.data] : res?.data?.data
            );

            setData(dataTarget);

            if (callBack) {
              // Callback Success
              callBack(error, dataTarget);
            }

            // Paganation
            if (res?.data?.page) {
              setPage(res?.data?.page);
            }

            if (res?.data?.pageCount) {
              setPageCount(res?.data?.pageCount);
            }

            if (res?.data?.totalCount) {
              setTotalCount(res?.data?.totalCount);
            }

            if (res?.data?.limit) {
              setLimit(res?.data?.limit);
            }
          } else {
            setData(maintainData ? [...data, ...res?.data] : res?.data);
            if (callBack) {
              // Callback Success
              let _callbackData = maintainData
                ? [...data, ...res?.data]
                : res?.data;
              callBack(error, _callbackData);
            }
          }
        }

        if (res?.status) {
          setStatus(res?.status);
        }
      }
    } catch (error) {
      setError(error?.message);

      // set data
      setData(null);

      if (callBack) {
        callBack(error?.message, data);
      }
    } finally {
      setLoading(false);
      let endtDate = new Date();

      setTime((endtDate - startDate) / 1000);

      return {
        loading,
        propsHistory,
        data,
        status,
        error,
        pageCount,
        limit,
        page,
        totalCount,
        getData,
        filterNotEmptyParams,
        updateItemInData,
        replaceDataItem,
        time: (endtDate - startDate) / 1000,
        requestTime,
      };
    }
  };

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
        pageCount,
        limit,
        page,
        totalCount,
        getData,
        replaceDataItem,
        updateItemInData,
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
    pageCount,
    limit,
    page,
    totalCount,
    getData,
    replaceDataItem,
    updateItemInData,
    filterNotEmptyParams,
    time,
    requestTime,
  ]);

  return {
    loading,
    data,
    setData,
    status,
    error,
    pageCount,
    limit,
    page,
    totalCount,
    getData,
    replaceDataItem,
    updateItemInData,
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
  callBack: (err, data) => {
    if (err) {
      console.error(err);
    }
  },
  onChange: (obj) => {},
  onHistoryChange: (obj) => {},
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

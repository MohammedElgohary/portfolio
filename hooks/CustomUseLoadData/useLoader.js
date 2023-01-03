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

const useLoadData = ({
  url,
  options,
  params,
  waitingParams,
  delay,

  callBack,
  onChange,
  onHistoryChange,

  condition,
  maintainData,

  uniqueData,
  uniqueKey,
}) => {
  const [propsHistory, setPropsHistory] = useState([]);

  const currentProps = {
    url,
    params,
    callBack,
    onChange,
    waitingParams,
    delay,
    condition,
  };

  useEffect(() => {
    if (onHistoryChange) {
      onHistoryChange(propsHistory);
    }
  }, [JSON.stringify(propsHistory)]);

  useEffect(() => {
    setPropsHistory([...propsHistory, currentProps]);
  }, [JSON.stringify(currentProps)]);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(0);
  const [requestTime, setRequestTime] = useState(0);

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

  // set the default true condition
  if (typeof condition === "undefined") {
    condition = true;
  }

  // set the default true uniqueData
  if (typeof uniqueData === "undefined") {
    uniqueData = true;
  }

  // set the default id to uniqueKey
  if (typeof uniqueKey === "undefined") {
    uniqueKey = "id";
  }

  const findItemAndUpdate = (item) => {
    setData(
      data?.map((ownData) =>
        ownData?.[uniqueKey] === item?.[uniqueKey] ? item : ownData
      )
    );
  };

  const replaceDataItem = (key, value, newValue) => {
    if (data?.length) {
      if (key) {
        setData(data?.map((ele) => (ele[key] === value ? newValue : ele)));
      } else {
        setData(data?.map((ele) => (ele === value ? newValue : ele)));
      }
    }
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
              }
              console.error(
                `The object ${object} at the index ${index} of the data array does not contain the key "${uniqueKey}"`
              );
              uniqueArr.push(object);
            }
          });
          return uniqueArr;
        }
        return Array.from(new Set(data));
      }
      return data;
    }
    return data;
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

        let responseData = maintainData
          ? getUniqueData([...data, ...res?.data])
          : res?.data;

        setData(responseData);
        // Callback Success
        if (callBack) {
          callBack(error, responseData);
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
      let endDate = new Date();

      setTime((endDate - startDate) / 1000);

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
        time: (endDate - startDate) / 1000,
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

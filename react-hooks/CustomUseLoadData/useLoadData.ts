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

export interface useLoadDataProps {
  url: string;
  options?: any;
  params?: any;
  waitingParams?: any;
  delay?: number;
  callBack?: (error?: any, data?: any) => void;
  onChange?: (object: object) => void;
  onHistoryChange?: (array: any[]) => void;
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
  callBack?: (error?: any, data?: any) => void;
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
  maintainData = false,

  uniqueData = true,
  uniqueKey = "id",
}: useLoadDataProps) => {
  //
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[] | any>([]);

  // Response Info
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<any>(null);

  // Pagination
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [page, setPage] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Timing
  const [time, setTime] = useState<number>(0);
  const [requestTime, setRequestTime] = useState<number>(0);

  // History
  const [propsHistory, setPropsHistory] = useState<CurrentPropsInterface[]>([]);

  const currentProps: CurrentPropsInterface = useMemo(
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

  const resetDefaults = () => {
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
                    (uniqueRow) => uniqueRow[uniqueKey] === row[uniqueKey]
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

            // Pagination
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
            setData((data: any) => {
              const newData = maintainData
                ? [...data, ...res?.data]
                : res?.data;

              if (callBack) {
                // Callback Success
                callBack(error, newData);
              }
              return newData;
            });
          }
        }

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
        pageCount,
        limit,
        page,
        totalCount,
        getData,
        filterNotEmptyParams,
        updateItemInData,
        replaceDataItem,
        time: (endDate.getTime() - startDate.getTime()) / 1000,
        requestTime,
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
  callBack: (err: any, data: any) => {
    if (err) {
      console.error(err);
    }
  },
  onChange: (obj: any) => {},
  onHistoryChange: (obj: any) => {},
  condition: true,
  maintainData: false,
  uniqueData: true,
  uniqueKey: "id",
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

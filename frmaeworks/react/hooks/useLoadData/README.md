# useLoadData
## It's a `React JS` `custom hook`

## Requirements
  * `react`
  * `axios`
  * `prop-types`

## Usage

```javascript

const {
    // data
    data,

    // control data
    setData,
    replaceDataItem, // it takes a key, value and newValue of an item in the data object and when any item has this key and its value is the value it replace it with the newValue
    updateItemInData,// it receives an object of a new value that must has an id key or the uniqueKey parameter as a key in this object and replace it in the data array depends on the uniqueKey parameter

    // loading and error
    loading,
    error,
    status,

    // pagination
    pageCount,
    limit,
    page,
    totalCount,

    // reload data
    getData,

    // helping function to filter empty keys in an object
    filterNotEmptyParams,

    // timing
    time,
    requestTime,

    // prams history
    propsHistory,
  } = useLoadData({
  url: "...",
  options: {},
  params: {},
  waitingParams: {},
  delay: 1000,
  uniqueKey: "id"
  condition: true === true,
  maintainData: true, // [...oldData, ...newData]
  uniqueData: true, // to make the  data unique
  onChange: paramsObj => console.log(paramsObj),
  onHistoryChange: propsHistory => console.log(propsHistory),
  callBack: (err, data) => {
    // on error
    if(err) return console.error(err);

    // control the data after it loads
    console.log(data);
    // setComingData(data);
  },
});
```
# useTimer

## It's a `React JS` `custom hook`

## Requirements

- `axios`
- `prop-types`

## Usage

```javascript
const { start, stop, reset, displayedTime } = useTimer({
  duration: 1, // Duration in minutes
  callback: () => {
    alert("timer is done");
  }, // Callback when the timer finished
  delay: 1000, // The timer speed || Decrement time
});
```

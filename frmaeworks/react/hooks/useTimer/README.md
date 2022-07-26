# useTimer

## It's a `React JS` `custom hook` and countdown timer for some minutes, and when the time expires, a certain action occurs and allows you to start counting, pause, restart and stop, and gives you the current remaining time and the status of the counter is stopped or working. Is the counter starting for the first time to control the pause of the counter

## Requirements

- `axios`
- `prop-types`

## Features

- Start, Stop, Rest, Pause, Play.
- Show the current remaining time.
- Is timer Paused / Running.
- First Launch to control the pause/play if needed.
- Returns the actual Timer and the timerStatus for testing purposes.

## Usage

```javascript
const {
  start,
  stop,
  reset,
  pause,
  paused,
  displayedTime,
  firstLaunch,
  timer,
  timerStatus,
} = useTimer({
  duration: 1, // Duration in minutes
  callback: () => {
    alert("timer is done");
  }, // Callback when the timer finish
  delay: 1000, // The timer speed || Decrement time
});
```

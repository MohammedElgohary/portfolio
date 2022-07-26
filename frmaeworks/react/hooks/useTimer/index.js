import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const useTimer = ({ duration, callback, delay }) => {
  const timer = useRef(null);
  const timerStatus = useRef(false);

  const [displayedTime, setDisplayedTime] = useState("00:00:00");
  const [paused, setPaused] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(false);

  delay = delay || 1000;

  const padLeft = (num, digits = 2, str = "0") =>
    Array(digits - String(num).length + 1).join(str) + num;

  const convertTime = (time) => {
    let hours = Math.floor(time / 60),
      minutes = time % 60;

    return `${padLeft(hours)}:${padLeft(minutes)}:00`;
  };

  const start = () => {
    if (timer.current) {
      stop();
    }

    setFirstLaunch(true);
    timerStatus.current = true;
    setPaused(false);

    let [hours, minutes, seconds] = convertTime(duration)
      ?.split(":")
      ?.map((e) => parseInt(e));

    timer.current = setInterval(() => {
      if (timerStatus.current) {
        // decrement seconds
        if (seconds > 0) {
          seconds--;
        }

        if (seconds === 0 && minutes > 0) {
          minutes--;
          seconds = 59;
        }

        if (minutes === 0 && hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        // if the seconds, minutes and hours is less than 0 then stop the timer
        if (hours <= 0 && minutes <= 0 && seconds <= 0) {
          clearInterval(timer.current);
          if (callback) {
            callback();
          }
        }

        // update displayed time
        setDisplayedTime(
          `${padLeft(hours)}:${padLeft(minutes)}:${padLeft(seconds)}`
        );
      }
    }, delay);
  };

  const stop = () => {
    timerStatus.current = false;
    setPaused(true);
    clearInterval(timer.current);
  };

  const reset = () => {
    clearInterval(timer.current);
    setDisplayedTime("00:00:00");
    start();
  };

  const pause = () => {
    if (firstLaunch) {
      setPaused(!timerStatus.current);
      timerStatus.current = !timerStatus.current;
    }
  };

  useEffect(() => {
    setDisplayedTime(convertTime(duration));
  }, [duration]);

  return {
    start,
    stop,
    reset,
    pause,
    paused,
    displayedTime,
    firstLaunch,

    // for testing
    timer,
    timerStatus,
  };
};

useTimer.propTypes = {
  duration: PropTypes.number.isRequired,
  callback: PropTypes.func,
  delay: PropTypes.number,
};

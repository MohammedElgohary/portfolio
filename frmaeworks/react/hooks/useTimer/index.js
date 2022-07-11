import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const useTimer = ({ duration, callback, delay }) => {
  const timer = useRef();
  const [displayedTime, setDisplayedTime] = useState("00:00:00");

  delay = delay || 1000;

  const convertTime = (time) => {
    let hours = Math.floor(time / 60),
      minutes = time % 60;

    return `${hours}:${minutes}:00`;
  };

  const start = () => {
    if (timer.current) {
      stop();
    }

    let [hours, minutes, seconds] = convertTime(duration)
      ?.split(":")
      ?.map((e) => parseInt(e));

    timer.current = setInterval(() => {
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
      setDisplayedTime(`${hours}:${minutes}:${seconds}`);
    }, delay);
  };

  const stop = () => clearInterval(timer.current);

  const reset = () => {
    clearInterval(timer.current);
    setDisplayedTime("00:00:00");
    start();
  };

  useEffect(() => {
    setDisplayedTime(convertTime(duration));
  }, [duration]);

  return {
    start,
    stop,
    reset,
    displayedTime,
  };
};

useTimer.propTypes = {
  duration: PropTypes.number.isRequired,
  callback: PropTypes.func,
  delay: PropTypes.number,
};

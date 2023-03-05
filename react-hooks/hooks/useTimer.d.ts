export interface IUseTimerProps {
    duration: number;
    callback?: () => void;
    delay?: number;
    isMilSeconds?: boolean;
    onChange?: (obj: any) => void;
    onReset?: () => void;
}
export declare function useTimer({ callback, delay, isMilSeconds, duration, onChange, onReset, }: IUseTimerProps): {
    start: any;
    stop: any;
    reset: any;
    pause: () => void;
    paused: any;
    firstLaunch: any;
    started: any;
    passedTime: any;
    restTime: any;
    countingDown: {
        display: any;
        hours: any;
        minutes: any;
        seconds: any;
    };
    countingUp: {
        display: any;
        hours: any;
        minutes: any;
        seconds: any;
    };
    msToHMS: any;
    minToHMS: any;
    timer: any;
    timerStatus: any;
};

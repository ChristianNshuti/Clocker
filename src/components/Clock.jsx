import { useState, useEffect, useRef } from "react";
import music_alarm from "../audio/musical_alarm.mp3";
import "./Clock.css"

export default function Clock() {
    const [time,setTime] = useState(new Date());
    const [timezone,setTimezone] = useState("Africa/Kigali");

    const [alarmTime,setAlarmTime] = useState("");
    const [isAlarmSet,setIsAlarmSet] = useState(false);
    const [isRinging,setIsRinging] = useState(false);

    const [stopwatchTime,setStopwatchTime] = useState(0);
    const [isRunning,setIsRunning] = useState(false);
    const stopwatchRef = useRef(null);

    const [timerTime,setTimertime] = useState(0);
    const [timerInput,setTimerInput] = useState("");
    const [isTimerRunning,setIsTimerRunning] = useState(false);
    const timerRef = useRef(null);

    const [activeTab,setActiveTab] = useState("clock");

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isAlarmSet && alarmTime) {
            const current = new Intl.DateTimeFormat([], {
                hour:"2-digit",
                minute:"2-digit",
                hour12:false,
                timeZone:timezone,
            }).format(time);

            if (current === alarmTime) {
                setIsRinging(true);
                setIsAlarmSet(false);

                const audio = new Audio(music_alarm);
                audio.loop = true;     // Keep ringing
                audio.play();
                window.alarmSound = audio; 
            }
        }
    }, [time, alarmTime, isAlarmSet, timezone]);

const dismissAlarm = () => {
    setIsRinging(false);
    if (window.alarmSound) {
        window.alarmSound.pause();
        window.alarmSound.currentTime = 0;
    }
};

const snoozeAlarm = () => {
    dismissAlarm();

    // Add 5 minutes to current time
    const newTime = new Date(time.getTime() + 5 * 60 * 1000);

    const snoozeTime = new Intl.DateTimeFormat([], {
        hour:"2-digit",
        minute:"2-digit",
        hour12:false,
        timeZone:timezone,
    }).format(newTime);

    setAlarmTime(snoozeTime);
    setIsAlarmSet(true);
};

    
    const startStopwatch = () => {
        if(!isRunning) {
            setIsRunning(true);
            const startTime = Date.now() - stopwatchTime;
            stopwatchRef.current = setInterval(() => {
                setStopwatchTime(Date.now() - startTime);
            }, 10);
        }
    };
    const stopStopwatch = () => {
        clearInterval(stopwatchRef.current);
        setIsRunning(false);
    };

    const resetStopwatch = () => {
        clearInterval(stopwatchRef.current);
        setStopwatchTime(0);
        setIsRunning(false);
    };

    const formatStopwatch = (ms) => {
        const milliseconds = Math.floor((ms % 1000) / 10);
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 60000) % 60);
        const hours = Math.floor(ms/3600000);
        return `${hours.toString().padStart(2,"0")}:${minutes
            .toString()
            .padStart(2,"0")}:${seconds.toString().padStart(2,"0")}.${milliseconds
                .toString()
                .padStart(2,"0")
            }`;
    }

    const startTimer = () => {
        if(!isTimerRunning && timerTime > 0) {
            setIsTimerRunning(true);
            const endTime = Date.now() + timerTime;
            timerRef.current = setInterval(() => {
                const remaining = endTime - Date.now();
                if(remaining <=0) {
                    clearInterval(timerRef.current);
                    setIsTimerRunning(false);
                    setTimertime(0);
                    alert("Time finished");
                    new Audio(music_alarm).play();
                } else {
                    setTimertime(remaining);
                }
            },100);
        }
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
    };

    const resetTimer = () => {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
        setTimertime(0);
    };

    const formatTimer = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600);
        return `${hours.toString().padStart(2,"0")}:${minutes
            .toString()
            .padStart(2,"0")
        }:${seconds.toString().padStart(2,"0")}`;
    };

    return (
        <div className="clock-container">
            <div className="tabs">
                <button className={activeTab === "clock" ? "active" : ""}
                onClick={() => setActiveTab("clock")}
                >
                    Clock
                </button>
                <button className={activeTab === "alarm" ? "active" : ""}
                onClick={() => setActiveTab("alarm")}>
                    Alarm
                </button>
                <button className={activeTab === "stopwatch" ? "active" : ""}
                onClick={() => setActiveTab("timer")}
                >
                    Timer
                </button>
            </div>

            {activeTab === "clock" && (
                <>
                    <h1 className="clock-time">{new Intl.DateTimeFormat([], {hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false,timeZone:timezone}).format(time)}</h1>
                    <p className="clock-date">{new Intl.DateTimeFormat([], {weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:timezone}).format(time)}</p>
                    <div className="timezone-selector">
                        <label>Select Timezone:</label>
                        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                            <option value="Africa/Kigali">Kigali</option>
                            <option value="Europe/London">London</option>
                            <option value="America/New_York">New York</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                            <option value="Australia/Sydney">Sydney</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Dubai">Dubai</option>
                        </select>
                    </div>
                </>
            )}

            {activeTab === "alarm" && (
                <div className="alarm-section">
                    <label>Set Alarm:</label>
                    <input 
                        type="time" 
                        value={alarmTime} 
                        onChange={(e) => setAlarmTime(e.target.value)} 
                    />

                    <button 
                        onClick={() => { 
                            if (alarmTime) setIsAlarmSet(true);
                        }}
                    >
                        Set Alarm
                    </button>
                    {isAlarmSet && (
                        <p className="current-alarm">
                            ⏰ Alarm set for: <strong>{alarmTime}</strong>
                        </p>
                    )}


                    {isRinging && (
                        <div className="alarm-controls">
                            <button onClick={dismissAlarm}>Dismiss</button>
                            <button onClick={snoozeAlarm}>Snooze 5 min</button>
                        </div>
                    )}
                </div>
            )}


            {activeTab === "stopwatch" && (
                <div className="stopwatch">
                    <h1 className="stopwatch-time">{formatStopwatch(stopwatchTime)}</h1>
                    <button onClick={isRunning ? stopStopwatch : startStopwatch}>{isRunning ? "Pause" : "Start"}</button>
                    <button onClick={resetStopwatch}>Reset</button>
                </div>
            )}

            {activeTab === "timer" && (
                <div className="timer">
                    <h1 className="timer-time">{formatTimer(timerTime)}</h1>
                    <input 
                        type="text"
                        placeholder="Enter seconds"
                        value={timerInput}
                        onChange={(e) => setTimerInput(e.target.value)}
                    />
                    <button onClick={() => { setTimertime(Number(timerInput) * 1000); setTimerInput(""); }}>Set</button>
                    <button onClick={startTimer} disabled={isTimerRunning}>Start</button>
                    <button onClick={stopTimer}>Stop</button>
                    <button onClick={resetTimer}>Reset</button>
                </div>
            )}
        </div>
    )
}
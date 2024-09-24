import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useBrewStep } from './BrewStepContext';

export default function TimerDisplay() {
  const { 
    timeRemaining, 
    currentStep, 
    timerState, 
    setTimeRemaining, 
    handleTimerEnd,
    autoNextStep 
  } = useBrewStep();

  const { progressValue } = useSpring({
    progressValue: currentStep.time ? 1 - (timeRemaining / currentStep.time) : 0,
    config: { duration: 200 }
  });

  useEffect(() => {
    let interval;
    if (currentStep.time && timerState === 'running' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time > 1) return time - 1;
          if (time === 1) {
            clearInterval(interval);
            handleTimerEnd();
            return 0;
          }
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState, timeRemaining, setTimeRemaining, handleTimerEnd, currentStep.time]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentStep.time) {
    return (
      <div className=" relative text-center w-40 h-40 mx-auto text-xl font-bold mt-6">
        This step has no timer. {autoNextStep ? 'Proceed when ready.' : 'Press next when ready.'}
      </div>
    );
  }

  return (
    <div className="relative w-40 h-40 mx-auto mt-6">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#e2e8f0"
          strokeWidth="10"
          fill="none"
        />
        <animated.circle
          cx="50"
          cy="50"
          r="45"
          stroke="#4299e1"
          strokeWidth="10"
          fill="none"
          strokeDasharray={283}
          strokeDashoffset={progressValue.to(v => 283 * v)}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
}
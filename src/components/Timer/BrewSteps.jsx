import React, { useState, useEffect } from 'react';

export default function TimerBrewStep({ step, onNextStep }) {
    const [timeRemaining, setTimeRemaining] = useState(step.time);

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeRemaining]);

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Brew Step</h2>
            <p>{step.description}</p>
            <p>Time remaining: {timeRemaining} seconds</p>
            {timeRemaining === 0 && (
                <button
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                    onClick={onNextStep}
                >
                    Continue
                </button>
            )}
        </div>
    );
}

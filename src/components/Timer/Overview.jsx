import React from 'react';

export default function TimerOverview({ userInput, calculatedValue, inputType, onStartBrew }) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p>Your selected {inputType === 'coffeeAmount' ? 'coffee amount' : 'brew volume'}: {userInput}</p>
            <p>
                {inputType === 'coffeeAmount' ? (
                    <>Calculated Brew Volume: {calculatedValue} mL</>
                ) : (
                    <>Calculated Coffee Amount: {calculatedValue} g</>
                )}
            </p>
            <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                onClick={onStartBrew}
            >
                Start Brew
            </button>
        </div>
    );
}

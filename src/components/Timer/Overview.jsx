import React from 'react';

export default function TimerOverview({ userInput, calculatedValue, inputType, onStartBrew, originalCoffeeAmount, originalBrewVolume }) {
    // Determine the displayed values based on user input or original values
    const displayCoffeeAmount = inputType === 'coffeeAmount' && userInput ? userInput : originalCoffeeAmount;
    const displayBrewVolume = inputType === 'brewVolume' && userInput ? userInput : originalBrewVolume;

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>

            <div className="mb-4">
                <p className="text-lg font-semibold">
                    Coffee Amount: {displayCoffeeAmount} g
                </p>
                <p className="text-lg font-semibold">
                    Brew Volume: {displayBrewVolume} mL
                </p>
            </div>

            <div className="mb-4">
                <button
                    onClick={onStartBrew}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                >
                    Start Brew
                </button>
            </div>
        </div>
    );
}

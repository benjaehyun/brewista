import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faTint, faBlender } from '@fortawesome/free-solid-svg-icons';

export default function PreparationOverview({ calculatedRecipe, onStartBrew }) {
    if (!calculatedRecipe) {
        return <div className="text-red-500">Error: Missing recipe information. Please go back and try again.</div>;
    }

    const { coffeeAmount, calculationMetadata, coffeeBean, gear, grindSize, journal } = calculatedRecipe;
    const brewVolume = calculationMetadata?.brewVolume || 
        calculatedRecipe.steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
        }, 0);

    const generateInstructions = (calculatedRecipe) => {
        const instructions = [];

        // Coffee Bean Information
        const roundedCoffeeAmount = Number(coffeeAmount).toFixed(2);
        if (coffeeBean) {
            instructions.push({
                icon: faCoffee,
                text: `Use ${roundedCoffeeAmount}g of ${coffeeBean.roaster} ${coffeeBean.origin} coffee (${coffeeBean.roastLevel} roast${coffeeBean.process ? `, ${coffeeBean.process} process` : ''}).`
            });
        } else {
            instructions.push({
                icon: faCoffee,
                text: `Use ${roundedCoffeeAmount}g of coffee.`
            });
        }

        // Grind Settings
        const grinder = gear.find(g => g.type === 'Grinder');
        let grindInstruction = `Grind at setting ${grindSize.steps}`;
        if (grindSize.microsteps) {
            grindInstruction += `.${grindSize.microsteps}`;
        }
        if (grinder) {
            grindInstruction += ` using your ${grinder.brand} ${grinder.model} grinder`;
        }
        if (grindSize.description) {
            grindInstruction += ` (${grindSize.description})`;
        }
        instructions.push({
            icon: faBlender,
            text: grindInstruction + '.'
        });

        // Water Preparation
        const roundedBrewVolume = Number(brewVolume).toFixed(2);
        let waterInstruction = `Prepare ${roundedBrewVolume}mL of water`;
        if (calculatedRecipe.waterTemperature) {
            waterInstruction += ` at ${calculatedRecipe.waterTemperature}°${calculatedRecipe.waterTemperatureUnit}`;
        }
        instructions.push({
            icon: faTint,
            text: waterInstruction + '.'
        });

        // Brewer and Filter Setup
        const brewer = gear.find(g => g.type === 'Brewer');
        const paper = gear.find(g => g.type === 'Paper');
        let setupInstruction = '';
        if (brewer) {
            setupInstruction += `Set up your ${brewer.brand} ${brewer.model} brewer`;
        } else {
            setupInstruction += 'Prepare your brewer';
        }
        if (paper) {
            setupInstruction += ` with a ${paper.brand} ${paper.model} filter`;
        } else {
            setupInstruction += ' with a filter';
        }
        setupInstruction += " and rinse, if necessary.";
        instructions.push({
            icon: faCoffee,
            text: setupInstruction
        });

        return instructions;
    };

    const instructions = generateInstructions(calculatedRecipe);

    return (
        <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{calculatedRecipe.name}</h1>
                
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Preparation Instructions</h2>
                    <ul className="space-y-4">
                        {instructions.map((instruction, index) => (
                        <li key={index} className="grid grid-cols-[24px_1fr] gap-4">
                            <div className="flex justify-center items-center h-full">
                                <FontAwesomeIcon 
                                    icon={instruction.icon} 
                                    className="text-blue-500 min-w-[16px] w-4 h-4"
                                    fixedWidth 
                                />
                            </div>
                            <span className="text-gray-600 leading-6 mr-8">{instruction.text}</span>
                        </li>
                        ))}
                    </ul>
                </div>

                <div className="text-center">
                    <button
                        onClick={onStartBrew}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Continue
                    </button>
                </div>

                {journal && (
                    <div className="my-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-700">Recipe Notes</h3>
                        <p className="text-gray-600 italic">{journal}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
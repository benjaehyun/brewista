import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faTint, faBlender } from '@fortawesome/free-solid-svg-icons';

export default function PreparationOverview({ recipe, coffeeAmount, brewVolume, onStartBrew }) {
  if (!recipe || !coffeeAmount || !brewVolume) {
    return <div className="text-red-500">Error: Missing recipe information. Please go back and try again.</div>;
  }

  const generateInstructions = (recipe, coffeeAmount, brewVolume) => {
    const instructions = [];

    // Coffee Bean Information
    const roundedCoffeeAmount = Number(coffeeAmount).toFixed(2);
    if (recipe.coffeeBean) {
      instructions.push({
        icon: faCoffee,
        text: `Use ${roundedCoffeeAmount}g of ${recipe.coffeeBean.roaster} ${recipe.coffeeBean.origin} coffee (${recipe.coffeeBean.roastLevel} roast${recipe.coffeeBean.process ? `, ${recipe.coffeeBean.process} process` : ''}).`
      });
    } else {
      instructions.push({
        icon: faCoffee,
        text: `Use ${roundedCoffeeAmount}g of coffee.`
      });
    }

    // Grind Settings
    const grinder = recipe.gear.find(g => g.type === 'Grinder');
    let grindInstruction = `Grind at setting ${recipe.grindSize.steps}`;
    if (recipe.grindSize.microsteps) {
      grindInstruction += `.${recipe.grindSize.microsteps}`;
    }
    if (grinder) {
      grindInstruction += ` using your ${grinder.brand} ${grinder.model} grinder`;
    }
    if (recipe.grindSize.description) {
      grindInstruction += ` (${recipe.grindSize.description})`;
    }
    instructions.push({
      icon: faBlender,
      text: grindInstruction + '.'
    });

    // Water Preparation
    const roundedBrewVolume = Number(brewVolume).toFixed(2);
    let waterInstruction = `Prepare ${roundedBrewVolume}mL of water`;
    if (recipe.waterTemperature) {
      waterInstruction += ` at ${recipe.waterTemperature}°${recipe.waterTemperatureUnit}`;
    }
    instructions.push({
      icon: faTint,
      text: waterInstruction + '.'
    });

    // Brewer and Filter Setup
    const brewer = recipe.gear.find(g => g.type === 'Brewer');
    const paper = recipe.gear.find(g => g.type === 'Paper');
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

  const instructions = generateInstructions(recipe, coffeeAmount, brewVolume);

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{recipe.name}</h1>
        
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

        {recipe.journal && (
          <div className="my-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Recipe Notes</h3>
            <p className="text-gray-600 italic">{recipe.journal}</p>
          </div>
        )}
      </div>
    </div>
  );
}
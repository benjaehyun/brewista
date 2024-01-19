class CoffeeRecipe {
    constructor(coffee, totalWater, pourSteps, isRatio = false) {
        this.isRatio = isRatio;
        this.coffee = coffee; // in grams or ratio for coffee
        this.totalWater = totalWater; // in milliliters or ratio for total water
        this.pourSteps = pourSteps; // Array of objects { water: in ml or ratio, time: in seconds, isBloom: boolean }
    }

    scaleRecipe(newAmount, isCoffee = true) {
        let scalingFactor;
        if (this.isRatio) {
            scalingFactor = isCoffee ? newAmount / this.coffee : newAmount / this.totalWater;
            this.coffee = this.coffee * scalingFactor;
            this.totalWater = this.totalWater * scalingFactor;
        } else {
            scalingFactor = isCoffee ? newAmount / this.coffee : newAmount / this.totalWater;
            this.coffee *= scalingFactor;
            this.totalWater = newAmount;
        }

        let totalTimeScalingFactor = scalingFactor;
        if (this.pourSteps[0].isBloom) {
            const bloomTime = this.pourSteps[0].time;
            const totalNonBloomTime = this.pourSteps.slice(1).reduce((sum, step) => sum + step.time, 0);
            totalTimeScalingFactor = (bloomTime + totalNonBloomTime * scalingFactor) / (bloomTime + totalNonBloomTime);
        }

        this.pourSteps = this.pourSteps.map((step, index) => {
            if (index === 0 && step.isBloom) {
                return { ...step, water: step.water * scalingFactor };
            } else {
                return { ...step, water: step.water * scalingFactor, time: step.time * totalTimeScalingFactor };
            }
        });
    }
}

// Example Usage
let originalRecipe = new CoffeeRecipe(1, 16, [{ water: 4, time: 30, isBloom: true }, { water: 4, time: 30 }, { water: 4, time: 30 }, { water: 4, time: 30 }], true);
originalRecipe.scaleRecipe(20, true); // User wants to use 20 grams of coffee
originalRecipe.scaleRecipe(320, false); // User wants a total brew volume of 320 ml

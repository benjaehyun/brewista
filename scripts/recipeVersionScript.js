// scripts/migrateRecipeVersions.js
require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('../models/recipe');
const RecipeVersion = require('../models/recipeVersion');

async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

async function createInitialVersions() {
    try {
        console.log('Starting migration...');
        
        // Get all recipes that don't have currentVersion set
        const recipes = await Recipe.find({ 
            $or: [
                { currentVersion: { $exists: false } },
                { currentVersion: null }
            ]
        });

        console.log(`Found ${recipes.length} recipes to migrate`);

        for (const recipe of recipes) {
            console.log(`\nProcessing recipe: ${recipe.name} (${recipe._id})`);

            // Create initial version document
            const versionDoc = new RecipeVersion({
                recipeId: recipe._id,
                version: '1.0',
                createdBy: recipe.userID,
                createdAt: recipe.createdAt,
                changes: [{
                    field: 'recipe',
                    description: 'Initial version migration'
                }],
                recipeData: {
                    name: recipe.name,
                    gear: recipe.gear,
                    coffeeBean: recipe.coffeeBean,
                    coffeeAmount: recipe.coffeeAmount,
                    grindSize: recipe.grindSize,
                    waterTemperature: recipe.waterTemperature,
                    waterTemperatureUnit: recipe.waterTemperatureUnit,
                    flowRate: recipe.flowRate,
                    steps: recipe.steps,
                    tastingNotes: recipe.tastingNotes,
                    journal: recipe.journal,
                    type: recipe.type
                }
            });

            await versionDoc.save();
            console.log('Created version 1.0');

            // Update recipe with version information
            recipe.currentVersion = '1.0';
            await recipe.save();
            console.log('Updated recipe with version info');
        }

        console.log('\nMigration completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
    }
}

async function createSampleBranches() {
    try {
        console.log('\nCreating sample branch versions...');

        // Get a few random recipes to create branches for
        const recipes = await Recipe.find({ currentVersion: '1.0' }).limit(3);

        for (const recipe of recipes) {
            console.log(`\nCreating branches for recipe: ${recipe.name}`);

            // Get the 1.0 version doc
            const baseVersion = await RecipeVersion.findOne({
                recipeId: recipe._id,
                version: '1.0'
            });

            // Create first branch (1.1)
            const branch1 = new RecipeVersion({
                recipeId: recipe._id,
                version: '1.1',
                createdBy: recipe.userID,
                parentVersion: '1.0',
                changes: [{
                    field: 'coffeeAmount',
                    oldValue: baseVersion.recipeData.coffeeAmount,
                    newValue: baseVersion.recipeData.coffeeAmount * 1.5,
                    description: 'Increased coffee amount by 50%'
                }],
                recipeData: {
                    ...baseVersion.recipeData,
                    coffeeAmount: baseVersion.recipeData.coffeeAmount * 1.5,
                    steps: baseVersion.recipeData.steps.map(step => ({
                        ...step,
                        waterAmount: step.waterAmount ? step.waterAmount * 1.5 : step.waterAmount
                    }))
                }
            });

            await branch1.save();
            console.log('Created branch version 1.1');

            // Create second branch (1.2) with different grind size
            const branch2 = new RecipeVersion({
                recipeId: recipe._id,
                version: '1.2',
                createdBy: recipe.userID,
                parentVersion: '1.0',
                changes: [{
                    field: 'grindSize',
                    oldValue: baseVersion.recipeData.grindSize,
                    newValue: {
                        ...baseVersion.recipeData.grindSize,
                        steps: baseVersion.recipeData.grindSize.steps + 2
                    },
                    description: 'Adjusted grind size to be coarser'
                }],
                recipeData: {
                    ...baseVersion.recipeData,
                    grindSize: {
                        ...baseVersion.recipeData.grindSize,
                        steps: baseVersion.recipeData.grindSize.steps + 2
                    }
                }
            });

            await branch2.save();
            console.log('Created branch version 1.2');

            // Create a main version (2.0) for one recipe
            if (recipes.indexOf(recipe) === 0) {
                const version2 = new RecipeVersion({
                    recipeId: recipe._id,
                    version: '2.0',
                    createdBy: recipe.userID,
                    changes: [{
                        field: 'recipe',
                        description: 'Major recipe update'
                    }],
                    recipeData: {
                        ...baseVersion.recipeData,
                        coffeeAmount: baseVersion.recipeData.coffeeAmount * 0.8,
                        steps: baseVersion.recipeData.steps.map(step => ({
                            ...step,
                            waterAmount: step.waterAmount ? step.waterAmount * 0.8 : step.waterAmount
                        }))
                    }
                });

                await version2.save();
                recipe.currentVersion = '2.0';
                await recipe.save();
                console.log('Created main version 2.0');
            }
        }

        console.log('\nSample branches created successfully');
    } catch (error) {
        console.error('Error creating sample branches:', error);
    }
}

async function run() {
    await connectDB();
    await createInitialVersions();
    await createSampleBranches();
    console.log('\nAll migrations completed');
    process.exit(0);
}

run();
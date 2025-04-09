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

async function migrateCurrentVersionCreatedAt() {
    try {
        console.log('Starting migration...')
        // Get all recipes without the currentVersionCreatedAt field
        const recipes = await Recipe.find({
            $or: [
                { currentVersionCreatedAt: { $exists: false } },
                { currentVersionCreatedAt: null }
            ]
        });

        console.log(`Found ${recipes.length} recipes to migrate`);

        for (const recipe of recipes) {
            console.log(`Processing recipe: ${recipe.name} (${recipe._id})`);
            
            // Find the current version document
            const versionDoc = await RecipeVersion.findOne({
                recipeId: recipe._id,
                version: recipe.currentVersion
            });

            if (versionDoc) {
                // Update recipe with version creation date
                recipe.currentVersionCreatedAt = versionDoc.createdAt;
                await recipe.save();
                console.log(`Updated currentVersionCreatedAt to ${versionDoc.createdAt}`);
            } else {
                // If version not found, use recipe creation date
                recipe.currentVersionCreatedAt = recipe.createdAt;
                await recipe.save();
                console.log(`No version found, used recipe creation date: ${recipe.createdAt}`);
            }
        }

        console.log('Migration completed');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}


async function run() {
    await connectDB() 
    await migrateCurrentVersionCreatedAt();
    console.log('\nAll migrations completed');
    process.exit(0);
}

run();
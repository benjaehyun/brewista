const mongoose = require('mongoose');

const recipeVersionSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  version: {
    type: String,
    required: true
  },
  parentVersion: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changes: [{
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    description: String
  }],
  // snapshot of recipe so that we don't have to calculate changes and add complicated handling of several different documents and embeds 
  recipeData: {
    name: {
      type: String,
      required: true
    },
    gear: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gear"
    }],
    coffeeBean: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoffeeBean"
    },
    coffeeAmount: {
      type: Number,
      required: true
    },
    grindSize: {
      steps: {
        type: Number,
        required: true
      },
      microsteps: Number,
      description: String
    },
    waterTemperature: Number,
    waterTemperatureUnit: {
      type: String,
      enum: ['Celsius', 'Fahrenheit', null]
    },
    flowRate: Number,
    steps: [{
      description: {
        type: String,
        required: true
      },
      time: Number,
      isBloom: {
        type: Boolean,
        default: false
      },
      waterAmount: Number
    }],
    tastingNotes: [String],
    journal: String,
    type: {
      type: String,
      enum: ['Ratio', 'Explicit'],
      required: true
    }
  }
}, {
  timestamps: true
});

// indexes
recipeVersionSchema.index({ recipeId: 1, version: 1 }, { unique: true });
recipeVersionSchema.index({ recipeId: 1, createdAt: -1 });

// middleware to validate version format for now 
// Determine if this is a main version (x.0)
recipeVersionSchema.virtual('isMainVersion').get(function() {
    return this.version.endsWith('.0');
});
  
  // Static method to get the next version number based on versioning rules
recipeVersionSchema.statics.getNextVersion = async function(recipeId, parentVersion = null) {
    const Recipe = mongoose.model('Recipe');
    
    // Get the recipe to find the current version
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) throw new Error('Recipe not found');
    
    const currentVersion = recipe.currentVersion || '1.0';
    
    // Case 1: Creating a main version (must be from current version)
    if (!parentVersion) {
      // Get the major version number and increment
      const [major] = currentVersion.split('.');
      return `${parseInt(major) + 1}.0`;
    }
    
    // Case 2: Creating a branch version (from any non-current version or from existing branch)
    // Check if parent is the current version
    if (parentVersion === currentVersion) {
      throw new Error('Cannot create branch from current version. Use main version instead.');
    }
    
    // Get all versions with the same major number as parent
    const [major] = parentVersion.split('.');
    
    const branchVersions = await this.find({
      recipeId,
      version: new RegExp(`^${major}\\.\\d+$`)
    }).sort({ version: -1 });
    
    // If no branches exist, start with x.1
    if (branchVersions.length === 0) {
      return `${major}.1`;
    }
    
    // Find the highest minor version
    const highestMinor = Math.max(
      ...branchVersions.map(v => parseInt(v.version.split('.')[1]))
    );
    
    // Return next minor version
    return `${major}.${highestMinor + 1}`;
};
  
  // Check if a version is the current version of the recipe
recipeVersionSchema.statics.isCurrentVersion = async function(recipeId, version) {
    const Recipe = mongoose.model('Recipe');
    const recipe = await Recipe.findById(recipeId);
    return recipe && recipe.currentVersion === version;
};
  
  // Get the next main version number for a recipe
recipeVersionSchema.statics.getNextMainVersion = async function(recipeId) {
    const Recipe = mongoose.model('Recipe');
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) throw new Error('Recipe not found');
    
    const currentVersion = recipe.currentVersion || '1.0';
    const [major] = currentVersion.split('.');
    return `${parseInt(major) + 1}.0`;
};
  
  // Get the version tree for visualization
recipeVersionSchema.statics.getVersionTree = async function(recipeId) {
    const versions = await this.find({ recipeId })
      .sort({ version: 1 })
      .populate('createdBy', 'username')
      .lean();
    
    // Group by major version
    const versionTree = {};
    versions.forEach(version => {
      const [major] = version.version.split('.');
      if (!versionTree[major]) {
        versionTree[major] = [];
      }
      versionTree[major].push(version);
    });
    
    return versionTree;
};

const RecipeVersion = mongoose.model('RecipeVersion', recipeVersionSchema);

module.exports = RecipeVersion;
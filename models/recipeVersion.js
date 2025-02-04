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
recipeVersionSchema.pre('validate', function(next) {
  const versionRegex = /^\d+\.\d+$/;
  if (!versionRegex.test(this.version)) {
    next(new Error('Invalid version format. Must be in format: x.y'));
    return;
  }
  next();
});

// Static method to get the next version number
recipeVersionSchema.statics.getNextVersion = async function(recipeId, parentVersion = null) {
  const latestVersion = await this.findOne({ recipeId })
    .sort({ version: -1 })
    .select('version');

  if (!latestVersion) return '1.0';

  if (parentVersion) {
    // Creating a branch
    const [major] = parentVersion.split('.');
    const existingBranches = await this.find({
      recipeId,
      version: new RegExp(`^${major}\\.\\d+$`)
    });
    const maxBranch = Math.max(...existingBranches.map(v => 
      parseInt(v.version.split('.')[1])
    ));
    return `${major}.${maxBranch + 1}`;
  } else {
    // Creating a new main version
    const [major] = latestVersion.version.split('.');
    return `${parseInt(major) + 1}.0`;
  }
};

const RecipeVersion = mongoose.model('RecipeVersion', recipeVersionSchema);

module.exports = RecipeVersion;
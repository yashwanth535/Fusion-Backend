import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  prepTime: {
    type: String,
    required: true,
    trim: true
  },
  cookTime: {
    type: String,
    required: true,
    trim: true
  },
  totalTime: {
    type: String,
    trim: true
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  ingredients: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one ingredient is required'
    }
  },
  instructions: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one instruction is required'
    }
  },
  tags: {
    type: [String],
    default: []
  },
  nutrition: {
    calories: Number,
    fat: Number,
    carbs: Number,
    protein: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

RecipeSchema.virtual('calculatedTotalTime').get(function() {
  return this.totalTime || `${this.prepTime} + ${this.cookTime}`;
});

// Pre-save hook to update the updatedAt field
RecipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Recipe = model('Recipe', RecipeSchema);

export default Recipe;
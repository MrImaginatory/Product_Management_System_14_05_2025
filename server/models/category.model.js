import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  subCategories: {
    type: [String], // Array of subcategory names
    required:true,
    lowercase: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
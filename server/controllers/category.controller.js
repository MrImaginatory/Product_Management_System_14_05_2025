import Category from "../models/category.model.js";
import asyncWrapper from '../utils/asyncWrapper.utils.js'
import saveImageLocally from "../utils/saveLocally.utils.js";

const createCategory = asyncWrapper(async (req, res) => {
    try {
       let slug = req.body.categoryName; // Concatenate category and subcategory
        slug = slug.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and make lowercase
        slug = slug.replace(/[^a-z0-9-]/g, ''); // Remove unwanted characters

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const localImageUrls = req.files.map(file => saveImageLocally(file));

        const category = new Category({
            categoryName: req.body.categoryName,
            slug: slug,
            image: localImageUrls[0],
            description: req.body.description
        });

        await category.save();

        return res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating category", error: error.message });
    }
});

const updateCategory = asyncWrapper(async (req, res) => {
    const categoryId = req.params.categoryId;
    const { categoryName, description } = req.body;

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(400).json({ message: "Category does not exist" });
    }

    // Create the slug
    let slug = categoryName; // Use the provided categoryName
    slug = slug.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and make lowercase
    slug = slug.replace(/[^a-z0-9-]/g, ''); // Remove unwanted characters

    // Prepare the updated category object
    const updatedCategory = {
        categoryName: categoryName,
        slug: slug,
        description: description,
    };

    // Handle image upload if files exist
    if (req.files && req.files.length > 0) {
         updatedCategory.image = saveImageLocally(req.files[0]);  // Save images
    }

    // Update the category in the database
    const upCat = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true });

    // Return the updated category
    return res.status(200).json({ message: "Category updated successfully", category: upCat });
});

const updateSubCategory = asyncWrapper(async (req, res) => {
    const { categoryId, oldSubCategoryName, newSubCategoryName } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(400).json({ message: "Category does not exist" });
    }

    const subCategoryIndex = category.subCategories.indexOf(oldSubCategoryName);
    if (subCategoryIndex === -1) {
        return res.status(400).json({ message: "Subcategory not found" });
    }

    category.subCategories[subCategoryIndex] = newSubCategoryName.toLowerCase(); // Replace with new name

    const updatedCategory = await category.save();

    return res.status(200).json({
        message: "Subcategory updated successfully",
        category: updatedCategory
    });
});

const createSubCategory = asyncWrapper(async(req,res)=>{
    const {categoryId,subCategoryName} = req.body;
    // const category = req.query.category;
    const categoryExists = await Category.findById(categoryId);

    if(!categoryExists){
        return res.status(400).json({message:"Category does not exist"});
    }

    if(categoryExists.subCategories.includes(subCategoryName)){
        return res.status(400).json({message:"Subcategory already exists"});
    }

    const subCat = await Category.findByIdAndUpdate(categoryExists._id,{ $push: { subCategories: subCategoryName.toLowerCase() } },{ new: true });    
    res.status(200).json({message:"Subcategory created successfully", subCat});
})

const deleteCategory = asyncWrapper(async(req,res)=>{
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(400).json({ message: "Category not found" });
    }
    await category.remove();
    return res.status(200).json({ message: "Category deleted successfully" });
})

const getCategories = asyncWrapper(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json(categories);
});

export { createCategory, createSubCategory, updateCategory,updateSubCategory, getCategories, deleteCategory };

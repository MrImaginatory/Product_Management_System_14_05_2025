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

const getCategories = asyncWrapper(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json(categories);
});

export { createCategory, createSubCategory, getCategories};

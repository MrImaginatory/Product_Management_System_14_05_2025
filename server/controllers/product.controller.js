import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import asyncWrapper from "../utils/asyncWrapper.utils.js";
import saveImageLocally from "../utils/saveLocally.utils.js";

const createProduct = asyncWrapper(async (req, res) => {
    try {
        console.log(req.body);
        

        let pt;
    
        if (!req.files || !req.files.displayImage || !req.files.otherImages) {
            return res.status(400).json({ message: "Both displayImage and otherImages are required" });
        }

        const CategoryExists = await Category.findById({ _id: req.body.category });

        console.log(typeof(CategoryExists.subCategories) ,typeof(req.body.subCategories));

        if (!CategoryExists) {
            return res.status(400).json({ message: "Category does not exist" });
        }

        if(req.body.productType){
            pt = req.body.productType.split(',');
        }

        // if(!CategoryExists.subCategories.includes(req.body.subCategory)) {
        //     return res.status(400).json({ message: "Subcategory does not exist" });
        // }

        const displayImagePath = saveImageLocally(req.files.displayImage[0]);

        const otherImageFiles = req.files.otherImages;
        if (otherImageFiles.length > 5) {
            return res.status(400).json({ message: "You can upload up to 5 other images only." });
        }
        const otherImagePaths = otherImageFiles.map(file => saveImageLocally(file));

        const product = new Product({
            productName: req.body.productName,
            category: req.body.category,
            subCategories: req.body.subCategories,
            displayImage: displayImagePath,
            otherImages: otherImagePaths,
            availability: req.body.availability,
            productType: pt,
            stock: req.body.stock,
            weight: req.body.weight,
            mrp: req.body.mrp,
            salePrice: req.body.salePrice,
            productDescription: req.body.productDescription,
        });

        await product.save();

        return res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

const getProducts = asyncWrapper(async (req, res) => {
    const products = await Product.find({})
        .populate('category', 'categoryName')        // populate category name only
        .populate('subCategories', 'categoryName');    // populate subCategory name only

    res.status(200).json(products);
});

export {    createProduct, getProducts };

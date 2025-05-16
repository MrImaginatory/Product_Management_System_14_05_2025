import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import asyncWrapper from "../utils/asyncWrapper.utils.js";
import saveImageLocally from "../utils/saveLocally.utils.js";

const createProduct = asyncWrapper(async (req, res) => {
    try {
        
        let pt;
    
        if (!req.files || !req.files.displayImage || !req.files.otherImages) {
            return res.status(400).json({ message: "Both displayImage and otherImages are required" });
        }

        const CategoryExists = await Category.findById({ _id: req.body.category });

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
        if (otherImageFiles.length >= 50) {
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

const deleteProduct = asyncWrapper(async (req,res)=>{
    try {
        const { productId } = req.params; 
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }
        const deletedProduct = await Product.findByIdAndDelete(productId)
        return res.status(200).json({    message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
})

const updateProduct = asyncWrapper(async (req, res) => {
    try {
        const { productId } = req.params;  // Get productId from the route parameters
        const { productName, category, subCategories, availability, productType, stock, weight, mrp, salePrice, productDescription } = req.body;

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        // Check if category exists
        const CategoryExists = await Category.findById({_id:category});
        if (!CategoryExists) {
            return res.status(400).json({ message: "Category does not exist" });
        }
        // Handle the productType if provided
        let pt;
        if (productType) {
            pt = productType.split(',');
        }

        // Handle display image and other images
        let displayImagePath = product.displayImage;  // Keep the old image path by default
        if (req.files && req.files.displayImage) {
            displayImagePath = saveImageLocally(req.files.displayImage[0]);  // Update if new displayImage is provided
        }

        let otherImagePaths = product.otherImages;  // Keep the old otherImages by default
        if (req.files && req.files.otherImages) {
            if (req.files.otherImages.length > 5) {
                return res.status(400).json({ message: "You can upload up to 5 other images only." });
            }
            otherImagePaths = req.files.otherImages.map(file => saveImageLocally(file));  // Update otherImages if new ones are provided
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId,{
            $set: {
                productName: productName,
                category: category,
                subCategories: subCategories,
                displayImage: displayImagePath,
                otherImages: otherImagePaths,
                availability: availability,
                productType: pt,
                stock: stock,
                weight: weight,
                mrp: mrp ,
                salePrice: salePrice,
                productDescription: productDescription}
        },{ new:true})

        // Save the updated product
        // const updatedProduct = await product.save();

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

export {    createProduct, getProducts, updateProduct, deleteProduct };

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        subCategories: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        displayImage: {
            type: String, 
            required: true,
        },

        otherImages: {
            type: [String], 
            validate: [arrayLimit, "Exceeds the limit of 5 images"],
        },

        availability: {
            type: String,
            enum: ["ReadyToShip", "OnBooking"],
            default: "ReadyToShip",
        },

        productType: {
            type: [String],
            enum: ["Hot_Product", "BestSeller", "Todays_Deal"],
            default: "Hot_Product",
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
        },

        weight: {
            type: Number,
            required: true,
            min:0,
        },

        mrp: {
            type: Number,
            required: true,
            min:0,
        },

        salePrice: {
            type: Number,
            required: true,
            min:0,
        },

        productDescription: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

function arrayLimit(val) {
    return val.length <= 50;
}

const Product = mongoose.model("Product", productSchema);

export default Product;

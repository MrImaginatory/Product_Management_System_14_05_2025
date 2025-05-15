import { Router } from "express";
import { createProduct, getProducts } from "../controllers/product.controller.js";
import { uploadProductImages } from "../middlewares/multer.middleware.js";

const productRouter = Router();

productRouter.post("/addProduct", uploadProductImages, createProduct);
productRouter.get('/products', getProducts); 

export default productRouter;

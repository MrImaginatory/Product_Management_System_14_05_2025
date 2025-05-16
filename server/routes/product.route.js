import { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import { uploadProductImages } from "../middlewares/multer.middleware.js";

const productRouter = Router();

productRouter.post("/addProduct", uploadProductImages, createProduct);
productRouter.patch("/updateProduct/:productId", uploadProductImages, updateProduct);
productRouter.delete('/deleteProduct/:productId', deleteProduct);
productRouter.get('/products', getProducts); 

export default productRouter;

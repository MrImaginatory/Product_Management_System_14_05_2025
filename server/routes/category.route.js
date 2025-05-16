import { Router } from "express";
import { createCategory, createSubCategory, updateCategory, getCategories, updateSubCategory, deleteCategory } from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const categoryRouter = Router();

categoryRouter.route('/addCategory').post(upload.array('categoryImage', 5), createCategory);
categoryRouter.route('/updateCategory/:categoryId').patch(upload.array('categoryImage', 1), updateCategory);
categoryRouter.route('/deleteCategory/:categoryId').delete(deleteCategory);
categoryRouter.route('/addSubCategory').put(createSubCategory);
categoryRouter.route('/updateSubCategory').patch(updateSubCategory);
categoryRouter.route('/categories').get(getCategories);

export default categoryRouter;

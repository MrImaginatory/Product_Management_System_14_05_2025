import { Router } from "express";
import { createCategory, createSubCategory, getCategories } from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const categoryRouter = Router();

categoryRouter.route('/addCategory').post(upload.array('categoryImage', 5), createCategory);
categoryRouter.route('/addSubCategory').put(createSubCategory);
categoryRouter.route('/categories').get(getCategories);

export default categoryRouter;

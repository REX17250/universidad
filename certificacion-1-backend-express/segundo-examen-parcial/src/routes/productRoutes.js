import { Router } from "express";

import {
    findProducts,
    findProductById,
    saveProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

const productRoutes = Router();

productRoutes.get("/", findProducts)

productRoutes.get("/:id", findProductById);

productRoutes.post("/", saveProduct);

productRoutes.patch("/:id", updateProduct);

productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
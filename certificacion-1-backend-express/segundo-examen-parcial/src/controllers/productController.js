import mongoose from "mongoose";

import {
    getAllProducts,
    getFilteredProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
} from "../services/courseService.js";

import { validateProductBody } from "../utils/productValidator.js";

const VALID_CATEGORY = ["Drink", "IceCream"];
const VALID_SUPPLIER = ["Delicia", "Pil"];

export async function findProducts(req, res, next) {
    try{
        const {category, supplier, sortBy} = req.query;

        if(category === undefined && supplier === undefined && sortBy === undefined){
            return res.success(200, "Todos los productos obtenidos", await getAllProducts());
        }

        if (category !== undefined && !VALID_CATEGORY.includes(category)) {
            const error = Error(`El parámetro 'category' debe ser uno de: ${VALID_CATEGORY.join(", ")}`);
            error.statusCode = 400;
            return next(error);
        }

        if (supplier !== undefined && !VALID_CATEGORY.includes(supplier)) {
            const error = Error(`El parámetro 'supplier' debe ser uno de: ${VALID_SUPPLIER.join(", ")}`);
            error.statusCode = 400;
            return next(error);
        }
        
        if (sortBy !== undefined && sortBy !== "asc" && sortBy !== "desc") {
            const error = Error("El parámetro 'sortBy' debe ser 'asc' o 'desc'");
            error.statusCode = 400;
            return next(error);
        }
        
    return res.success(200, "Cursos filtrados obtenidos", await getFilteredProducts(category, supplier, sortBy));
    
    } catch (err) {
        next(err);
    }
}
       
export async function findProductById(req, res, next) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = Error("El id no es un ObjectId de MongoDB válido");
            error.statusCode = 400;
            return next(error);
        }

        const product = await getProductById(id);
        if (!product) {
            const error = Error(`No se encontró un producto con id ${id}`);
            error.statusCode = 404;
            return next(error);
        }

        return res.success(200, `Producto con id ${id} obtenido exitosamente`, product);
    } catch (err) {
        next(err);
    }
}

export async function saveProduct(req, res, next) {
    try {
        const validation = validateProductBody(req.body, true);
        if (!validation.validation) {
            const error = Error(validation.message);
            error.statusCode = 400;
            return next(error);
        }

        const newCourse = await createCourse({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            supplier: req.body.supplier
        });

        return res.success(201, "Producto creado exitosamente", newProduct);
    } catch (err) {
        next(err);
    }
}

export async function updateProduct(req, res, next) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = Error("El id no es un ObjectId de MongoDB válido");
            error.statusCode = 400;
            return next(error);
        }

        const validation = validateProductBody(req.body, false);
        if (!validation.validation) {
            const error = Error(validation.message);
            error.statusCode = 400;
            return next(error);
        }

        const result = await updateProductById(id, req.body);
        if (!result.success) {
            const error = Error(result.message);
            error.statusCode = 404;
            return next(error);
        }

        return res.success(200, `Producto con id ${id} actualizado exitosamente`, result.data);
    } catch (err) {
        next(err);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = Error("El id no es un ObjectId de MongoDB válido");
            error.statusCode = 400;
            return next(error);
        }

        const result = await deleteProductById(id);
        if (!result.success) {
            const error = Error(result.message);
            error.statusCode = 404;
            return next(error);
        }

        return res.success(200, `Producto con id ${id} eliminado lógicamente`, result.data);
    } catch (err) {
        next(err);
    }
}
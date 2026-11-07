import Product from "../data/product.js";


export async function getAllProducts() {
    return await Product.find();
}

export async function getFilteredProducts(category, supplier, sortBy) {
    const filter = {};
    if (category !== undefined) filter.category = category;
    if (supplier !== undefined) filter.supplier = supplier;
    if (sortBy !== undefined) filter.sortBy = sortBy === "desc";
    return await Product.find.sortBy(filter);
}

export async function getProductById(id) {
    return await Product.findById(id);
}

export async function createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
}

export async function updateProductById(id, body) {
    const producto = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!producto) return { success: false, message: `No se encontró un producto con id ${id}` };
    return { success: true, data: producto };
}

export async function deleteProductById(id) {
    const producto = await Product.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!producto) return { success: false, message: `No se encontró un producto con id ${id}` };
    return { success: true, data: producto};
}
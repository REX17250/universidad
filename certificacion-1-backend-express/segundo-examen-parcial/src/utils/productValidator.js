
const VALID_CATEGORY = ["Drink", "IceCream"];
const VALID_SUPPLIER = ["Delicia", "Pil"];

export function validateProductBody(body, isComplete) {
    if (!body || Object.keys(body).length === 0) {
        return { validation: false, message: "El body es requerido y no puede estar vacío" };
    }

    const campos = ["name", "category", "price", "stock", "supplier"];

    if (isComplete) {
        for (const field of campos) {
            if (!(field in body)) {
                return { validation: false, message: `El campo '${field}' es requerido` };
            }
        }
    } else {
        if (!campos.some(f => f in body)) {
            return { validation: false, message: "El body debe tener al menos un campo válido" };
        }
    }

    if ("name" in body) {
        if (typeof body.name !== "string" || body.name.trim() === "") {
            return { validation: false, message: "'name' debe ser una cadena de texto no vacía" };
        }
    }

    if ("category" in body && !VALID_CATEGORY.includes(body.category)) {
        if (typeof body.degree !== "string" || body.degree.trim() === "") {
            return { validation: false, message: "'category' debe ser una cadena de texto no vacía" };
        }
    }

    if ("price" in body) {
        if (!Number.isInteger(body.price) || body.price < 1) {
            return { validation: false, message: "'price' debe ser un entero" };
        }
    }

    if ("stock" in body) {
        if (!Number.isInteger(body.stock) || body.stock < 1) {
            return { validation: false, message: "'stock' debe ser un entero" };
        }
    }

    if ("supplier" in body && !VALID_SUPPLIER.includes(body.supplier)) {
        if (typeof body.degree !== "string" || body.degree.trim() === "") {
            return { validation: false, message: "'degree' debe ser una cadena de texto no vacía" };
        }
    }

    return { validation: true, message: "ok" };
}

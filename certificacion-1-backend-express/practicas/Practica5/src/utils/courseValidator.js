const VALID_SCHEDULES = ["A+", "B+", "A", "B", "C", "D", "E", "Z"];

export function validateCourseBody(body, isComplete) {
    if (!body || Object.keys(body).length === 0) {
        return { validation: false, message: "El body es requerido y no puede estar vacío" };
    }

    const campos = ["name", "degree", "lecturer", "schedule", "credits", "active"];

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

    if ("degree" in body) {
        if (typeof body.degree !== "string" || body.degree.trim() === "") {
            return { validation: false, message: "'degree' debe ser una cadena de texto no vacía" };
        }
    }

    if ("lecturer" in body) {
        if (typeof body.lecturer !== "string" || body.lecturer.trim() === "") {
            return { validation: false, message: "'lecturer' debe ser una cadena de texto no vacía" };
        }
    }

    if ("schedule" in body && !VALID_SCHEDULES.includes(body.schedule)) {
        return { validation: false, message: `'schedule' debe ser uno de: ${VALID_SCHEDULES.join(", ")}` };
    }

    if ("credits" in body) {
        if (!Number.isInteger(body.credits) || body.credits < 1 || body.credits > 10) {
            return { validation: false, message: "'credits' debe ser un entero positivo entre 1 y 10" };
        }
    }

    if ("active" in body && typeof body.active !== "boolean") {
        return { validation: false, message: "'active' debe ser un booleano (true o false)" };
    }

    return { validation: true, message: "ok" };
}

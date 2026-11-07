import mongoose from "mongoose";
import {
    getAllCourses,
    getFilteredCourses,
    createCourse,
    getCourseById,
    updateCourseById,
    deleteCourseById,
    getCoursesByIds
} from "../services/courseService.js";
import { validateCourseBody } from "../utils/courseValidator.js";

const VALID_SCHEDULES = ["A+", "B+", "A", "B", "C", "D", "E", "Z"];

const SCHEDULE_GROUPS = {
    "A": "A", "A+": "A",
    "B": "B", "B+": "B",
    "C": "C", "D": "D",
    "E": "E", "Z": "Z"
};

export async function findCourses(req, res, next) {
    try {
        const { schedule, credits, active } = req.query;

        if (schedule === undefined && credits === undefined && active === undefined) {
            return res.success(200, "Todos los cursos obtenidos", await getAllCourses());
        }

        if (schedule !== undefined && !VALID_SCHEDULES.includes(schedule)) {
            const error = Error(`El parámetro 'schedule' debe ser uno de: ${VALID_SCHEDULES.join(", ")}`);
            error.statusCode = 400;
            return next(error);
        }

        if (credits !== undefined) {
            const creditsNum = Number(credits);
            if (!Number.isInteger(creditsNum) || creditsNum < 1 || creditsNum > 10) {
                const error = Error("El parámetro 'credits' debe ser un entero entre 1 y 10");
                error.statusCode = 400;
                return next(error);
            }
        }

        if (active !== undefined && active !== "true" && active !== "false") {
            const error = Error("El parámetro 'active' debe ser 'true' o 'false'");
            error.statusCode = 400;
            return next(error);
        }

        return res.success(200, "Cursos filtrados obtenidos", await getFilteredCourses(schedule, credits, active));
    } catch (err) {
        next(err);
    }
}

export async function saveCourse(req, res, next) {
    try {
        const validation = validateCourseBody(req.body, true);
        if (!validation.validation) {
            const error = Error(validation.message);
            error.statusCode = 400;
            return next(error);
        }

        const newCourse = await createCourse({
            name: req.body.name,
            degree: req.body.degree,
            lecturer: req.body.lecturer,
            schedule: req.body.schedule,
            credits: req.body.credits,
            active: req.body.active
        });

        return res.success(201, "Curso creado exitosamente", newCourse);
    } catch (err) {
        next(err);
    }
}

export async function findCourseById(req, res, next) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = Error("El id no es un ObjectId de MongoDB válido");
            error.statusCode = 400;
            return next(error);
        }

        const course = await getCourseById(id);
        if (!course) {
            const error = Error(`No se encontró un curso con id ${id}`);
            error.statusCode = 404;
            return next(error);
        }

        return res.success(200, `Curso con id ${id} obtenido exitosamente`, course);
    } catch (err) {
        next(err);
    }
}

export async function updateCourse(req, res, next) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = Error("El id no es un ObjectId de MongoDB válido");
            error.statusCode = 400;
            return next(error);
        }

        const validation = validateCourseBody(req.body, false);
        if (!validation.validation) {
            const error = Error(validation.message);
            error.statusCode = 400;
            return next(error);
        }

        const result = await updateCourseById(id, req.body);
        if (!result.success) {
            const error = Error(result.message);
            error.statusCode = 404;
            return next(error);
        }

        return res.success(200, `Curso con id ${id} actualizado exitosamente`, result.data);
    } catch (err) {
        next(err);
    }
}

export async function deleteCourse(req, res, next) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = Error("El id no es un ObjectId de MongoDB válido");
            error.statusCode = 400;
            return next(error);
        }

        const result = await deleteCourseById(id);
        if (!result.success) {
            const error = Error(result.message);
            error.statusCode = 404;
            return next(error);
        }

        return res.success(200, `Curso con id ${id} eliminado lógicamente`, result.data);
    } catch (err) {
        next(err);
    }
}

export async function validateSchedule(req, res, next) {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            const error = Error("El body debe contener un arreglo 'ids' con al menos un id");
            error.statusCode = 400;
            return next(error);
        }

        if (ids.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            const error = Error("Todos los ids deben ser ObjectIds de MongoDB válidos");
            error.statusCode = 400;
            return next(error);
        }

        const courses = await getCoursesByIds(ids);
        const notFound = ids.filter((id, i) => courses[i] === null);
        if (notFound.length > 0) {
            const error = Error(`No se encontraron cursos con los ids: ${notFound.join(", ")}`);
            error.statusCode = 404;
            return next(error);
        }

        const conflicts = [];
        const seenGroups = {};

        for (const course of courses) {
            const group = SCHEDULE_GROUPS[course.schedule];
            if (seenGroups[group]) {
                conflicts.push({
                    curso1: seenGroups[group],
                    curso2: course,
                    motivo: `Los horarios '${seenGroups[group].schedule}' y '${course.schedule}' se solapan`
                });
            } else {
                seenGroups[group] = course;
            }
        }

        if (conflicts.length > 0) {
            return res.success(200, "El horario tiene choques", { valido: false, choques: conflicts, cursos: courses });
        }

        return res.success(200, "El horario es válido", { valido: true, choques: [], cursos: courses });
    } catch (err) {
        next(err);
    }
}

import { Router } from "express";
import {
    findCourses,
    saveCourse,
    findCourseById,
    updateCourse,
    deleteCourse,
    validateSchedule
} from "../controllers/courseController.js";

const courseRoutes = Router();

courseRoutes.get("/", findCourses);

courseRoutes.post("/", saveCourse);

courseRoutes.put("/schedule", validateSchedule);

courseRoutes.get("/:id", findCourseById);

courseRoutes.patch("/:id", updateCourse);

courseRoutes.delete("/:id", deleteCourse);

export default courseRoutes;

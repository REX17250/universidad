import { Router } from "express";

import {
  findStudents,
  saveStudent,
  findStudentById,
} from "../controllers/studentController.js";

const studentRoutes = Router();

studentRoutes.get("/", findStudents);

studentRoutes.post("/", saveStudent);

studentRoutes.get("/:id", findStudentById);

export default studentRoutes;
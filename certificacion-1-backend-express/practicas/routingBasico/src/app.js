import express from "express";
import {getStudents, createStudent, getStudentByPos} from "./services.js";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Hello from Express</h1>");
});

app.get("/api/student", getStudents);
app.post("/api/student", createStudent);
app.get("/api/student/:pos", getStudentByPos);

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import courseRoutes from "./routes/courseRoutes.js";
import { requestLogger } from "./middlewares/loggingMiddleware.js";
import { responseFormatter, errorHandler } from "./middlewares/formatingMiddleware.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(responseFormatter);

app.get("/", (req, res) => {
    return res.status(200).send("<h1>API de Cursos - Práctica 5</h1>");
});

app.use("/api/courses", courseRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB conectado");
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error de conexión MongoDB:", err.message);
        process.exit(1);
    });

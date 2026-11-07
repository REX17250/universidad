import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./data/mongoConnection.js";
import { requestLogger } from "./middlewares/loggingMiddleware.js";
import { responseFormatter, errorHandler } from "./middlewares/formatingMiddleware.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

await connectDB();

app.use(express.json());
app.use(requestLogger);
app.use(responseFormatter);

app.get("/", (req, res) => {
    return res.status(200).send("<h1>2do Examen Parcial</h1>");
});

app.use("/api/products", productRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



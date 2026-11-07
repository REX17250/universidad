import express from "express";
import studentRoutes from "./routes/studentRoutes.js";
import { requestLogger } from "./middlewares/loggingMiddleware.js";
import { errorHandler, responseFormatter } from "./middlewares/formatingMiddleware.js";

const PORT = 3000;

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use(responseFormatter);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Hello from Express</h1>");
});

app.use("/api/students", studentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
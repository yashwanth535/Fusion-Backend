import express from "express";
import connectDB from "./database/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import recipeRouter from "./routes/recipe.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [process.env.REACT_URL];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});


app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/recipe", recipeRouter)

app.use(errorMiddleware)

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on  http://localhost:${process.env.PORT}`);
    await connectDB();
})
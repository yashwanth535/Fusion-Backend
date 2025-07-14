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

const allowedOrigins = process.env.REACT_URL?.split(",") || [];
  console.log("CORS Origin:", process.env.REACT_URL);

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(cookieParser());
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
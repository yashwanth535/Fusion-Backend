import express from "express";
import connectDB from "./database/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import recipeRouter from "./routes/recipe.routes.js";
import mongoose from "mongoose";

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

app.get("/ping", (req, res) => {
  res.status(204).end(); 
});

app.get("/api/ping", (req, res) => {
  res.send("fusion backend API is running");
});


app.get('/api/db', async (req, res) => {
  try {
    const readyState = mongoose.connection.readyState;
    const stateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

    if (readyState !== 1) {
      return res.status(500).json({
        status: "error",
        message: "MongoDB is not connected",
        readyState: stateMap[readyState]
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection("testdb");

    // Fetch the first (and only) document
    const document = await collection.findOne({});

    if (!document) {
      return res.status(404).json({
        status: "error",
        message: "No document found in collection"
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "MongoDB connected and document fetched",
      readyState: stateMap[readyState],
      document
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "MongoDB query failed",
      error: err.message
    });
  }
});

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/recipe", recipeRouter)

app.use(errorMiddleware)

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on  http://localhost:${process.env.PORT}`);
    await connectDB();
})
import { Router } from "express";
import { signUp } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-in", (req, res) => { console.log("Sign in route") });

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-out", (req, res) => { console.log("Sign out route") });

export default authRouter;
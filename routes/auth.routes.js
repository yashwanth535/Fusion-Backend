import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-in", (req, res) => { console.log("Sign in route") });

authRouter.post("/sign-up", (req, res) => { console.log("Sign up route") });

authRouter.post("/sign-out", (req, res) => { console.log("Sign out route") });

export default authRouter;
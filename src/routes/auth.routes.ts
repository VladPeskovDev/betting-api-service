import { Router } from "express";
import { signin  } from "../controllers/auth.controller";

const authRouter = Router();


authRouter.post("/login", signin);


export default authRouter;
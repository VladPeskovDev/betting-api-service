import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/auth", authRouter);

export default app;

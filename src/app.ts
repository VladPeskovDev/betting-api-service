import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import betsRouter from "./routes/bets.routes";
import balanceRouter from "./routes/balance.routes";
import transactionsRouter from "./routes/transactions.routes";
import healthRouter from "./routes/health.routes";
import internalRouter from "./internal/internal.routes";

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/bets", betsRouter);
app.use("/api/balance", balanceRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/health", healthRouter);
app.use("/api/internal", internalRouter);

export default app;

import express from "express";
import logging from "./logger.js"; 
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loggingMiddleware = async (req, res, next) => {
    const stack = "backend"; 
    const level = "error"; 
    const pack = "handler"; 
    const message = `recieved string, expected bool`;

    logging(stack, level, pack, message).catch(console.error);

    next(); 
};

app.use(loggingMiddleware);

app.get("/", (req, res) => {
    res.send("Log send Successfully");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

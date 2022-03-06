import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const config = process.env;

const verifyToken = (req:Request, res:Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"]

    if (!token) {
        return res.status(403).send("A token is required for authentication !");
    }

    try {
        jwt.verify(token, config.TOKEN_KEY!);
    } catch (error) {
        return res.status(401).send("Invalid Token !");
    }

    return next();
}

export { verifyToken }
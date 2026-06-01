import { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if(req.user?.role !== 'admin') {
        res.status(403).json({message: "Cet accès ne vous est pas permis"});
        return;
    }
    next();
}
import {Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from "dotenv";
import logger from '../utils/logger';
import { UserRole } from '../enums';
dotenv.config();

interface customRequest extends Request{
    user?: JwtPayload;
}

const verifyUserAuthMiddleware: RequestHandler = async ( req:customRequest, res: Response, next: NextFunction ) => {
    try {
        const bearerHeader = req.headers['authorization'];

        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];
            const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET as string) as any;

            if(decoded.role !== UserRole.patient){
                return res.status(401).json({ status: false, message: 'Unauthorized' });
            }

            req.user = decoded as JwtPayload;
            next();
        } else {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }
    } catch (err: any) {        
        logger.error({tags:"authorization",status:false,error_message:err.message});
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
};

const verifyAdminAuthMiddleware: RequestHandler = async ( req:customRequest, res: Response, next: NextFunction ) => {
    try {
        const bearerHeader = req.headers['authorization'];

        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];
            const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET as string) as any;

            if(decoded.role !== UserRole.admin){
                return res.status(401).json({ status: false, message: 'Unauthorized' });
            }

            req.user = decoded as JwtPayload;
            next();
        } else {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }
    } catch (err: any) {
        logger.error({tags:"authorization",status:false,error_message:err.message});
        return res.status(401).json({ status: false, message: "Unauthorized Access" });
    }
};

const verifyDoctorHospitalAuthMiddleware: RequestHandler = async ( req:customRequest, res: Response, next: NextFunction ) => {
    try {
        const bearerHeader = req.headers['authorization'];

        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];
            const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET as string) as any;

            if(decoded.role !== UserRole.doctor || decoded.role !== UserRole.hospital){
                return res.status(401).json({ status: false, message: 'Unauthorized' });
            }

            req.user = decoded as JwtPayload;
            next();
        } else {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }
    } catch (err: any) {
        logger.error({tags:"authorization",status:false,error_message:err.message});
        return res.status(401).json({ status: false, message: "Unauthorized Access" });
    }
};

export { verifyUserAuthMiddleware, verifyAdminAuthMiddleware, verifyDoctorHospitalAuthMiddleware }
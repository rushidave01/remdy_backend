import express from 'express';
import { AuthController } from '../controllers';
import { validateDoctorLoginSchema, validateDoctorRegisterSchema, validateLoginWithEmailSchema, validateSignInWithGoogleSchema } from '../validations';


const authRouter = express.Router();
const authController = new AuthController();

/**
 * App User Auth
 */
authRouter.post("/signInWithGoogle",[ validateSignInWithGoogleSchema ], authController.signInWithGoogle); 

/**
 * Admin Auth
 */
authRouter.post("/loginWithEmail", [ validateLoginWithEmailSchema ], authController.loginWithEmail); 

/**
 * Doctor Auth
 */
authRouter.post("/doctor/register", [validateDoctorRegisterSchema], authController.registerDoctor); // Doctor registration
authRouter.post("/doctor/login", [validateDoctorLoginSchema], authController.loginDoctor);         // Doctor login

export default authRouter;

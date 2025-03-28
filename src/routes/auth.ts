import express from 'express';
import { AuthController } from '../controllers';
import { validateSignInWithGoogleSchema, validateLoginWithEmailSchema } from '../validations';


const authRouter = express.Router();
const authController = new AuthController();

/**
 * @author Prince Gupta
 */
authRouter.post("/signInWithGoogle",[ validateSignInWithGoogleSchema ], authController.signInWithGoogle); // for app users
authRouter.post("/loginWithEmail", [ validateLoginWithEmailSchema ], authController.loginWithEmail) // for admins

export default authRouter;
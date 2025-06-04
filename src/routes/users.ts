import express from 'express';
import { UserController } from '../controllers';
import { 
    validateStorePatientLocationSchema, 
    validateWishlistSchema, 
    validatewishlistSchemaForHospital,
    validateCommentSchema, 
    validatePatientRequestSchema
} from '../validations/patientValidation';

const userRouter = express.Router();
const userController = new UserController();

userRouter.post(
  "/patient-location",
  [validateStorePatientLocationSchema],
  userController.storePatientLocation
);

userRouter.post(
  "/addOrRemoveWishlistDoctor",
  [validateWishlistSchema],
  userController.addOrRemoveWishlistDoctor
);

userRouter.post(
  "/addOrRemoveWishlistHospital",
  [validatewishlistSchemaForHospital],
  userController.addOrRemoveWishlistHospital
);

userRouter.post("/get-user-details", userController.getUserDetails);
userRouter.post("/write-review", [validateCommentSchema], userController.writeReview);
userRouter.get("/profile", userController.getProfile);

// New Request Module as per figma
userRouter.post("/create-patient-request", [validatePatientRequestSchema], userController.createPatientRequest);
userRouter.get("/approved-doctors", userController.getApprovedDoctors);



export default userRouter;
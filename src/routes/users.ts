import express from 'express';
import { UserController } from '../controllers';
import { 
    validateStorePatientLocationSchema, 
    validateWishlistSchema, 
    validatewishlistSchemaForHospital,
    validateCommentSchema 
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

export default userRouter;
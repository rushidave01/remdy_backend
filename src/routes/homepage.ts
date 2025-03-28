import express from 'express';
import { DoctorController } from '../controllers/DoctorController';

const homepageRouter = express.Router();
const doctorController = new DoctorController();

homepageRouter.post('/get-all-near-by-doctors', doctorController.getDoctors);
homepageRouter.post('/get-doctors-by-postal-code', doctorController.getDoctorsByPostalCode);
homepageRouter.get('/get-doctors/:doctor_id', doctorController.getDoctorsById);
homepageRouter.get('/get-doctors-reviews/:doctor_id', doctorController.getReviewsForDoctorsById);

export default homepageRouter;
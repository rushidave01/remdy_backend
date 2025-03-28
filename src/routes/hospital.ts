import express from "express";
import { HospitalController } from "../controllers";
const hospitalRoutes = express.Router();

const hospitalController = new HospitalController();

hospitalRoutes.post("/get-all-near-by-hospitals", hospitalController.getNearByHospitals);
hospitalRoutes.get('/get-hospital/:hospital_id', hospitalController.getHospitalById);
hospitalRoutes.get('/get-hospital-reviews/:hospital_id', hospitalController.getReviewsForHospitalById);

export default hospitalRoutes;

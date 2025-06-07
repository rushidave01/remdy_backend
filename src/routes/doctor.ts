import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController";
import { AdminController } from "../controllers";

const doctorRouter = Router();
const doctorController = new DoctorController();
const adminController = new AdminController();

doctorRouter.get("/patient-notifications", doctorController.getAllPatientNotifications);  // Get All Patient Notifications (with pagination)
doctorRouter.get("/registered-patients", adminController.getAllRegisteredPatients); // Get all registered patients (with pagination)

export default doctorRouter;
import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController";
import { AdminController } from "../controllers";
import { validateSendInviteToPatient, validateUpdateAcceptingPatientsStatus } from "../validations";

const doctorRouter = Router();
const doctorController = new DoctorController();
const adminController = new AdminController();

doctorRouter.get("/patient-notifications", doctorController.getAllPatientNotifications);  // Get All Patient Notifications (with pagination)
doctorRouter.get("/registered-patients", adminController.getAllRegisteredPatients); // Get all registered patients (with pagination)
doctorRouter.patch("/accepting-patients-status", [validateUpdateAcceptingPatientsStatus], doctorController.updateAcceptingPatientsStatus); // Update status of accepting patients
doctorRouter.get("/dashboard/:doctorId", doctorController.getDoctorDashboardSummary);
doctorRouter.post("/send-invite", [validateSendInviteToPatient], doctorController.sendInviteToPatient);


export default doctorRouter;
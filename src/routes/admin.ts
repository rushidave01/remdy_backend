import { Router } from 'express';
import { validateSendNotification, validateGetNotifications } from '../validations/notifications';
import { AdminController } from '../controllers';
import { NotificationController } from '../controllers/NotificationController';
import { validateGetCustomersSchema } from '../validations/adminValidation';

const adminRouter = Router();
const adminController = new AdminController();
const notificationController = new NotificationController();

/* User-Mangement-section */
adminRouter.get('/all-customers', [validateGetCustomersSchema], adminController.getAllCustomers);
adminRouter.patch('/update-user-status', adminController.updateUserStatus);
adminRouter.get('/customer/:customer_id/role/:user_role_type', adminController.getCustomerById);

/* Notification-Mangement-section */
adminRouter.post("/send-notification", [validateSendNotification], notificationController.sendNotification); // Send Notification
adminRouter.get("/get-notifications", [validateGetNotifications], notificationController.getAllNotifications);  // Get All Notifications (with pagination)

export default adminRouter;
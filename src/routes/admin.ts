import { Router } from 'express';
import { validateSendNotification, validateGetNotifications } from '../validations/notifications';
import { AdminController, EditorContentController } from '../controllers';
import { NotificationController } from '../controllers/NotificationController';
import { validateGetCustomersSchema } from '../validations/adminValidation';
import { validateCreateEditorContent, validateGetEditorContent } from '../validations/editorContent';

const adminRouter = Router();
const adminController = new AdminController();
const notificationController = new NotificationController();
const editorContentController = new EditorContentController();

/* User-Mangement-section */
adminRouter.get('/all-customers', [validateGetCustomersSchema], adminController.getAllCustomers);
adminRouter.patch('/update-user-status', adminController.updateUserStatus);
adminRouter.get('/customer/:customer_id/role/:user_role_type', adminController.getCustomerById);

/* Notification-Mangement-section */
adminRouter.post("/send-notification", [validateSendNotification], notificationController.sendNotification); // Send Notification
adminRouter.get("/get-notifications", [validateGetNotifications], notificationController.getAllNotifications);  // Get All Notifications (with pagination)

// Static API's 
adminRouter.post("/create-content", [validateCreateEditorContent], editorContentController.createContent);
adminRouter.get( "/get-content", [validateGetEditorContent], editorContentController.getContentByType);
  
export default adminRouter;
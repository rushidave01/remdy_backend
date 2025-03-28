import { Router } from 'express';
import { AdminController } from '../controllers';
import { validateGetCustomersSchema } from '../validations/adminValidation';

const adminRouter = Router();
const adminController = new AdminController();

/* User-Mangement-section */
adminRouter.get('/all-customers', [validateGetCustomersSchema], adminController.getAllCustomers);
adminRouter.patch('/update-user-status', adminController.updateUserStatus);
adminRouter.get('/customer/:customer_id/role/:user_role_type', adminController.getCustomerById);

export default adminRouter;
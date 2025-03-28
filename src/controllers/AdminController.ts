import { Request, Response } from "express";
import { getPagination } from "../utils";
import logger from "../utils/logger";
import { AdminService } from "../services/AdminService";
import { AdminCustomerResponseDTO } from "../dtos";

const adminService = new AdminService();
export class AdminController {
    constructor() { }

    // for admins only
    async getAllCustomers(req: Request, res: Response) {
        try {
            // search: can search name for now
            // userRoleType: UserRole
            const { search, user_role_type: userRoleType } = req.query; // search users by their name for now

            // pagination
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const size = req.query.size ? parseInt(req.query.size as string) : 15;
            const { limit, offset } = getPagination(page, size);
            const searchOptions = { limit, offset, search, userRoleType };
            const [allCustomers, customersCount] = await adminService.getAllCustomers(searchOptions);

            const allUsersResponseData = allCustomers.map((user) => new AdminCustomerResponseDTO(user));
            logger.info(`All users fetched successfully, getUsersReport`);
            
            const hasMore = page * size < customersCount;
            
            return res.status(200).json({
                success: true,
                message: "All customers fetched successfully.",
                data: {
                    overall_stats: {
                        users: {
                            total_users: customersCount,
                            user_increased_by: true,
                            percentage: 18,
                        },
                        doctors: {
                            verified_doctors: 1893,
                            verified_doctors_increased_by: false,
                            percentage: 1,
                            aceepting_patient: 189
                        },
                    },
                    grid_data: {
                        has_more: hasMore,
                        total_users: customersCount,
                        all_customers: allUsersResponseData,
                    },
                },
            });
        } catch (error: any) {
            logger.error(`Error getUsersReport Fetch, error: ${error.message}`);
            return res
                .status(500)
                .json({ success: false, message: "something went wrong!" });
        }
    }

    async updateUserStatus(req: Request, res: Response){
        try {
            const { user_id: userId, status } = req.body;
            const updateUserStatusOptions = { userId, status };

            await adminService.updateUserStatus(updateUserStatusOptions);
            return res.status(200).json({success: true, message: "User updated successfully."});

        } catch (error: any) {
            logger.error(`Error getUsersReport Fetch, error: ${error.message}`);
            return res.status(500).json({ success: false, message: "something went wrong!" });
        }
    }

    async getCustomerById(req: Request, res: Response) {
        try {
            const { customer_id: customerId, user_role_type: userRoleType } = req.params;
            const customerOptions = { customerId, userRoleType };
            const customer = await adminService.findUserByIdAndRole(customerOptions);

            if (!customer) {
                return res.status(404).json({ success: false, message: "customer not found", data: null });
            }

            return res.status(200).json({success: true, message: "customer details fetched successfully", data: customer});
        } catch (error: any) {
            logger.error(`Error getUsersReport Fetch, error: ${error.message}`);
            return res.status(500).json({ success: false, message: "something went wrong!" });
        }
    }
}

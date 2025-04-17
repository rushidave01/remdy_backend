import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { AdminCustomerResponseDTO } from "../dtos";
import { RegisteredDoctorsResponseDTO } from "../dtos/admin/Doctor/res/doctor.response.dto";
import { AdminService } from "../services/AdminService";
import { bcryptHash, getPagination, MailService } from "../utils";
import logger from "../utils/logger";

const adminService = new AdminService();
const mailService = new MailService();

export class AdminController {
  constructor() {}

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
      const [allCustomers, customersCount] = await adminService.getAllCustomers(
        searchOptions
      );

      const allUsersResponseData = allCustomers.map(
        (user) => new AdminCustomerResponseDTO(user)
      );
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
              aceepting_patient: 189,
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

  async updateUserStatus(req: Request, res: Response) {
    try {
      const { user_id: userId, status } = req.body;
      const updateUserStatusOptions = { userId, status };

      await adminService.updateUserStatus(updateUserStatusOptions);
      return res
        .status(200)
        .json({ success: true, message: "User updated successfully." });
    } catch (error: any) {
      logger.error(`Error getUsersReport Fetch, error: ${error.message}`);
      return res
        .status(500)
        .json({ success: false, message: "something went wrong!" });
    }
  }

  async getCustomerById(req: Request, res: Response) {
    try {
      const { customer_id: customerId, user_role_type: userRoleType } =
        req.params;
      const customerOptions = { customerId, userRoleType };
      const customer = await adminService.findUserByIdAndRole(customerOptions);

      if (!customer) {
        return res
          .status(404)
          .json({ success: false, message: "customer not found", data: null });
      }

      return res.status(200).json({
        success: true,
        message: "customer details fetched successfully",
        data: customer,
      });
    } catch (error: any) {
      logger.error(`Error getUsersReport Fetch, error: ${error.message}`);
      return res
        .status(500)
        .json({ success: false, message: "something went wrong!" });
    }
  }

  // Controller method to fetch all registered doctors (with optional search, approvalStatus, and pagination)
  async getAllRegisteredDoctors(req: Request, res: Response) {
    try {
      // Extract query params
      const { search, approvalStatus } = req.query;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const size = req.query.size ? parseInt(req.query.size as string) : 10;
      const { limit, offset } = getPagination(page, size);

      const filterOptions = { limit, offset, search, approvalStatus };

      // Fetch doctors with and without pagination
      const [paginatedDoctors, allDoctors] =
        await adminService.getRegisteredDoctors(filterOptions);

      // Total doctors count
      const totalDoctorsCount = allDoctors.length;

      // Format the paginated doctors data using DTO
      const formattedDoctors = paginatedDoctors.map(
        (doctor) => new RegisteredDoctorsResponseDTO(doctor)
      );

      // Logging the success
      logger.info(`Fetched registered doctors successfully`);

      // Calculate stats
      const verifiedDoctorsCount = allDoctors.filter(
        (doctor) => doctor.active
      ).length;
      const pendingApprovalCount = allDoctors.filter(
        (doctor) => !doctor.active
      ).length;

      // Determine if more data exists for pagination
      const hasMore = page * size < totalDoctorsCount;

      // Response payload
      return res.status(200).json({
        success: true,
        message: "Register doctors fetched successfully.",
        data: {
          overall_stats: {
            doctors: {
              verified_doctors: verifiedDoctorsCount,
              new_requests: pendingApprovalCount,
            },
          },
          grid_data: {
            has_more: hasMore,
            total_doctors: paginatedDoctors.length,
            all_doctors: formattedDoctors,
          },
        },
      });
    } catch (error: any) {
      logger.error(`Error fetching registered doctors: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching registered doctors.",
      });
    }
  }

  /**
   * Controller function to approve a doctor’s registration.
   * Activates the doctor's account and sends a welcome email with credentials.
   */
  async approveDoctor(req: Request, res: Response) {
    // Extract doctor ID from the request parameters
    const doctorId = req.params.doctorId;

    try {
      // Generate a secure random password (10-character alphanumeric)
      const password = randomBytes(6)
        .toString("base64") // Convert to base64 string
        .replace(/[^a-zA-Z0-9]/g, "") // Remove special characters
        .slice(0, 10); // Trim to 10 characters

      // Convert plain password to hashedPassword
      const hashedPassword = await bcryptHash(password);

      // Call the service method to approve doctor registration
      const updatedDoctor = await adminService.approveDoctorRegistration(
        doctorId,
        hashedPassword
      );

      // If no doctor is found or already approved, return 404
      if (!updatedDoctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found or already approved.",
        });
      }

      // Send a welcome email with credentials to the doctor
      await mailService.sendDoctorWelcomeMail(
        updatedDoctor.user_name || "",
        updatedDoctor.user_email,
        password
      );

      // Log success for auditing or debugging purposes
      logger.info(
        `Doctor approved and email sent to ${updatedDoctor.user_email}`
      );

      // Send a success response to the client
      return res.status(200).json({
        success: true,
        message: "Doctor approved successfully and email sent.",
        data: updatedDoctor,
      });
    } catch (error: any) {
      // Log any error that occurred during the approval process
      logger.error(`Error approving doctor: ${error.message}`);

      // Return a generic server error response
      return res.status(500).json({
        success: false,
        message: "Something went wrong while approving the doctor.",
      });
    }
  }
}

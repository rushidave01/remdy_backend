import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { UpdateDoctorApprovalDto } from "src/dtos/admin/Doctor/req/doctor.request.dto";
import { ForwardPatientRequestDto } from "src/dtos/admin/Patient/req/forward.patient.request.dto";
import {
  AdminCustomerResponseDTO,
  PatientRequestResponseDto,
  RegisteredDoctorsResponseDTO,
} from "../dtos";
import { request_status, UserRole } from "../enums";
import { AdminService } from "../services/AdminService";
import { UserService } from "../services/UserService";
import { bcryptHash, getPagination, MailService } from "../utils";
import logger from "../utils/logger";
import { ApiResponseDto } from "../dto/res";

const adminService = new AdminService();
const mailService = new MailService();
const userService = new UserService();

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

      const {
        filteredUsers,
        filteredCount,
        totalUsers,
        verifiedDoctors,
        acceptingDoctors,
      } = await adminService.getAllCustomers({
        limit,
        offset,
        search,
        userRoleType,
      });

      const allUsersResponseData = filteredUsers.map(
        (user) => new AdminCustomerResponseDTO(user)
      );

      const hasMore = page * size < filteredCount;

      return res.status(200).json({
        success: true,
        message: "All customers fetched successfully.",
        data: {
          overall_stats: {
            users: {
              total_users: totalUsers,
              user_increased_by: true,
              percentage: 18,
            },
            doctors: {
              verified_doctors: verifiedDoctors,
              verified_doctors_increased_by: false,
              percentage: 1,
              aceepting_patient: acceptingDoctors,
            },
          },
          grid_data: {
            has_more: hasMore,
            total_users: filteredCount,
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
   * Controller to approve or reject a doctor's registration.
   *
   * - If `isAdminApprove` is true, generates a password, hashes it,
   *   activates the doctor, and sends a welcome email.
   * - If false, sends a rejection email without updating the account.
   *
   * @param req - Express request object containing doctorId and isAdminApprove in body
   * @param res - Express response object
   * @returns JSON response with success status and message
   */

  async updateDoctorStatus(req: Request, res: Response) {
    const { doctorId, isAdminApprove }: UpdateDoctorApprovalDto = req.body;

    try {
      const numericDoctorId = Number(doctorId);
      const doctor = await userService.findUserById(numericDoctorId);

      // If no doctor is found or already approved, return 404
      if (!doctor || doctor.user_role !== UserRole.doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found." });
      }

      if (doctor.active) {
        return res
          .status(400)
          .json({ success: false, message: "Doctor already approved." });
      }

      if (isAdminApprove) {
        // Generate a secure random password (10-character alphanumeric)
        const password = randomBytes(6)
          .toString("base64") // Convert to base64 string
          .replace(/[^a-zA-Z0-9]/g, "") // Remove special characters
          .slice(0, 10); // Trim to 10 characters

        // Convert plain password to hashedPassword
        const hashedPassword = await bcryptHash(password);

        // Call the service method to approve doctor registration
        const updatedDoctor = await adminService.approveDoctorRegistration(
          doctor,
          hashedPassword
        );

        // Send a welcome email with credentials to the doctor
        await mailService.sendDoctorWelcomeMail(
          doctor.user_name || "",
          doctor.user_email,
          password
        );

        return res.status(200).json({
          success: true,
          message: "Doctor approved and email sent.",
          data: updatedDoctor,
        });
      } else {
        await mailService.sendDoctorRejectionMail(
          doctor.user_name || "",
          doctor.user_email
        );

        return res.status(200).json({
          success: true,
          message: "Doctor rejected and notification email sent.",
        });
      }
    } catch (error: any) {
      logger.error(`Error updating doctor status: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error while updating doctor status.",
      });
    }
  }

  async getAllRegisteredPatients(req: Request, res: Response): Promise<any> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const size = req.query.size ? parseInt(req.query.size as string) : 10;
      const { limit, offset } = getPagination(page, size);

      // Fetch paginated + all patients
      const [paginatedPatients, allPatients] =
        await adminService.getRegisteredPatients({ limit, offset });

      const formattedPatients = paginatedPatients.map(
        (p) => new PatientRequestResponseDto(p)
      );

      const totalPatients = allPatients.length;
      const hasMore = page * size < totalPatients;

      // ----- Stats -----
      const newRequestsCount = allPatients.filter(
        (p) => p.request_status === request_status.pending
      ).length;

      const invitationSentCount = allPatients.filter(
        (p) => p.sent_to !== null
      ).length;

      const invitationPendingCount = allPatients.filter(
        (p) => p.request_status === request_status.pending && p.sent_to !== null
      ).length;

      return res.status(200).json({
        success: true,
        message: "Registered patients fetched successfully.",
        data: {
          stats: {
            total_patients: totalPatients,
            new_requests: newRequestsCount,
            invitations_sent: invitationSentCount,
            invitations_pending: invitationPendingCount,
          },
          grid_data: {
            has_more: hasMore,
            total: paginatedPatients.length,
            patients: formattedPatients,
          },
        },
      });
    } catch (error: any) {
      logger.error(`Error fetching patients: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching patients.",
      });
    }
  }

  async forwardPatientRequests(req: Request, res: Response): Promise<Response> {
    try {
      const data: ForwardPatientRequestDto = req.body;
      const { patientIds, doctorId } = data;

      const isBulk = patientIds.length > 1;

      if (!isBulk && !doctorId) {
        return res.status(400).json({
          success: false,
          message: "Doctor ID is required for single patient forwarding.",
        });
      }

      const result = await adminService.forwardPatients(patientIds, doctorId);

      return res.status(200).json({
        success: true,
        message: "Patient(s) forwarded successfully.",
        data: result,
      });
    } catch (error: any) {
      logger.error(`Error forwarding patient requests: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while forwarding patient(s).",
      });
    }
  }

  async getDashboardSummary(req: Request, res: Response): Promise<Response> {
    try {
      const roleParam = (req.query.user as string)?.toLowerCase() || "all";

      const data = await adminService.getDashboardSummary(roleParam);

      return res
        .status(200)
        .json(
          new ApiResponseDto(
            true,
            "Dashboard summary fetched successfully",
            data
          )
        );
    } catch (error) {
      console.error("Dashboard summary error:", error);
      return res
        .status(500)
        .json(
          new ApiResponseDto(false, "Internal server error", undefined, error)
        );
    }
  }
}

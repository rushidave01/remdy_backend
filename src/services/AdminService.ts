import { Like, Not } from "typeorm";
import { User } from "../entities";
import { UserRole } from "../enums";

export class AdminService {
  // for admins only
  async getAllCustomers(searchOptions: any): Promise<[User[], number]> {
    const { limit, offset, search, userRoleType } = searchOptions;
    const whereCondition: any = {};

    if (search) {
      whereCondition.user_name = Like(`%${search}%`);
    }

    if (userRoleType === UserRole.doctor) {
      whereCondition.user_role = UserRole.doctor;
    }

    if (userRoleType === UserRole.hospital) {
      whereCondition.user_role = UserRole.hospital;
    }

    if (userRoleType === UserRole.patient) {
      whereCondition.user_role = UserRole.patient;
    }

    if (!userRoleType || userRoleType === "All") {
      whereCondition.user_role = Not(UserRole.admin);
    }

    const allCustomers = await User.find({
      where: whereCondition,
      take: limit,
      skip: offset,
    });

    const customersCount = await User.count({
      where: { user_role: Not(UserRole.admin) },
    });
    return [allCustomers, customersCount];
  }

  async updateUserStatus(updateOptions: any) {
    const { userId, status } = updateOptions;
    return User.update({ id: userId }, { active: status });
  }

  async findUserByIdAndRole(customerOptions: any) {
    const { customerId, userRoleType } = customerOptions;
    const relationsOptions: any = {};

    if (userRoleType === UserRole.doctor) {
      relationsOptions.doctor_details = true;
    }

    if (userRoleType === UserRole.hospital) {
      // ❌ FIX THIS

      return User.findOne({
        where: { id: customerId, user_role: userRoleType },
        // relations: { : true } // ❌ FIX THIS,
      });
    }

    if (userRoleType === UserRole.patient) {
      relationsOptions.patient_details = true;
    }

    return User.findOne({
      where: { id: customerId, user_role: userRoleType },
      relations: relationsOptions,
    });
  }

  // Service to get registered doctors (with and without pagination)
  async getRegisteredDoctors(filterOptions: any): Promise<[User[], User[]]> {
    const { limit, offset, search, approvalStatus } = filterOptions;

    // Base query filter: only fetch doctors
    const whereCondition: any = {
      user_role: UserRole.doctor,
    };

    // Apply search filter if provided (search by username)
    if (search) {
      whereCondition.user_name = Like(`%${search}%`);
    }

    // Apply approval status filter if provided
    if (approvalStatus !== undefined) {
      whereCondition.active = approvalStatus;
    }

    // Paginated fetch
    const paginatedDoctors = await User.find({
      where: whereCondition,
      take: limit,
      skip: offset,
    });

    // Fetch all registered doctors (for stats)
    const allDoctors = await User.find({
      where: { user_role: UserRole.doctor },
    });

    return [paginatedDoctors, allDoctors];
  }

  /**
   * Approves a doctor's registration by activating their account.
   *
   * @param doctorId - The ID of the doctor to approve.
   * @returns The updated doctor user object if successful, otherwise null.
   */
  async approveDoctorRegistration(
    doctorId: string,
    hashedPassword: string
  ): Promise<User | null> {
    // Find the doctor by ID and ensure their role is 'doctor'
    const doctor = await User.findOne({
      where: { id: parseInt(doctorId), user_role: UserRole.doctor },
    });

    // If doctor doesn't exist or is already active, return null
    if (!doctor || doctor.active) return null;

    // Mark the doctor's account as active and set the random password first time
    doctor.active = true;
    doctor.user_password = hashedPassword;

    // Save the updated user record to the database
    await doctor.save();

    // Return the updated doctor
    return doctor;
  }
}

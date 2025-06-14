import { endOfWeek, format, startOfWeek } from "date-fns";
import { Between, Like, Not, IsNull } from "typeorm";
import { getDataSource } from "../config/database";
import { DoctorDetails, PatientRequest, User } from "../entities";
import { request_status, UserRole } from "../enums";

export class AdminService {
  getPatientRequestRepo() {
    return getDataSource().getRepository(PatientRequest);
  }

  // for admins only
  async getAllCustomers(searchOptions: any): Promise<{
    filteredUsers: User[];
    filteredCount: number;
    totalUsers: number;
    verifiedDoctors: number;
    acceptingDoctors: number;
  }> {
    const { limit, offset, search, userRoleType } = searchOptions;
    const whereCondition: any = {};

    // Search by username
    if (search) {
      whereCondition.user_name = Like(`%${search}%`);
    }

    // Apply user role filter
    if (userRoleType && userRoleType !== "All") {
      whereCondition.user_role = userRoleType;
    } else {
      whereCondition.user_role = Not(UserRole.admin);
    }

    // Fetch filtered users with pagination
    const filteredUsers = await User.find({
      where: whereCondition,
      take: limit,
      skip: offset,
    });

    // Count for filtered user type
    const filteredCount = await User.count({ where: whereCondition });

    // Count of ALL non-admin users (for overall stats)
    const totalUsers = await User.count({
      where: { user_role: Not(UserRole.admin) },
    });

    // Count verified doctors (user.active = true, and doctor_details exists)
    const verifiedDoctors = await User.createQueryBuilder("user")
      .innerJoin("user.doctor_details", "dd")
      .where("user.user_role = :role", { role: UserRole.doctor })
      .andWhere("user.active = true")
      .getCount();

    // Count doctors accepting patients (based on patient_request.accepted)
    const acceptingDoctors = await PatientRequest.createQueryBuilder("pr")
      .where("pr.request_status = :status", { status: request_status.accepted })
      .getCount();

    return {
      filteredUsers,
      filteredCount,
      totalUsers,
      verifiedDoctors,
      acceptingDoctors,
    };
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
  async getRegisteredDoctors(filterOptions: any): Promise<{
    paginatedDoctors: DoctorDetails[];
    totalDoctorsCount: number;
    verifiedStats: { currentMonth: number; previousMonth: number };
    pendingStats: { currentMonth: number; previousMonth: number };
  }> {
    const { limit, offset, search, doctorStatus } = filterOptions;

    const doctorRepo = getDataSource().getRepository(DoctorDetails);

    const whereClause: any = {};

    if (doctorStatus) {
      whereClause.doctor_status = doctorStatus;
    }

    if (search) {
      whereClause.user = {
        user_name: Like(`%${search}%`),
        user_role: UserRole.doctor,
      };
    } else {
      whereClause.user = {
        user_role: UserRole.doctor,
      };
    }

    const [paginatedDoctors, totalDoctorsCount] = await doctorRepo.findAndCount(
      {
        where: whereClause,
        relations: ["user"],
        take: limit,
        skip: offset,
        order: {
          created_at: "DESC",
        },
      }
    );

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const verifiedStats = {
      currentMonth: await doctorRepo
        .createQueryBuilder("doctor")
        .leftJoin("doctor.user", "user")
        .where("doctor.doctor_status = :status", {
          status: request_status.accepted,
        })
        .andWhere("user.active = true")
        .andWhere("doctor.created_at BETWEEN :start AND :end", {
          start: startOfThisMonth,
          end: now,
        })
        .getCount(),

      previousMonth: await doctorRepo
        .createQueryBuilder("doctor")
        .leftJoin("doctor.user", "user")
        .where("doctor.doctor_status = :status", {
          status: request_status.accepted,
        })
        .andWhere("user.active = true")
        .andWhere("doctor.created_at BETWEEN :start AND :end", {
          start: startOfLastMonth,
          end: endOfLastMonth,
        })
        .getCount(),
    };

    const pendingStats = {
      currentMonth: await doctorRepo
        .createQueryBuilder("doctor")
        .leftJoin("doctor.user", "user")
        .where("doctor.doctor_status = :status", {
          status: request_status.pending,
        })
        .andWhere("user.active = false")
        .andWhere("doctor.created_at BETWEEN :start AND :end", {
          start: startOfThisMonth,
          end: now,
        })
        .getCount(),

      previousMonth: await doctorRepo
        .createQueryBuilder("doctor")
        .leftJoin("doctor.user", "user")
        .where("doctor.doctor_status = :status", {
          status: request_status.pending,
        })
        .andWhere("user.active = false")
        .andWhere("doctor.created_at BETWEEN :start AND :end", {
          start: startOfLastMonth,
          end: endOfLastMonth,
        })
        .getCount(),
    };

    return {
      paginatedDoctors,
      totalDoctorsCount,
      verifiedStats,
      pendingStats,
    };
  }

  /**
   * Saves and activates a doctor by setting their password and status.
   *
   * @param doctor - The doctor entity object to approve.
   * @param hashedPassword - The hashed password to set.
   * @returns The updated doctor user object.
   */
  async approveDoctorRegistration(
    doctor: User,
    hashedPassword: string
  ): Promise<User> {
    const doctorDetailsRepository =
      getDataSource().getRepository(DoctorDetails);
    const userRepository = getDataSource().getRepository(User);

    // Step 1: Find doctor details using the doctor (user) object
    const doctorDetails = await doctorDetailsRepository.findOne({
      where: { user: { id: doctor.id } },
      relations: ["user"],
    });

    if (!doctorDetails) {
      throw new Error("Doctor details not found for the user.");
    }

    // Step 2: Update doctorDetails' doctor_status to 'ACCEPTED'
    doctorDetails.doctor_status = request_status.accepted;
    await doctorDetailsRepository.save(doctorDetails);

    // Step 3: Update the linked user's active flag and password
    doctorDetails.user.active = true;
    doctorDetails.user.user_password = hashedPassword;
    await userRepository.save(doctorDetails.user);

    return doctorDetails.user;
  }

  /**
   * Rejects a doctor by updating doctor_status in doctorDetails.
   *
   * @param doctor - The doctor User entity to reject.
   * @returns A boolean indicating success or failure.
   */
  async rejectDoctorRegistration(doctor: User): Promise<boolean> {
    const doctorDetailsRepo = getDataSource().getRepository(DoctorDetails);

    const doctorDetails = await doctorDetailsRepo.findOne({
      where: { user: { id: doctor.id } },
      relations: ["user"],
    });

    if (!doctorDetails) {
      throw new Error("DoctorDetails not found for the user.");
    }

    doctorDetails.doctor_status = request_status.rejected;
    await doctorDetailsRepo.save(doctorDetails);

    return true;
  }

  async getRegisteredPatients(filterOptions: any): Promise<{
    paginatedPatients: PatientRequest[];
    allPatients: PatientRequest[];
    newRequestStats: { currentMonth: number; previousMonth: number };
    invitationSentStats: { currentMonth: number; previousMonth: number };
    invitationPendingStats: { currentMonth: number; previousMonth: number };
  }> {
    const { limit, offset } = filterOptions;

    const paginatedPatients = await PatientRequest.find({
      relations: ["gender", "city", "province", "user", "doctor"],
      take: limit,
      skip: offset,
      order: {
        created_at: "DESC",
      },
    });

    const allPatients = await PatientRequest.find({
      relations: ["gender", "city", "province", "user", "doctor"],
    });

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const repo = getDataSource().getRepository(PatientRequest);

    const newRequestStats = {
      currentMonth: await repo.count({
        where: {
          request_status: request_status.pending,
          created_at: Between(startOfThisMonth, now),
        },
      }),
      previousMonth: await repo.count({
        where: {
          request_status: request_status.pending,
          created_at: Between(startOfLastMonth, endOfLastMonth),
        },
      }),
    };

    const invitationSentStats = {
      currentMonth: await repo.count({
        where: {
          sent_to: Not(IsNull()),
          created_at: Between(startOfThisMonth, now),
        },
      }),
      previousMonth: await repo.count({
        where: {
          sent_to: Not(IsNull()),
          created_at: Between(startOfLastMonth, endOfLastMonth),
        },
      }),
    };

    const invitationPendingStats = {
      currentMonth: await repo.count({
        where: {
          request_status: request_status.pending,
          sent_to: IsNull(),
          created_at: Between(startOfThisMonth, now),
        },
      }),
      previousMonth: await repo.count({
        where: {
          request_status: request_status.pending,
          sent_to: IsNull(),
          created_at: Between(startOfLastMonth, endOfLastMonth),
        },
      }),
    };

    return {
      paginatedPatients,
      allPatients,
      newRequestStats,
      invitationSentStats,
      invitationPendingStats,
    };
  }

  async forwardPatients(patientIds: number[], doctorId?: number): Promise<any> {
    const patientRequestRepo = this.getPatientRequestRepo();
    const updatedPatients = [];

    for (const patientId of patientIds) {
      const patient = await patientRequestRepo.findOne({
        where: { id: patientId },
      });

      if (!patient) {
        throw new Error(`Patient with ID ${patientId} not found`);
      }

      const targetDoctorId = doctorId || patient.doctor?.id;

      if (!targetDoctorId) {
        throw new Error(`Doctor ID missing for patient ID ${patientId}`);
      }

      patient.sent_to = Number(targetDoctorId);
      patient.request_status = request_status.accepted;
      await patientRequestRepo.save(patient);

      updatedPatients.push({
        patientId,
        patientName: patient.full_name,
        sentTo: targetDoctorId,
        doctorName: patient.doctor_name,
      });
    }

    return {
      updated_count: updatedPatients.length,
      forwarded: updatedPatients,
    };
  }

  async getDashboardSummary(roleParam: string) {
    const roleFilter =
      roleParam === UserRole.doctor
        ? UserRole.doctor
        : roleParam === UserRole.patient
        ? UserRole.patient
        : null;

    // 1️⃣ total users & active users by role (or all)
    const [totalUsers, totalActiveUsers] = await Promise.all([
      User.count({
        where: roleFilter ? { user_role: roleFilter } : {},
      }),
      User.count({
        where: roleFilter
          ? { user_role: roleFilter, active: true }
          : { active: true },
      }),
    ]);

    const [verifiedDoctors, unverifiedDoctors] = await Promise.all([
      User.count({
        where: { user_role: UserRole.doctor, active: true },
      }),
      User.count({
        where: { user_role: UserRole.doctor, active: false },
      }),
    ]);

    const totalAcceptedPatients = await PatientRequest.count({
      where: { request_status: request_status.accepted },
    });

    // 👇 Renamed to avoid shadowing
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 }); // Saturday

    // Use weekStart, weekEnd in your query logic and date loops

    // raw counts: one row per day between beginWeek and endWeek
    const rawDayCounts: { day: string; count: string }[] =
      await DoctorDetails.createQueryBuilder("doctor")
        .leftJoin("doctor.user", "user")
        .select("DATE(doctor.created_at)", "day") // works in Postgres & MySQL
        .addSelect("COUNT(*)", "count")
        .where("user.active = true")
        .andWhere("doctor.created_at BETWEEN :start AND :end", {
          start: weekStart,
          end: weekEnd,
        })
        .groupBy("day")
        .getRawMany();

    /* prepare zero-filled record for all 7 days */
    const dayWise: Record<string, { count: number; percentageOfWeek: number }> =
      {};

    rawDayCounts.forEach((row) => {
      const dayName = format(new Date(row.day), "EEEE");
      if (!dayWise[dayName]) {
        dayWise[dayName] = { count: 0, percentageOfWeek: 0 };
      }
      dayWise[dayName].count = Number(row.count);
    });

    const weeklyTotal = Object.values(dayWise).reduce(
      (acc, d) => acc + d.count,
      0
    );

    /* add percentage of week for each day */
    if (weeklyTotal > 0) {
      for (const value of Object.values(dayWise)) {
        value.percentageOfWeek = Math.round((value.count / weeklyTotal) * 100);
      }
    }

    // 📅 Monthly doctor availability % by `acceptingPatients` status
    const totalDoctors = await User.count({
      where: { user_role: UserRole.doctor },
    });

    const weeklyPercentageOfAllDoctors =
      totalDoctors > 0 ? Math.round((weeklyTotal / totalDoctors) * 100) : 0;

    const weeklyContactedDoctors = {
      total: weeklyTotal,
      percentageOfAllDoctors: weeklyPercentageOfAllDoctors, // whole week vs all doctors
      dayWise, // detailed breakdown
    };

    const availabilityCounts = await DoctorDetails.createQueryBuilder("doctor")
      .select("doctor.acceptingPatients", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("doctor.acceptingPatients")
      .getRawMany();

    const availability: Record<string, { count: number; percentage: number }> =
      {};
    for (const row of availabilityCounts) {
      availability[row.status] = {
        count: Number(row.count),
        percentage:
          totalDoctors > 0 ? Math.round((row.count / totalDoctors) * 100) : 0,
      };
    }

    return {
      totalUsers,
      totalActiveUsers,
      doctorStatus: {
        verifiedDoctors,
        unverifiedDoctors,
      },
      totalAcceptedPatients,
      weeklyContactedDoctors,
      doctorAvailability: availability,
    };
  }
}

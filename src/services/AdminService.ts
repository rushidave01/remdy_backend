import { Like, Not } from "typeorm";
import { DoctorDetails, User } from "../entities";
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
            relations: relationsOptions
        });
    }
}

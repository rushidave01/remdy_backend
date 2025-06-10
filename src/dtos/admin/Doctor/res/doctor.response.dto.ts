import { request_status } from "src/enums";
import { DoctorDetails, User } from "../../../../entities";

/**
 * DTO class for the response format of registered doctors
 */
export class RegisteredDoctorsResponseDTO {
  id: number;
  doctor_status?: request_status;
  user: User;

  // Constructor to initialize the DTO object with data from the User object
  constructor(doctor: DoctorDetails) {
    this.id = doctor.id;
    this.doctor_status = doctor.doctor_status;
    this.user = doctor.user;
  }
}

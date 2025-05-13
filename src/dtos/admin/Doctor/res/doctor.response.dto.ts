import { User } from "../../../../entities";

/**
 * DTO class for the response format of registered doctors
 */
export class RegisteredDoctorsResponseDTO {
  id: number;
  name: string | null;
  phone_number: string | null;
  email: string;
  address: string | null;
  status: boolean;

  // Constructor to initialize the DTO object with data from the User object
  constructor(user: User) {
    this.id = user.id;
    this.name = user.user_name ?? null;
    this.phone_number = user.user_mobile ? user.user_mobile.toString() : null;
    this.email = user.user_email;
    this.address = user.doctor_details?.address ?? null;
    this.status = user.active;
  }
}

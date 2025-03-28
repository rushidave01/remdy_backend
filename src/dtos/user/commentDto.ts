export interface UserReviewDTO {
  userId: number;
  doctorId?: number; // Optional if type is HOSPITAL
  hospitalId?: number; // Optional if type is DOCTOR
  comment?: string;
  rating: number;
  type: "DOCTOR" | "HOSPITAL";
}

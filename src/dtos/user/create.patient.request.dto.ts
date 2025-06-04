// request dto
export interface CreatePatientRequestDto {
  full_name: string;
  patient_email: string;
  phone_number?: string;
  address?: string;
  cityId: number;
  provinceId: number;
  pincode?: string;
  genderId: number;
  dob?: Date;
  had_family_doctor?: string;
  doctor_name?: string;
  doctorId: string;
}

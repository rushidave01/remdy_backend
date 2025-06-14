// address type
export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CreatePatientRequestDto {
  full_name: string;
  patient_email: string;
  phone_number?: string;
  address?: Address; // updated from string to structured object
  cityId: number;
  provinceId: number;
  pincode?: string;
  genderId: number;
  dob?: Date;
  had_family_doctor?: string;
  doctor_name?: string;
  doctorId: number;
}

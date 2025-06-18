import { DoctorDetails, PatientRequest } from "src/entities";
import { InvitationSent, request_status } from "src/enums";

export class PatientRequestResponseDto {
  id: number;
  full_name?: string;
  patient_email?: string;
  phone_number?: string | null;
  address?: string;
  pincode?: string;
  dob?: Date;
  had_family_doctor?: string;
  doctor_name?: string;
  doctor?: DoctorDetails;
  sent_to?: number;
  request_status?: request_status;
  invitation_sent?: InvitationSent;
  gender: string | null;
  city: string | null;
  province: string | null;
  user_id: number;
  created_at: Date;
  updated_at: Date;

  constructor(patient: PatientRequest) {
    this.id = Number(patient.id);
    this.full_name = patient.full_name;
    this.patient_email = patient.patient_email;
    this.phone_number = patient.phone_number;
    this.address = JSON.stringify(patient.address);
    this.pincode = patient.pincode;
    this.dob = patient.dob;
    this.had_family_doctor = patient.had_family_doctor;
    this.doctor_name = patient.doctor_name;
    this.doctor = patient.doctor;
    this.sent_to = patient.sent_to;
    this.request_status = patient.request_status;
    this.invitation_sent = patient.invitation_sent;
    this.gender = patient.gender?.gender ?? null;
    this.city = patient.city?.city ?? null;
    this.province = patient.province?.name ?? null;
    this.user_id = Number(patient.user.id);
    this.created_at = patient.created_at;
    this.updated_at = patient.updated_at;
  }
}

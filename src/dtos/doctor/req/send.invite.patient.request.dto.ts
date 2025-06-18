export interface SendInviteToPatientDto {
  doctorId: number;
  patientId: number;
  patientEmail: string;
  emailSubject: string;
  emailContent: string;
}

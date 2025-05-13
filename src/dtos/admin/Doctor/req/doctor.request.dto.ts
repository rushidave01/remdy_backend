/**
 * DTO for updating a doctor's approval status.
 * - doctorId: ID of the doctor to be approved or rejected.
 * - isAdminApprove: true for approval, false for rejection.
 */
export class UpdateDoctorApprovalDto {
  doctorId?: number;
  isAdminApprove?: boolean;
}

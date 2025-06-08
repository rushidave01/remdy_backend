import { AcceptingPatients } from "../../../enums/user.enum";

export interface UpdateAcceptingPatientsStatusDto {
  doctorId: number;
  acceptingPatients: AcceptingPatients;
}

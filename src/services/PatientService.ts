import { getDataSource } from "../config/database";
import { PatientRequest } from "../entities";

export class PatientService {
  getPatientRequestRepo() {
    return getDataSource().getRepository(PatientRequest);
  }

  async createPatientRequest(
    data: Partial<PatientRequest>
  ): Promise<PatientRequest> {
    const patientRequestRepo = this.getPatientRequestRepo();
    const patientRequest = patientRequestRepo.create(data);
    return await patientRequestRepo.save(patientRequest);
  }
}

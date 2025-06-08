import { EntityManager } from "node_modules/typeorm";
import { getDataSource } from "../config/database";
import { PatientRequest } from "../entities";

export class PatientService {
  getPatientRequestRepo() {
    return getDataSource().getRepository(PatientRequest);
  }

  async createPatientRequest(
    data: Partial<PatientRequest>,
    manager?: EntityManager
  ): Promise<PatientRequest> {
    const patientRequestRepo = manager
      ? manager.getRepository(PatientRequest)
      : this.getPatientRequestRepo();

    const patientRequest = patientRequestRepo.create(data);
    return await patientRequestRepo.save(patientRequest);
  }
}

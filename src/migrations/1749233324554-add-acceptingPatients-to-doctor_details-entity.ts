import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAcceptingPatientsToDoctorDetails implements MigrationInterface {
  name = "AddAcceptingPatientsToDoctorDetails";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ENUM type
    await queryRunner.query(`
      CREATE TYPE "doctor_details_acceptingpatients_enum" AS ENUM ('AVAILABLE', 'WAITING', 'NOT_ACCEPTING');
    `);

    // Add the column using the ENUM type
    await queryRunner.query(`
      ALTER TABLE "doctor_details"
      ADD COLUMN "acceptingPatients" "doctor_details_acceptingpatients_enum"
      NOT NULL DEFAULT 'WAITING';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the column
    await queryRunner.query(`
      ALTER TABLE "doctor_details"
      DROP COLUMN "acceptingPatients";
    `);

    // Drop the ENUM type
    await queryRunner.query(`
      DROP TYPE "doctor_details_acceptingpatients_enum";
    `);
  }
}

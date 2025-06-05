// migration file to add 'sent_to' field to patient_request
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSentToFieldToPatientRequest implements MigrationInterface {
  name = "AddSentToFieldToPatientRequest";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_request" ADD "sent_to" bigint DEFAULT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_request" DROP COLUMN "sent_to"`
    );
  }
}

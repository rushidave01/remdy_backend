import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDoctorStatusToDoctorDetails implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "doctor_details",
      new TableColumn({
        name: "doctor_status",
        type: "enum",
        enum: ["ACCEPTED", "REJECTED", "PENDING"],
        enumName: "doctor_details_doctor_status_enum", // custom enum name
        isNullable: true,
        default: "PENDING",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("doctor_details", "doctor_status");
    await queryRunner.query(`DROP TYPE doctor_details_doctor_status_enum`);
  }
}

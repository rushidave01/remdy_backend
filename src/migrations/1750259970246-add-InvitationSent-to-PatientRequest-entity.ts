import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddInvitationSentToPatientRequest implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "patient_request_invitation_sent_enum" AS ENUM ('SENT', 'SEND_INVITE')`
    );

    await queryRunner.addColumn(
      "patient_request",
      new TableColumn({
        name: "invitation_sent",
        type: "enum",
        enumName: "patient_request_invitation_sent_enum", // custom enum name
        isNullable: true,
        default: `'SEND_INVITE'`,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("patient_request", "invitation_sent");
    await queryRunner.query(`DROP TYPE "patient_request_invitation_sent_enum"`);
  }
}

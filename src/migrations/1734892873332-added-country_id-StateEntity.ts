import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCountryIdStateEntity1734892873332 implements MigrationInterface {
    name = 'AddedCountryIdStateEntity1734892873332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "states" ADD "country_id" bigint`);
        await queryRunner.query(`ALTER TABLE "states" ADD CONSTRAINT "FK_f3bbd0bc19bb6d8a887add08461" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "FK_f3bbd0bc19bb6d8a887add08461"`);
        await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "country_id"`);
    }

}

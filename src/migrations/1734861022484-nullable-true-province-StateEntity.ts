import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableTrueProvinceStateEntity1734861022484 implements MigrationInterface {
    name = 'NullableTrueProvinceStateEntity1734861022484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "FK_307856c0f82a92d0caeb244ca77"`);
        // await queryRunner.query(`ALTER TABLE "provinces" DROP CONSTRAINT "FK_0a994c2ff2af686951495418a3b"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "provinces" ADD CONSTRAINT "FK_0a994c2ff2af686951495418a3b" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "states" ADD CONSTRAINT "FK_307856c0f82a92d0caeb244ca77" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

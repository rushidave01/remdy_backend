import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedUniqueConstraintOfNameStateEntity1734894523586 implements MigrationInterface {
    name = 'RemovedUniqueConstraintOfNameStateEntity1734894523586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "UQ_fe52f02449eaf27be2b2cb7acda"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "states" ADD CONSTRAINT "UQ_fe52f02449eaf27be2b2cb7acda" UNIQUE ("name")`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedEditorContentEntity1743785723778 implements MigrationInterface {
    name = 'AddedEditorContentEntity1743785723778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."editor_content_type_enum" AS ENUM('SUPPORT', 'ABOUT', 'TERMS_AND_POLICY')`);
        await queryRunner.query(`CREATE TABLE "editor_content" (
            "id" SERIAL NOT NULL,
            "title" character varying(255) NOT NULL,
            "type" "public"."editor_content_type_enum" NOT NULL,
            "html_content" text NOT NULL,
            "status" boolean NOT NULL DEFAULT true,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "created_by" bigint NOT NULL,
            "updated_by" bigint,
            CONSTRAINT "PK_a0c9915899ccc5be70ce4db3abb" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`ALTER TABLE "editor_content" ADD CONSTRAINT "FK_943cf49d8b35b96e8c00b77a0e7" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "editor_content" ADD CONSTRAINT "FK_42f94687bbefa04b01df2e7a1bd" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "editor_content" DROP CONSTRAINT "FK_42f94687bbefa04b01df2e7a1bd"`);
        await queryRunner.query(`ALTER TABLE "editor_content" DROP CONSTRAINT "FK_943cf49d8b35b96e8c00b77a0e7"`);
        await queryRunner.query(`DROP TABLE "editor_content"`);
        await queryRunner.query(`DROP TYPE "public"."editor_content_type_enum"`);
    }
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from "typeorm";
  
  @Entity("languages")
  export class City extends BaseEntity {
    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    id!: number;
  
    @Column({
      type: "varchar",
      length: 255,
      nullable: true,
    })
    name?: string;
    
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    @DeleteDateColumn()
    deleted_at?: Date;
  }
  
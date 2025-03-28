import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { User } from "./index";
  
  @Entity("patient_location")
  export class PatientLocation extends BaseEntity {
    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    id!: number;
  
    @Column({ type: "decimal", nullable: true })
    latitude?: number;
  
    @Column({ type: "decimal", nullable: true })
    longitude?: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    city?: string;
  
    @Column({ type: "varchar", length: 255, nullable: true })
    address?: string;
    
    @ManyToOne(() => User, (user) => user.patient_location, { nullable: true })
    @JoinColumn({ name: "userId" })
    user!: User;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    @DeleteDateColumn()
    deleted_at?: Date;
  }
  
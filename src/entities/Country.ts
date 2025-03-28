import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
  } from "typeorm";
  import { Province, DoctorDetails, PatientDetails, State } from "./index";
  
  @Entity("countries")
  export class Country extends BaseEntity {
    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    id!: number;
  
    @Column({
      type: "varchar",
      length: 100,
      unique: true,
      nullable: false,
    })
    name!: string;
  
    // One-to-Many relationship with Province
    @OneToMany(() => Province, (province) => province.country)
    provinces!: Province[];

    @OneToMany(() => State, (state) => state.country, {cascade: true, onDelete: "SET NULL"})
    states!: State[];

    @OneToMany(() => DoctorDetails, (doctor_details) => doctor_details.country)
    doctor_details?: DoctorDetails[];

    @OneToMany(() => PatientDetails, (patient_details) => patient_details.country)
    patient_details?: PatientDetails[];
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    @DeleteDateColumn()
    deleted_at?: Date;
  }
  
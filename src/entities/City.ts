import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { State, PatientRequest, DoctorDetails, PatientDetails, HospitalDetails } from "./index";

@Entity("cities")
export class City extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  city?: string;

  // Many-to-One relationship with State
  @ManyToOne(() => State, (state) => state.cities, { nullable: false })
  @JoinColumn({ name: "state_id" })
  state!: State;

  @OneToMany(() => PatientRequest, (patient_request) => patient_request.city)
  patient_requests!: PatientRequest[];

  @OneToMany(() => DoctorDetails, (doctor_details) => doctor_details.city)
  doctor_details?: DoctorDetails[];

  @OneToMany(() => PatientDetails, (patient_details) => patient_details.city)
  patient_details?: PatientDetails[];

  // @OneToMany(() => HospitalDetails, (hospital_details) => hospital_details.city)
  // hospital_details?: HospitalDetails[];
  
  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

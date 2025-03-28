import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  BaseEntity,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { City, Province, DoctorDetails, PatientDetails, Country } from "./index";

@Entity({ name: "states" })
export class State extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name!: string;

  // One-to-Many relationship with City
  @OneToMany(() => City, (city) => city.state)
  cities!: City[];

  // Many-to-One relationship with Province
  @ManyToOne(() => Province, (province) => province.states, {nullable: true})
  @JoinColumn({name :"province_id"})
  province!: Province;

  @ManyToOne(() => Country, (country) => country.states)
  @JoinColumn({name :"country_id"})
  country!:Country;

  @OneToMany(() => DoctorDetails, (doctor_details) => doctor_details.state)
  doctor_details?: DoctorDetails[];

  @OneToMany(() => PatientDetails, (patient_details) => patient_details.state)
  patient_details?: PatientDetails[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
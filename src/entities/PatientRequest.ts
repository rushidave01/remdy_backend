import { IsEmail } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { has_family_doctor, request_status } from "../enums";
import {
  City,
  Country,
  DoctorDetails,
  Gender,
  Province,
  State,
  User,
} from "./index";

@Entity("patient_request")
export class PatientRequest extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({ type: "float", nullable: true })
  latitude?: number;

  @Column({ type: "float", nullable: true })
  longitude?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  landmark?: string;

  @Column({ type: "enum", enum: has_family_doctor, nullable: true })
  had_family_doctor?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  doctor_name?: string;

  @Column({ type: "enum", enum: request_status, nullable: true })
  request_status?: request_status;

  @Column({ type: "bigint", nullable: true })
  sent_to?: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  full_name?: string;

  @Column({ type: "varchar", length: 55, nullable: false })
  @IsEmail()
  patient_email?: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  phone_number?: string;

  @Column({ type: "date", nullable: true })
  dob?: Date;

  @Column({ type: "varchar", length: 20, nullable: true })
  pincode?: string;

  @ManyToOne(() => Gender, (gender) => gender.patient_request, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: "gender_id" })
  gender?: Gender;

  @ManyToOne(
    () => DoctorDetails,
    (DoctorDetails) => DoctorDetails.patient_requests,
    { nullable: true }
  )
  @JoinColumn({ name: "doctor_id" })
  doctor?: DoctorDetails;

  // Many-to-One relationship with City
  @ManyToOne(() => City, (city) => city.patient_requests, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city?: City;

  @ManyToOne(() => Province, { nullable: true })
  @JoinColumn({ name: "province_id" })
  province?: Province;

  @ManyToOne(() => State, { nullable: true })
  @JoinColumn({ name: "state_id" })
  state?: State;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country?: Country;

  @ManyToOne(() => User, (user) => user.patient_request, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

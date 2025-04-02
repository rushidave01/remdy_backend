import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { Gender, UserRole, logged_in_with } from "../enums";
import {
  DoctorDetails,
  PatientDetails,
  PatientLocation,
  PatientRequest,
  Reviews,
  Wishlist,
} from "./index";

@Entity("users")
@Unique("UQ_MOBILE", ["user_mobile"])
@Unique("UQ_UUID", ["uuid"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({
    type: "enum",
    enum: UserRole,
    default: "PATIENT",
  })
  user_role?: UserRole;

  @Column({
    type: "enum",
    enum: Gender,
  })
  gender?: Gender;

  @Column({ type: "varchar", length: 255, nullable: true })
  user_name?: string;

  @Column({ type: "varchar", length: 255, nullable: true, unique: true })
  uuid?: string;

  @Column({ type: "varchar", length: 450, nullable: true })
  profile_image_url?: string;

  @Column({ type: "varchar", length: 250, nullable: false })
  user_email!: string;

  @Column({ type: "bigint", nullable: true })
  user_mobile?: bigint;

  @Column({ type: "varchar", length: 250, nullable: true })
  user_password?: string;

  @Column({ type: "enum", enum: logged_in_with, nullable: true })
  logged_in_with?: string;

  @Column({ type: "boolean", nullable: true })
  is_verified!: boolean;

  // @Column({ type: "date", nullable: true, default: null })
  // date_of_birth?: Date | null;

  @Column({ type: "boolean", default: true }) // user_status
  active!: boolean;

  @OneToOne(() => DoctorDetails, (doctorDetails) => doctorDetails.user, {
    cascade: true,
    onDelete: "SET NULL",
  })
  doctor_details?: DoctorDetails;

  @OneToOne(() => PatientDetails, (patient_details) => patient_details.user, {
    cascade: true,
    onDelete: "SET NULL",
  })
  patient_details?: PatientDetails;

  @OneToMany(() => PatientLocation, (PatientLocation) => PatientLocation.user)
  patient_location?: PatientLocation;

  @OneToMany(() => PatientRequest, (patientRequest) => patientRequest.user, {
    cascade: true,
    onDelete: "SET NULL",
  })
  patient_request?: PatientRequest[];

  @OneToMany(() => Reviews, (review) => review.user)
  reviews!: Reviews[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist!: Wishlist[];

  // @OneToMany(() => LoginHistories, (loginHistory) => loginHistory.user)
  // login_history?: LoginHistories[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @UpdateDateColumn()
  deleted_at!: Date;
}

import { Point } from "geojson";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { City, Country, Gender, Reviews, State, User, Wishlist } from "./index";

@Entity("doctor_details")
export class DoctorDetails extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  first_name!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  last_name?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  doctor_full_name?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @Column({ type: "float", nullable: true })
  latitude?: number;

  @Column({ type: "float", nullable: true })
  longitude?: number;

  @Index({ spatial: true })
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  location?: Point;

  //gender is associated with gender table with gender_id
  @OneToOne(() => Gender, (gender) => gender.doctor_details, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: "gender_id" })
  gender?: Gender;

  @Column({ type: "text", nullable: true })
  about?: string;

  @Column("int", { array: true, nullable: true })
  language_ids?: number[];

  @Column({ type: "int", nullable: true })
  years_of_experience?: number;

  @Column("jsonb", { nullable: true })
  speciality?: { speciality: string; issued_on: string; type: string }[];

  @Column("jsonb", { nullable: true })
  post_qualifications?: { university: string; avp: string; issued_on: Date }[];

  @Column("jsonb", { nullable: true })
  registration_history?: { university: string; avp: string; issued_on: Date }[];

  //may be we can associate it to hospital id
  @Column("text", { array: true, nullable: true })
  hospital_privilages?: string[];

  @Column("jsonb", { nullable: true })
  working_time?: {
    day: string;
    open_time: Date;
    closed_time: Date;
    status: boolean;
  }[];

  @Column("text", { array: true, nullable: true })
  insurace_plan_accepted?: string[];

  @Column({ type: "boolean", default: true, nullable: true })
  is_doctor_available?: boolean;

  @Column("text", { nullable: true, array: true })
  quick_facts?: string[];

  @Column({ type: "varchar", length: 20, nullable: true })
  postal_code?: string;

  @Column({ type: "time", nullable: true })
  work_start_time?: string;

  @Column({ type: "time", nullable: true })
  work_end_time?: string;

  /////// column not created, use migrations in future
  // @Column({ type: 'text', nullable: true })
  // training?: string;

  // @Column({ type: 'varchar', length: 255, nullable: true })
  // insurance_plan?: string;

  // @Column({ type: 'varchar', length: 255, nullable: true })
  // profile_image_url?: string;

  @OneToOne(() => User, (user) => user.doctor_details, { nullable: true })
  @JoinColumn({ name: "user_id" }) // Specify the foreign key column in doctor_details
  user!: User;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.doctor, { nullable: true })
  wishlist?: Wishlist[];

  @ManyToOne(() => City, (city) => city.doctor_details, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city?: City;

  @ManyToOne(() => State, (state) => state.doctor_details, { nullable: true })
  @JoinColumn({ name: "state_id" })
  state?: State;

  @ManyToOne(() => Country, (country) => country.doctor_details, {
    nullable: true,
  })
  @JoinColumn({ name: "country_id" })
  country?: Country;

  @OneToMany(() => Reviews, (review) => review.doctor_details)
  reviews!: Reviews[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @UpdateDateColumn()
  deleted_at!: Date;
}

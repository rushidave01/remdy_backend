import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User, Gender, City, Province, State, Country } from "./index";
import { IsEmail } from "class-validator";
import { has_family_doctor, request_status } from "../enums";

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
  request_status?:request_status;
  
  //this column will be associated to doctor_details table
  @Column({type:"varchar", nullable: false})
  doctorId! :string;

  @Column({ type: "varchar", length: 100, nullable: true })
  full_name?: string;

  @Column({ type: "varchar", length: 55, nullable: false })
  @IsEmail()
  patient_email?: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  phone_number?: string;

  @Column({ type: "date", nullable: true })
  dob?: Date;
 
  @Column({type:"varchar", length: 20, nullable:true})
  pincode?:string;

  @OneToOne(() => Gender, (gender) => gender.patient_request, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({name: "gender_id"})
  gender?: Gender;

  // Many-to-One relationship with City
  @ManyToOne(() => City, (city) => city.patient_requests, { nullable: true })
  @JoinColumn({ name: "city_id" })
  city?: City;

  @ManyToOne(() => Province, { nullable: true })
  @JoinColumn({name :"province_id"})
  province?: Province;

  @ManyToOne(() => State, { nullable: true })
  @JoinColumn({name :"state_id"})
  state?: State;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({name :"country_id"})
  country?: Country;
  
  @ManyToOne(() => User, (user) => user.patient_request, { nullable: true })
  @JoinColumn({name: 'user_id'})
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BaseEntity,
    OneToOne,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { User } from "./User";
import { Gender } from "../enums";
import { State } from "./States";
import { Country } from "./Country";
  
@Entity("patient_details")
export class PatientDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => State, ( state ) => state.patient_details, { nullable: true })
  @JoinColumn({name :"state_id"})
  state?: State; 

  @ManyToOne(() => Country, ( country ) => country.doctor_details, { nullable: true })
  @JoinColumn({name :"country_id"})
  country?: Country;

  @Column({ type: "float", nullable: true })
  latitude?: number;

  @Column({ type: "float", nullable: true })
  longitude?: number;
  
  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  landmark?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  has_family_doctor?: string;

  @Column({ type: "json", nullable: true })
  wishlist?: object;

  @Column({ type: "date", nullable: true })
  dob?: Date;

  @Column({ type: "enum", enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ type: "varchar", length: 100, nullable: true })
  city?: string;

  @OneToOne(() => User, (user) => user.patient_details, {nullable:true})
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
  
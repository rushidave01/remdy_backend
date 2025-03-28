import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DoctorDetails, HospitalDetails, User } from "./index";

@Entity("reviews")
export class Reviews extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  comment!: string;

  @Column({
    type: "int",
    nullable: true,
  })
  rating!: number;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @ManyToOne(
    () => HospitalDetails,
    (hospital_details) => hospital_details.reviews,
    { nullable: true }
  )
  @JoinColumn({ name: "hospital_id" })
  hospital_details?: HospitalDetails;

  @ManyToOne(() => DoctorDetails, (doctor_details) => doctor_details.reviews, {
    nullable: true,
  })
  @JoinColumn({ name: "doctor_id" })
  doctor_details?: DoctorDetails;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

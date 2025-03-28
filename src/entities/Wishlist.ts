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
} from "typeorm";
import { User, HospitalDetails, DoctorDetails } from "./index";
import { user_wislist_status } from "../enums";

@Entity("wishlist")
export class Wishlist extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({
    type: "enum",
    nullable: true,
    enum: user_wislist_status,
  })
  wishlist_status?: user_wislist_status;

  @ManyToOne(() => DoctorDetails, (doctor) => doctor.wishlist, {
    nullable: true,
  })
  @JoinColumn({ name: "doctor_id" })
  doctor?: DoctorDetails;

  @ManyToOne(() => User, (user) => user.wishlist, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(
    () => HospitalDetails,
    (hospital_details) => hospital_details.wishlist,
    { nullable: true }
  )
  @JoinColumn({ name: "hospital_details_id" })
  hospital_details?: HospitalDetails;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

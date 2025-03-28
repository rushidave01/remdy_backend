import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  OneToMany
} from "typeorm";
import { Reviews, Wishlist } from "./index";

@Entity("hospital_details")
export class HospitalDetails extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "float", nullable: true })
  latitude?: number;

  @Column({ type: "float", nullable: true })
  longitude?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  hospital_name?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  hospital_img?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  pincode?: string;

  @Column({type: "text", array: true, nullable: true })
  quick_facts?: string[];

  @Column({type: "text", array: true, nullable: true })
  insurace_plan_accepted?: string[];

  @Column({type: 'text', array: true, nullable: true })
  hospital_quality?: string[];

  @OneToMany(() => Reviews, (review) => review.hospital_details)
  reviews!: Reviews[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.hospital_details)
  wishlist?: Wishlist[];

  // @ManyToOne(() => City, (city) => city.doctor_details, { nullable: true })
  // @JoinColumn({ name: "city_id" })
  // city?: City;

  // @ManyToOne(() => State, ( state ) => state.patient_details, { nullable: true })
  // @JoinColumn({name :"state_id"})
  // state?: State;

  // @ManyToOne(() => Country, ( country ) => country.doctor_details, { nullable: true })
  // @JoinColumn({name :"country_id"})
  // country?: Country;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

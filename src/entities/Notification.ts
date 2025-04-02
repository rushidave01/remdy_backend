import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  notification_status,
  notification_type,
  user_notification_type,
} from "../enums";

@Entity("notifications")
export class Notifications extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({ type: "float", nullable: true })
  latitude?: number;

  @Column({ type: "float", nullable: true })
  longitude?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  title?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "enum", enum: user_notification_type, nullable: true })
  user_notification_type?: user_notification_type;

  @Column({
    type: "enum",
    enum: notification_status,
    nullable: true,
    default: notification_status.pending,
  })
  notification_status!: notification_status;

  @Column({ type: "date", nullable: true })
  notification_date?: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  location?: string;

  @Column({ type: "varchar", length: 12, nullable: true })
  location_range?: string;

  @Column({
    type: "enum",
    enum: notification_type,
    nullable: false,
    default: notification_type.normal,
  })
  notification_type?: notification_type;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

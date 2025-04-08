import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { ContentType } from "../enums/settings.enum";

@Entity()
export class EditorContent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "enum", enum: ContentType })
  type!: ContentType;

  @Column({ type: "text" }) // Stores HTML content
  html_content!: string;

  @Column({ type: "boolean", default: true }) // Status flag for visibility
  status!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "created_by" })
  created_by!: User;

  @UpdateDateColumn()
  updated_at!: Date;
  
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "updated_by" })
  updated_by!: User;
}

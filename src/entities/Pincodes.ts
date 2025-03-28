import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,BaseEntity } from 'typeorm';

@Entity({ name: 'pincodes' })
export class Pincode extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ type: 'bigint', nullable: false })
  state_id!:number;

  @Column({ type: 'bigint', nullable: false })
  city_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pincode?: string;

  @Column({ type: 'tinyint', default: 1 })
  status?: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at!: Date;
}

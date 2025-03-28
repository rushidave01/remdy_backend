import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'login_histories' })
export class LoginHistories extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id!: number;

    @Column({ type: 'bigint', nullable: false })
    user_id!: number;

    @Column({ type: "decimal", nullable: true })
    latitude?: number;
  
    @Column({ type: "decimal", nullable: true })
    longitude?: number;

    @Column({ type: 'varchar', length: 45,nullable:true })
    imei_number?: string;

    @Column({ type: 'boolean', default: true })
    status?: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}

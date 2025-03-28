import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'otp_attempts' })
export class OTPAttempts extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id!: number;

    @Column({ type: 'bigint', nullable: false })
    user_id!: bigint;

    @Column({ type: 'varchar' })
    otp!: string;

    @Column({ type: 'tinyint', default: 1 })
    status?: number;

    @CreateDateColumn({ type: 'datetime' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at!: Date;
}

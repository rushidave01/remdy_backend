import { Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
     } from 'typeorm';
  
    @Entity('userDetails')
    @Unique(['mobile'])
    export class UserDetails extends BaseEntity {
      @PrimaryGeneratedColumn()
      id!: number;
    
      @Column({ type: 'bigint', nullable: true })
      userId?: bigint;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      partner_code?: string;
    
      @Column({  type: 'varchar', length: 255, nullable: true })
      distributor_code?: string;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      outlet_name?: string;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      outlet_owner_name?: string;
    
      @Column({ type: 'bigint' })
      mobile!: bigint;
    
      @Column({ type: 'bigint', nullable: true })
      whatsappNumber?: bigint;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      email?: string;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      outlet_category?: string;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      outlet_address?: string;

      @Column({ type: 'varchar', length: 255, nullable: true })
      pin?: string;

      @Column({ type: 'int',nullable: false })
      city?: number;

      @Column({ type: 'int', nullable: false })
      state?: number;

      @Column({ type: 'int', nullable: false })
      region?: number;
    
      @Column({ type: 'date', nullable: true })
      dateOfBirth?: Date;

      @Column({ type: 'date', nullable: true })
      anniversaryDate?: Date;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      distributor_name?: string;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      distributor_address?: string;
    
      @Column({ type: 'bigint', nullable: true })
      distributor_number?: bigint;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      sub_distributor_name?: string;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      sub_distributor_address?: string;

      @Column({ type: 'bigint', nullable: true })
      sub_distributor_number?: bigint;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      sale_person_name?: string;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      sales_person_empCode?: string;
    
      @Column({ type: 'varchar', length: 255, default: '0' })
      sales_paerson_HQ!: string;
    
      @Column({ type: 'varchar', length: 255, default: '0' })
      bdm_name!: string;
    
      @Column({ type: 'varchar', length: 255, nullable: true })
      rdm_name?: string;
    
      @Column({ type: 'tinyint', default: 1 })
      status!: number;

      @Column({ type: 'bigint', nullable: true })
      mappingId?: bigint;
    
      @CreateDateColumn({ type: 'datetime' })
      createdAt!: Date;
    
      @UpdateDateColumn({ type: 'datetime' })
      updatedAt!: Date;
    
    }
    
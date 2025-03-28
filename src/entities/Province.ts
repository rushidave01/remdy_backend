import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from "typeorm";
  import { State, Country } from "./index";
  
  @Entity("provinces")
  export class Province extends BaseEntity {
    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    id!: number;
  
    @Column({
      type: "varchar",
      length: 100,
      nullable: false,
    })
    name!: string;
  
    // Many-to-One relationship with Country
    @ManyToOne(() => Country, (country) => country.provinces)
    @JoinColumn({name: 'country_id'})
    country!: Country;
  
    // One-to-Many relationship with State
    @OneToMany(() => State, (state) => state.province)
    states!: State[];
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    @DeleteDateColumn()
    deleted_at?: Date;
  }
  
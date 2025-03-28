import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
  } from "typeorm";
  import {DoctorDetails, PatientRequest} from "./index"
  
  @Entity("genders")
  export class Gender extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id!: number;
  
    @Column({
      type: "varchar",
      length: 50,
      nullable:true,  
    })
    gender?:string;
  
    @OneToOne(() => PatientRequest, (patientRequest) => patientRequest.gender)
    patient_request?: PatientRequest;

    @OneToOne(() => DoctorDetails, (doctorDetails) => doctorDetails.gender)
    doctor_details?: DoctorDetails;

    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    @DeleteDateColumn()
    deleted_at?: Date; 
  }
  
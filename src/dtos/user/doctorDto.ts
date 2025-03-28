// dto/get-doctors.dto.ts
import { IsOptional, IsNumber, IsString } from "class-validator";

export class GetDoctorsDto {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  size: number = 10;

  @IsString()
  @IsOptional()
  user_role: string = "DOCTOR";

  @IsNumber()
  latitude?: number;

  @IsNumber()
  longitude?: number;
}

export class GetDoctorsByPostalCodeDto {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  size: number = 10;

  @IsString()
  @IsOptional()
  user_role: string = "DOCTOR";

  @IsString()
  area?: string;

  @IsString()
  building?: string;

  @IsString()
  postal_code?: string;

}

export class GetHospitalByPostalCodeDto {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  size: number = 10;

 

  @IsString()
  area?: string;

  @IsString()
  building?: string;

  @IsString()
  postal_code?: string;

  @IsNumber()
 latitude?: number;

  @IsNumber()
  longitude?: number;



}


export class GetDoctorsNearbyDto{
  id!: number;
  first_name !:string;
  last_name !: string;
  doctor_full_name !: string;
  profile_image_url !: string;
  doctor_speciality !: string;
  reviewsCount !:  number;
  average_rating !: number;

  

  constructor(data:any|null) {
    this.id = data.id,
    this.first_name = data.first_name,
    this.last_name = data.last_name,
    this.doctor_full_name = data.doctor_full_name,
    this.profile_image_url = data.user.profile_image_url,
    this.doctor_speciality = data.speciality[0].speciality,
    this.reviewsCount = data.reviewsCount,
    this.average_rating = data.averageRating


  }
}


export class GetDoctorsbyIdDto{
  id!: number;
  name !:string;
  address !: string[];
  rating !: number;
  profile_image_url !: string;
  patients !: number;
  rating_counts !: number;
  experience !:  number;
  quick_facts !: string[];
  about_doctor !:string;
  specialities !: string[];
  postgraduate_training !: string[];
  registration_history !: string[];
  hospital_previlages !: string[];
  insurance_plans_accepted !:  string[];

  constructor(data: any|null ) {

    this.id = data[0][0].id,
    this.name = data[0][0].user_name,
    this.profile_image_url= data[0][0].profile_image_url
    this.address = data[0][0].doctor_details?.address,
    this.rating = data.averageRating,
    this.patients = data.patientRequestCount,
    this.rating_counts = data.totalReviews
    this.experience = data[0][0].doctor_details?.years_of_experience,
    this.quick_facts = data[0][0].doctor_details?.quick_facts,
    this.about_doctor = data[0][0].doctor_details?.about,
    this.specialities = data[0][0].doctor_details?.speciality,
    this.postgraduate_training = data[0][0].doctor_details?.post_qualifications,
    this.registration_history = data[0][0].doctor_details?.registration_history,
    this.hospital_previlages = data[0][0].doctor_details?.hospital_privilages,
    this.insurance_plans_accepted = data[0][0].doctor_details?.insurace_plan_accepted
  }
}


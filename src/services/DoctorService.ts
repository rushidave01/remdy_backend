// doctor.service.ts
import {
  GetDoctorsByPostalCodeDto,
  GetDoctorsDto,
  GetDoctorsNearbyDto,
} from "../dtos/user/doctorDto";
import { User } from "../entities/User";
import { DoctorDetails } from "../entities/DoctorDetails";
import { Repository } from "typeorm";
import { getDataSource } from "../config/database";
import { Point } from "geojson";
import { UserRole } from "../enums";
import { PatientRequest, Reviews } from "../entities";


export class DoctorService {
  // Do not remove comment - Roop
  /*  private userRepository: Repository<User> = User;

async getDoctorsByLocationAndRole(
   getDoctorsDto: GetDoctorsDto
 ): Promise<any> {
   const { latitude, longitude, page, size, user_role } = getDoctorsDto;
   let doctorDetailsRepository = await getDataSource().getRepository(
     DoctorDetails
   );

   const distance = 10000; // 10 km in meters (you can adjust this)

   const doctorsQuery = doctorDetailsRepository
     .createQueryBuilder("doctor")
     .innerJoinAndSelect("doctor.user", "user")
     .where("user.user_role = :role", { role: user_role })
     .andWhere(
       "ST_DWithin(doctor.location, ST_SetSRID(ST_Point(:longitude, :latitude), 4326), :distance)",
       { longitude, latitude, distance }
     )
     .skip((page - 1) * size)
     .take(size)
     .getMany();

   const totalDoctors = await doctorDetailsRepository
     .createQueryBuilder("doctor")
     .innerJoinAndSelect("doctor.user", "user")
     .where("user.user_role = :role", { role: user_role })
     .andWhere(
       "ST_DWithin(doctor.location, ST_SetSRID(ST_Point(:longitude, :latitude), 4326), :distance)",
       { longitude, latitude, distance }
     )
     .getCount();

   return {
     doctors: await doctorsQuery,
     total: totalDoctors,
     page,
     size,
     totalPages: Math.ceil(totalDoctors / size),
   };
 }
   */

  async getDoctorsByLocationAndRole(getDoctorsDto: GetDoctorsDto): Promise<any> {
    const { latitude, longitude, page, size, user_role } = getDoctorsDto;
    const doctorDetailsRepository = await getDataSource().getRepository(DoctorDetails);

    const distance = 10 * 1000; // 10 km in meters

    // Query to get doctors with the required location and role
    const doctorsQuery = await doctorDetailsRepository
      .createQueryBuilder("doctor")
      .innerJoinAndSelect("doctor.user", "user")
      .leftJoinAndSelect("user.reviews", "reviews")  // Left join with reviews to fetch the reviews for each doctor
      .where("user.user_role = :role", { role: user_role })
      .andWhere(
        "ST_DWithin(doctor.location, ST_SetSRID(ST_Point(:longitude, :latitude), 4326), :distance)",
        { longitude, latitude, distance }
      )
      .skip((page - 1) * size)
      .take(size)
      .getMany();

    // Query to count the total number of doctors
    const totalDoctors = await doctorDetailsRepository
      .createQueryBuilder("doctor")
      .innerJoinAndSelect("doctor.user", "user")
      .where("user.user_role = :role", { role: user_role })
      .andWhere(
        "ST_DWithin(doctor.location, ST_SetSRID(ST_Point(:longitude, :latitude), 4326), :distance)",
        { longitude, latitude, distance }
      )
      .getCount();

    // Add reviews count and average rating for each doctor
    const doctorsWithReviews = doctorsQuery.map((doctor) => {
      const reviews = doctor.user.reviews || [];

      // Calculate review count and average rating
      const reviewCount = reviews.length;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

      // Add reviews count and average rating to the doctor object
      return {
        ...doctor,
        reviewsCount: reviewCount,
        averageRating: averageRating,
      };
    });
    const finalResult = doctorsWithReviews.map((item: any) => new GetDoctorsNearbyDto(item))

    return {
      doctors: finalResult,
      total: totalDoctors,
      page,
      size,
      totalPages: Math.ceil(totalDoctors / size),
    };
  }





  async getDoctorsByPostalCodeAndRole(getDoctorsDto: GetDoctorsByPostalCodeDto): Promise<any> {
    const { area, building, postal_code, page, size, user_role } = getDoctorsDto;
    // let doctorDetailsRepository = await getDataSource().getRepository( DoctorDetails );

    // const distance = 10 * 1000; // 10 km in meters (you can adjust this)

    const getData = await User.findAndCount({
      where: {
        user_role: UserRole.doctor,
        doctor_details: {
          postal_code,
        },
      },
      relations: ["doctor_details", "reviews"],
    });

    const [doctors, totalDoctors] = getData;

    return {
      doctors, // Array of User entities
      total: totalDoctors, // Total count of doctors
      page,
      size,
      totalPages: Math.ceil(totalDoctors / size),
    };
  }


  async getDoctorsByIdAndRole(id: number): Promise<any> {
    try {
      const getData = await User.findAndCount({
        where: {
          user_role: UserRole.doctor,
          id: id,
        },
        relations: [
          'doctor_details',
          'reviews',
          'patient_request',
          'doctor_details.gender',
          'doctor_details.city',
          'doctor_details.state',
          'doctor_details.country',
        ],
        loadEagerRelations: true, // Ensures related entities are fully loaded
      });

      // Calculate the count of `patient_requests` directly in a custom query
      const patientRequestCount = await PatientRequest.count({
        where: {
          user: {
            id: id,
          },
        },
      });

      // console.log('getData:', getData[0][0].reviews);
      console.log('PatientRequestCount:', patientRequestCount);
      // Extract reviews array from the fetched data

      // console.log(JSON.stringify(getData));
      
      const reviews = getData[0].length ? getData[0][0].reviews : [];

      // Calculate the average rating and total reviews
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((acc: any, review: any) => acc + review.rating, 0) / totalReviews
          : 0;

      return {
        ...getData,
        patientRequestCount, // Include the count of `patient_requests` in the response
        totalReviews, // Include the count of reviews
        averageRating: parseFloat(averageRating.toFixed(2)), // Include the average rating
      };
    } catch (err: any) {
      console.error("Error in getDoctorsByIdAndRole:", err);
      // Return an error response or rethrow the error depending on your application's needs
      throw new Error("Failed to fetch doctor data");
    }
  }

  async getReviewsForDoctorsById(id: number, orderByDesc: boolean): Promise<any> {
    try {

      let getReviews: Reviews[];
      if (orderByDesc) {
        getReviews = await Reviews.find({
          where: {
            user: {
              id: id
            }
          },
          order: { id: 'DESC' }, // Order by `created_at` in descending order
        })
      } else {
        getReviews = await Reviews.find({
          where: {
            user: {
              id: id
            }
          }

        })
      }

      return getReviews;
    } catch (err: any) {
      console.error("Error in getReviewsForDoctorsById:", err);
      // Return an error response or rethrow the error depending on your application's needs
      throw new Error("Failed to fetch doctor data");
    }
  }
  async getUserAsRoleDoctor(id: bigint, orderByDesc: boolean): Promise<any> {
    
      const getdata = await User.findOne({
        where:{
          user_role:UserRole.doctor
        }
      })
      return getdata;
  }

  async getDoctorDetailsById(id: number): Promise<DoctorDetails | null> {
    return await DoctorDetails.findOne({ where: { id } });
  }


}

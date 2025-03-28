
import {
  GetDoctorsByPostalCodeDto,
  GetDoctorsDto,
  GetHospitalByPostalCodeDto,
} from "../dtos/user/doctorDto";
import { User } from "../entities/User";
import { DoctorDetails } from "../entities/DoctorDetails";
import { Repository } from "typeorm";
import { getDataSource } from "../config/database";
import { Point } from "geojson";
import { UserRole } from "../enums";
import { HospitalDetails, PatientRequest, Reviews } from "../entities";


export class HospitalService {
  // Do not remove comment - Roop


  /*  async getHospitalByPostalCode(getHospitalData: GetHospitalByPostalCodeDto): Promise<any> {
        const {
          postal_code,
          page,
          size,
          latitude,
          longitude,
        } = getHospitalData;
      
        const offset = (page - 1) * size;
        const hospitalDetailsRepository = await getDataSource().getRepository(HospitalDetails);
        const distance = 10000; // 10 km in meters (you can adjust this)
 
        // Query builder for getting hospitals
        const queryBuilder = await hospitalDetailsRepository
          .createQueryBuilder("hospital")
          .leftJoinAndSelect("hospital.reviews", "reviews")
          .where("hospital.pincode = :postal_code", { postal_code })
          .andWhere(
            "ST_DWithin(hospital.location, ST_SetSRID(ST_Point(:longitude, :latitude), 4326), :distance)",
            { latitude, longitude, distance }
          )
          .addSelect(`
            ST_Distance(
              ST_SetSRID(ST_Point(hospital.longitude, hospital.latitude), 4326),
              ST_SetSRID(ST_Point(:longitude, :latitude), 4326)
            ) AS distance
          `)
          .setParameters({
            latitude,
            longitude,
          })
          .orderBy("distance", "ASC") // Optional: order by nearest hospitals
          .skip(offset)
          .take(size);
      
        // Execute the query to get hospitals and their distances
        const [hospitals, totalHospital] = await queryBuilder.getManyAndCount();
      
        // Enhance each hospital with additional details (reviews count, average rating, travel time)
        const hospitalsWithDetails = hospitals.map((hospital) => {
          const reviews = hospital.reviews || [];
      
          // Cast hospital to include distance
          const distanceInMeters = parseFloat((hospital as any)["distance"]); // Cast to `any` to access `distance`
      
          // Calculate reviews count and average rating
          const reviewsCount = reviews.length;
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = reviewsCount > 0 ? totalRating / reviewsCount : 0;
      
          // Approximate travel time (assuming average speed of 40 km/h)
          const distanceInKm = distanceInMeters / 1000; // Convert meters to km
          const travelTime = distanceInKm / 40 * 60; // Time in minutes (distance / speed * 60)
      
          return {
            ...hospital,
            distance: distanceInKm.toFixed(2), // Distance in km with 2 decimal places
            travelTime: Math.ceil(travelTime), // Travel time in minutes rounded up
            reviewsCount,
            averageRating: averageRating.toFixed(2), // Average rating with 2 decimal places
          };
        });
      
        return {
          hospitals: hospitalsWithDetails,
          total: totalHospital,
          page,
          size,
          totalPages: Math.ceil(totalHospital / size),
        };
      }
      
    */
  async getHospitalNearBy(getHospitalData: GetHospitalByPostalCodeDto): Promise<any> {
    const { page, size, latitude, longitude } = getHospitalData;

    const offset = (page - 1) * size;
    const distance = 10000; // 10 km in meters

    const hospitalDetailsRepository = await getDataSource().getRepository(HospitalDetails);

    // Query builder to get hospitals nearby the user's location with raw query results
    const queryBuilder = hospitalDetailsRepository
      .createQueryBuilder("hospital")
      .leftJoinAndSelect("hospital.reviews", "reviews")
      .where(
        `ST_DWithin(
                        ST_SetSRID(ST_Point(hospital.longitude, hospital.latitude), 4326),
                        ST_SetSRID(ST_Point(:longitude, :latitude), 4326),
                        :distance
                    )`,
        { longitude, latitude, distance }
      )
      .addSelect(
        `
                   ST_DistanceSphere(
    ST_MakePoint(hospital.longitude, hospital.latitude),
    ST_MakePoint(:longitude, :latitude)
) `,
        "distance"
      )
      .orderBy("distance", "ASC")
      .skip(offset)
      .take(size);

    // Execute query and fetch raw results, including distance
    const hospitals = await queryBuilder.getRawMany();
    const totalHospital = hospitals.length;

    // Enhance each hospital with additional details
    const hospitalsWithDetails = hospitals.map((hospital: any) => {
      const reviews = hospital.reviews || [];

      // Calculate review count and average rating
      const reviewsCount = reviews.length;
      const totalRating = reviews.reduce((sum: any, review: Reviews) => sum + review.rating, 0);
      const averageRating = reviewsCount > 0 ? totalRating / reviewsCount : 0;

      // Use the raw distance value from the query directly (in km)
      const distanceInKm = parseFloat(hospital.distance); // Distance is already in kilometers
      let travelTime = distanceInKm / 40 * 60; // Time in minutes (distance / speed * 60)

      // If distance is very small, ensure travel time is at least 1 minute
      if (distanceInKm < 0.1) {
        travelTime = 1; // Minimal travel time for very small distances
      }

      console.log("Distance (km):", distanceInKm, "Travel Time (min):", travelTime);

      return {
        ...hospital,
        distance: distanceInKm.toFixed(2), // Display distance in km with 2 decimal points
        travelTime: Math.ceil(travelTime), // Round up travel time to nearest minute
        reviewsCount,
        averageRating: averageRating.toFixed(2), // Average rating
      };
    });

    return {
      hospitals: hospitalsWithDetails,
      total: totalHospital,
      page,
      size,
      totalPages: Math.ceil(totalHospital / size),
    };
  }

  async findHospitalById(id: number): Promise<HospitalDetails | null> {
    return await HospitalDetails.findOne({ where: { id } })
  }

  async getHospitalById(id: number): Promise<any> {
    try {
     const getHospital = await HospitalDetails.findOne({
      where:{
        id:id
      },
      relations:['reviews']
     })
     console.log("getHospitalgetHospital",getHospital)
const reviews = getHospital?.reviews?getHospital?.reviews:[];
     const totalReviews = reviews?.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((acc: any, review: any) => acc + review.rating, 0) / totalReviews
          : 0;


      return{
        getHospital,
        totalReviews,
        averageRating

      } ;
    } catch (err: any) {
      console.error("Error in getDoctorsByIdAndRole:", err);
      // Return an error response or rethrow the error depending on your application's needs
      throw new Error("Failed to fetch doctor data");
    }
  }
  async getHospitalDetailsById(id: number): Promise<HospitalDetails | null> {
    return await HospitalDetails.findOne({ where: { id } });
  }

  async getReviewsForHospitalById(id: number, orderByDesc: boolean): Promise<any> {
    try {

      let getReviews: Reviews[];
      if (orderByDesc) {
        getReviews = await Reviews.find({
          where: {
            hospital_details: {
              id: id
            }
          },
          order: { id: 'DESC' }, // Order by `created_at` in descending order
        })
      } else {
        getReviews = await Reviews.find({
          where: {
            hospital_details: {
              id: id
            }
          }

        })
      }

      return getReviews;
    } catch (err: any) {
      console.error("Error in getReviewsForHospitalById:", err);
      // Return an error response or rethrow the error depending on your application's needs
      throw new Error("Failed to fetch doctor data");
    }
  }
  
  

}

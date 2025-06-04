// src/controllers/UserController.ts
import { Request, Response } from "express";
import { getDataSource } from "../config/database";
import { CreatePatientRequestDto } from "../dtos";
import { PatientRequestResponseDto } from "../dtos/user/create.patient.response.dto";
import { PatientLocation } from "../entities";
import { user_wislist_status, UserRole } from "../enums";
import {
  DoctorService,
  HospitalService,
  PatientService,
  PublicService,
  UserService,
} from "../services";
const userService = new UserService();
const doctorService = new DoctorService();
const hospitalService = new HospitalService();
const patientService = new PatientService();
const publicService = new PublicService();

export class UserController {
  // getWishlistRepository() {
  //   return getDataSource().getRepository(Wishlist);
  // }
  constructor() {
    this.storePatientLocation = this.storePatientLocation.bind(this);
  }

  getPatientLocationRepository() {
    return getDataSource().getRepository(PatientLocation);
  }

  async storePatientLocation(req: Request, res: Response): Promise<any> {
    try {
      const { latitude, longitude, city, address, userId } = req.body;
      const user = await userService.findUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User with this id not found",
        });
      }
      const patientRepository = this.getPatientLocationRepository();
      let newPatientLocation = patientRepository.create({
        latitude,
        longitude,
        city,
        address,
        user: userId,
      });
      await patientRepository.save(newPatientLocation);
      return res.status(200).json({
        success: true,
        message: "Patient location saved successfully",
        data: newPatientLocation,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error while saving patient location",
        error,
      });
    }
  }

  async addOrRemoveWishlistDoctor(req: Request, res: Response): Promise<any> {
    try {
      const { userId, doctorId, type } = req.body;
      const doctor_details = await doctorService.getDoctorDetailsById(doctorId);
      const user = await userService.findUserById(userId);
      if (!doctor_details || !user) {
        console.log("hello");
        return res.status(404).json({
          success: false,
          message: "doctorId and userId is not found",
        });
      }
      const isExist = await userService.findWishlistByUser(
        userId,
        doctorId,
        user_wislist_status.added
      );
      //check if wishlist already exist or not
      if (type === "add") {
        if (isExist) {
          return res.status(404).json({
            success: false,
            message: "User already wishlisted this",
          });
        }
        const wishlist = await userService.saveWishlistData({
          doctor: doctorId,
          user: userId,
          wishlist_status: user_wislist_status.added,
        });
        //send success response for wishlist add
        return res.status(200).json({
          success: true,
          message: "Doctor added in favorite successfully",
          data: wishlist,
        });
      } else {
        if (!isExist) {
          return res.status(404).json({
            success: false,
            message: "Entry not found or already removed",
          });
        }
        isExist.wishlist_status = user_wislist_status.removed;
        const updatedWishlist = await isExist.save();
        //send success response for wishlist add
        return res.status(200).json({
          success: true,
          message: "doctor removed from favorite successfully",
          data: updatedWishlist,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error while saving or removing in wishlist",
        error,
      });
    }
  }

  async addOrRemoveWishlistHospital(req: Request, res: Response): Promise<any> {
    try {
      const { userId, hospitalId, type } = req.body;
      const hospital = await hospitalService.findHospitalById(hospitalId);
      const user = await userService.findUserById(userId);
      if (!hospital || !user) {
        console.log("hello");
        return res.status(404).json({
          success: false,
          message: "hospitalId and userId is not found",
        });
      }
      const isExist = await userService.findWishlistByUserForHospital(
        userId,
        hospitalId,
        user_wislist_status.added
      );
      //check if wishlist already exist or not
      if (type === "add") {
        if (isExist) {
          return res.status(404).json({
            success: false,
            message: "User already wishlisted this",
          });
        }
        const wishlist = await userService.saveWishlistData({
          hospital_details: hospitalId,
          user: userId,
          wishlist_status: user_wislist_status.added,
        });
        //send success response for wishlist add
        return res.status(200).json({
          success: true,
          message: "hospital added in favorite successfully",
          data: wishlist,
        });
      } else {
        if (!isExist) {
          return res.status(404).json({
            success: false,
            message: "Entry not found or already removed",
          });
        }
        isExist.wishlist_status = user_wislist_status.removed;
        const updatedWishlist = await isExist.save();
        //send success response for wishlist add
        return res.status(200).json({
          success: true,
          message: "hospital removed from favorite successfully",
          data: updatedWishlist,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error while saving or removing in wishlist for hospitals",
        error,
      });
    }
  }

  async getUserDetails(req: Request, res: Response): Promise<any> {
    try {
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching user details.",
        error,
      });
    }
  }

  async getAllWishlist(req: Request, res: Response): Promise<any> {
    try {
      const { userId, type } = req.query;
      // const resp = await userService.findAllWishlist(userId, type);
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing userId. It must be a valid string.",
        });
      }
      const userIdBigInt = BigInt(userId);

      const resp = await userService.findAllWishlist(
        userIdBigInt,
        type as string
      );

      return res.status(200).json({
        success: true,
        message: "wishlist fetched successfully",
        data: resp,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error fetching wishlist.",
        error,
      });
    }
  }

  async writeReview(req: Request, res: Response): Promise<any> {
    try {
      const { userId, hospitalId, doctorId, comment, rating, type } = req.body;
      const review = await userService.writeReviews({
        userId,
        hospitalId,
        doctorId,
        comment,
        rating,
        type,
      });
      if (!review) {
        return res.status(400).json({
          success: false,
          message: "Failed to create review",
        });
      }
      return res.status(200).json({
        success: true,
        data: review,
        message: "Review created successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error while writing review.",
        error,
      });
    }
  }

  async getProfile(req: Request, res: Response): Promise<any> {
    try {
      const userId = Number(req.query.user_id);
      // Add validation to ensure userId is a valid number
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId parameter" });
      }
      const user = await userService.findUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      const data = {
        name: user?.user_name,
        user_role: user?.user_role,
        gender: user?.gender,
        profile_image_url: user?.profile_image_url,
        user_email: user?.user_email,
        user_mobile: user?.user_mobile,
      };
      return res.status(200).json({
        success: true,
        message: "user profile fetched successfully",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error while fetching profile.",
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<any> {
    try {
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Error while updating profile",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createPatientRequest(req: Request, res: Response): Promise<Response> {
    const userService = new UserService();
    try {
      const data: CreatePatientRequestDto = req.body;

      // Step 1: Create the user
      const user = await userService.createUser({
        user_name: data.full_name,
        user_email: data.patient_email,
        user_mobile: data.phone_number ? BigInt(data.phone_number) : undefined,
        user_role: UserRole.patient,
        is_verified: false,
        active: false,
      });

      // Get Gender by genderId
      const gender = await publicService.getGenderById(data.genderId);

      // Get Province by provinceId
      const province = await publicService.getProvinceById(data.provinceId);

      // Get City by cityId
      const city = await publicService.getCityById(data.cityId);
 
      // Step 2: Create the patient request linked to the user
      const patientRequest = await patientService.createPatientRequest({
        full_name: data.full_name,
        patient_email: data.patient_email,
        phone_number: data.phone_number,
        address: data.address,
        city: city,
        province: province,
        pincode: data.pincode,
        gender: gender,
        dob: data.dob,
        had_family_doctor: data.had_family_doctor,
        doctor_name: data.doctor_name,
        doctorId: data.doctorId,
        user: user,
      });
      const responseDto = new PatientRequestResponseDto(patientRequest);

      return res.status(201).json({
        success: true,
        message: "Patient request created successfully",
        data: responseDto,
      });
    } catch (error) {
      console.error("Error in createPatientRequest:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getApprovedDoctors(req: Request, res: Response): Promise<any> {
    try {
      const doctors = await userService.getApprovedDoctors();

      const responseData = doctors.map((doc) => ({
        id: doc.id,
        name: doc.user_name,
        email: doc.user_email,
        CreatedAt: doc.created_at,
      }));

      return res.status(200).json({
        success: true,
        message: "Approved doctors fetched successfully",
        data: responseData,
      });
    } catch (error) {
      console.error("Error fetching approved doctors:", error);
      return res.status(500).json({
        success: false,
        message: "Error while fetching approved doctors",
      });
    }
  }
}

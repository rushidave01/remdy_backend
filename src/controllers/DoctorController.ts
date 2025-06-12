// src/controllers/UserController.ts

import { Request, Response } from "express";
import { UpdateAcceptingPatientsStatusDto } from "src/dtos/doctor/req/update.doctor.details.request.dto";
import { ApiResponseDto } from "../dto/res";
import { GetDoctorsbyIdDto } from "../dtos/user/doctorDto";
import { UserRole } from "../enums";
import { NotificationService } from "../services";
import { DoctorService } from "../services/DoctorService";
import {
  getDoctorsByIdSchema,
  getDoctorsByPostalSchema,
  locationSchema,
} from "../validations/userDTO";

const doctorService = new DoctorService();
const notificationService = new NotificationService();

export class DoctorController {
  async getDoctors(req: Request, res: Response) {
    try {
      const { error, value: data } = locationSchema.validate(req.body);
      if (error) {
        return res.status(201).json({
          status: false,
          message: "Validation error",
          error: error.details[0].message,
        });
      }
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const size = req.query.size ? parseInt(req.query.size as string, 10) : 10;
      let query = {
        page,
        size,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        user_role: "DOCTOR",
      };

      const result = await doctorService.getDoctorsByLocationAndRole(query);

      if (!result || result.length <= 0) {
        return res.status(200).json({
          success: false,
          message: "No Doctor details found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Doctor details fetched",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          status: false,
          message: "Something went wrong, please try again later.",
          error: error.message,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "Something went wrong, please try again later.",
        });
      }
    }
  }

  async getDoctorsByPostalCode(req: Request, res: Response) {
    try {
      const { error, value: data } = getDoctorsByPostalSchema.validate(
        req.body
      );
      if (error) {
        return res.status(201).json({
          status: false,
          message: "Validation error",
          error: error.details[0].message,
        });
      }
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const size = req.query.size ? parseInt(req.query.size as string, 10) : 10;
      let query = {
        page,
        size,
        postal_code: data.postal_code,
        area: data.area,
        building: data.building,
        user_role: "DOCTOR",
      };

      const result = await doctorService.getDoctorsByPostalCodeAndRole(query);
      if (!result || result.length <= 0) {
        return res.status(200).json({
          success: false,
          message: "No Doctor details found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Doctor details fetched",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          status: false,
          message: "Something went wrong, please try again later.",
          error: error.message,
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "Something went wrong, please try again later.",
        });
      }
    }
  }

  async getDoctorsById(req: Request, res: Response) {
    try {
      const { error, value: data } = getDoctorsByIdSchema.validate(req.params);
      if (error) {
        return res.status(201).json({
          status: false,
          message: "Validation error",
          error: error.details[0].message,
        });
      }

      const doctorId = data.doctor_id;
      const result = await doctorService.getDoctorsByIdAndRole(doctorId);

      if (!result || result.length <= 0) {
        return res.status(200).json({
          success: false,
          message: "No Doctor details found",
        });
      }

      const finalResult = new GetDoctorsbyIdDto(result);

      return res.status(200).json({
        success: true,
        message: "Doctor details fetched",
        data: finalResult,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong!",
      });
    }
  }

  async getReviewsForDoctorsById(req: Request, res: Response) {
    const { error, value: data } = getDoctorsByIdSchema.validate(req.params);

    if (error) {
      return res.status(201).json({
        status: false,
        message: "Validation error",
        error: error.details[0].message,
      });
    }
    // const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    // const size = req.query.size ? parseInt(req.query.size as string, 10) : 10;
    // let query = {
    //     page,
    //     size,
    //     postal_code: data.postal_code,
    //     area:data.area,
    //     building:data.building,
    //     user_role: "DOCTOR"
    // }

    const doctorId = data.doctor_id;
    const getUserasDoctor = await doctorService.getUserAsRoleDoctor;
    const descending = req.query.desc ? true : false;
    if (!getUserasDoctor) {
      return res.status(200).json({
        success: false,
        message: "Kindly send doctor id or correct doctor in list",
      });
    }

    const result = await doctorService.getReviewsForDoctorsById(
      doctorId,
      descending
    );
    // const finalResult = new GetDoctorsbyIdDto(result);
    // console.log("finalResult",finalResult)
    if (!result || result.length <= 0) {
      return res.status(200).json({
        success: false,
        message: "No Reviews for doctor details found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Reviews for doctor details fetched",
      data: result,
    });
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async getAllPatientNotifications(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const size = req.query.size ? parseInt(req.query.size as string) : 10;

      const notifications = await notificationService.getAllNotifications({
        page: Number(page),
        size: Number(size),
        search: "",
        user_role_type: UserRole.patient,
      });

      return res
        .status(200)
        .json(
          new ApiResponseDto(
            true,
            "Notifications retrieved successfully",
            notifications
          )
        );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res
        .status(500)
        .json(
          new ApiResponseDto(
            false,
            "Error while fetching notifications.",
            undefined,
            error
          )
        );
    }
  }

  async updateAcceptingPatientsStatus(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const updateDto: UpdateAcceptingPatientsStatusDto = req.body;

      const updated = await doctorService.updateAcceptingPatientsStatus(
        updateDto.doctorId,
        updateDto.acceptingPatients
      );

      return res
        .status(200)
        .json(
          new ApiResponseDto(
            true,
            "Doctor status updated successfully",
            updated
          )
        );
    } catch (error: any) {
      if (error instanceof Error && error.message === "Doctor not found.") {
        return res
          .status(404)
          .json(
            new ApiResponseDto(
              true,
              "Error while updating accepting status of doctor",
              undefined,
              error.message
            )
          );
      } else {
        console.error("Error updating status:", error);
        return res
          .status(500)
          .json(
            new ApiResponseDto(true, "Internal Server Error", undefined, error)
          );
      }
    }
  }
}

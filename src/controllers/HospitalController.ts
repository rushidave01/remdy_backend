import { Request, Response } from 'express';
import { HospitalService } from '../services/HospitalService';
import { getDoctorsByPostalSchema, getHospitalByIdSchema, locationSchema } from '../validations/userDTO';
import { GetHospitalsNearbyDto } from '../dtos/user/hospitalDto';


const hospitalService = new HospitalService()
export class HospitalController {

    async getNearByHospitals(req: Request, res: Response) {
        try {

            const { error, value: data } = locationSchema.validate(req.body);
            if (error) {
                return res.status(201).json({ status: false, message: 'Validation error', error: error.details[0].message });
            }
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const size = req.query.size ? parseInt(req.query.size as string, 10) : 10;
            let query = {
                page,
                size,
                latitude: data.latitude,
                longitude: data.longitude,
            }

            const result = await hospitalService.getHospitalNearBy(query);
            const finalResult = result.hospitals.map((item: any) => new GetHospitalsNearbyDto(item))
            if (!result || result.length <= 0) {
                return res.status(200).json({
                    success: false,
                    message: "No Hospital details found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Hospital details fetched",
                data: finalResult
            })

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    status: false,
                    message: 'Something went wrong, please try again later.',
                    error: error.message,
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: 'Something went wrong, please try again later.',
                });
            }
        }



    }

    async getHospitalById(req: Request, res: Response) {

        try {
            const { error, value: data } = getHospitalByIdSchema.validate(req.params);
            console.log("eeee", data)
            if (error) {

                return res.status(201).json({ status: false, message: 'Validation error', error: error.details[0].message });
            }

            const hospitalId = data.hospital_id;

            const result = await hospitalService.getHospitalById(hospitalId);
            // const finalResult = new GetDoctorsbyIdDto(result);
            console.log("finalResult", result)
            if (!result) {
                return res.status(200).json({
                    success: false,
                    message: "No Hospital details found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Hospital details fetched",
                data: result
            })
        } catch (error) {
            console.log("Error", error)
            if (error instanceof Error) {
                return res.status(500).json({
                    status: false,
                    message: 'Something went wrong, please try again later.',
                    error: error.message,
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: 'Something went wrong, please try again later.',
                });
            }
        }
    }

    async getReviewsForHospitalById(req: Request, res: Response) {

        try {
            const { error, value: data } = getHospitalByIdSchema.validate(req.params);
            console.log("eeee", data)
            if (error) {

                return res.status(201).json({ status: false, message: 'Validation error', error: error.details[0].message });
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

            const hospitalId = data.hospital_id;
            const gethospitalasDoctor = await hospitalService.getHospitalDetailsById(data.hospitalId);
            const descending = req.query.desc ? true : false;
            if (!gethospitalasDoctor) {
                return res.status(200).json({
                    success: false,
                    message: "Kindly send hospital id or correct hospital in list"
                })
            }


            const result = await hospitalService.getReviewsForHospitalById(hospitalId, descending);
            // const finalResult = new GetDoctorsbyIdDto(result);
            // console.log("finalResult",finalResult)
            if (!result || result.length <= 0) {
                return res.status(200).json({
                    success: false,
                    message: "No Reviews for hospital details found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Reviews for hospital details fetched",
                data: result
            })

        } catch (error) {
            console.log("Error", error)
            if (error instanceof Error) {
                return res.status(500).json({
                    status: false,
                    message: 'Something went wrong, please try again later.',
                    error: error.message,
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: 'Something went wrong, please try again later.',
                });
            }
        }
    }
}
import { Request, Response } from "express";
import { NotificationRequestDto } from "../dto/req/notification.request.dto";
import { ApiResponseDto } from "../dto/res/api.response.dto";
import { NotificationResponseDto } from "../dto/res/notification.response.dto";
import { NotificationService } from "../services/NotificationService";

const notificationService = new NotificationService();

export class NotificationController {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async sendNotification(
    req: Request,
    res: Response
  ): Promise<Response<ApiResponseDto<NotificationResponseDto>>> {
    try {
      const notificationDto: NotificationRequestDto = req.body;

      const notification = await notificationService.createNotification(
        notificationDto
      );

      if (!notification) {
        return res
          .status(400)
          .json(new ApiResponseDto(false, "Failed to send notification"));
      }

      return res
        .status(200)
        .json(
          new ApiResponseDto(
            true,
            "Notification sent successfully",
            notification
          )
        );
    } catch (error) {
      console.error("Error sending notification:", error);
      return res
        .status(500)
        .json(
          new ApiResponseDto(
            false,
            "Error while sending notification.",
            undefined,
            error
          )
        );
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async getAllNotifications(req: Request, res: Response): Promise<Response> {
    try {
      const { page = "1", size = "10" } = req.query as {
        page?: string;
        size?: string;
      };

      const notifications = await notificationService.getAllNotifications({
        page: Number(page),
        size: Number(size),
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
}

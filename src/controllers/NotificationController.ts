import { Request, Response } from "express";
import { UserRole } from "src/enums";
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
      // Search notification by it's title
      const { search, user_role_type } = req.query; 
      const userRoleType = user_role_type as UserRole;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const size = req.query.size ? parseInt(req.query.size as string) : 10;

      const notifications = await notificationService.getAllNotifications({
        page: Number(page),
        size: Number(size),
        search: search as string,
        user_role_type: userRoleType,
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

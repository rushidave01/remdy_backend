import { user_notification_type, UserRole } from "src/enums";
import { getDataSource } from "../config/database";
import { NotificationRequestDto } from "../dto/req/notification.request.dto";
import { NotificationResponseDto } from "../dto/res/notification.response.dto";
import { Notifications } from "../entities";
import { getPagination } from "../utils";

export class NotificationService {
  constructor() {}

  getNotificationRepository() {
    return getDataSource().getRepository(Notifications);
  }

  /**
   *
   * @param notificationDto
   * @returns
   */
  async createNotification(
    notificationDto: NotificationRequestDto
  ): Promise<NotificationResponseDto | null> {
    const {
      title,
      description,
      latitude,
      longitude,
      location,
      location_range,
      notification_type,
      user_notification_type,
    } = notificationDto;
    const notificationRepository = this.getNotificationRepository();

    try {
      // Create and save notification
      const notification = notificationRepository.create({
        title,
        description,
        latitude,
        longitude,
        location,
        location_range,
        notification_type,
        user_notification_type,
      });

      const savedNotification = await notificationRepository.save(notification);
      return new NotificationResponseDto(savedNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  }

  /**
   *
   * @param options
   * @returns
   */
  async getAllNotifications(options: {
    page: number;
    size: number;
    search?: string;
    user_role_type: UserRole;
  }) {
    const { page, size, search, user_role_type } = options;
    const { limit, offset } = getPagination(page, size);

    try {
      const queryBuilder = this.getNotificationRepository()
        .createQueryBuilder("notifications")
        .orderBy("notifications.created_at", "DESC")
        .skip(offset)
        .take(limit);

      // Apply search filter if provided
      if (search) {
        queryBuilder.andWhere("notifications.title ILIKE :search", {
          search: `%${search}%`,
        });
      }

      // Apply user_role_type filter if provided
      if (user_role_type) {
        queryBuilder.andWhere(
          "notifications.user_notification_type = :user_role_type",
          {
            user_role_type,
          }
        );
      }

      const [notifications, total] = await queryBuilder.getManyAndCount();

      const formattedNotifications = notifications.map(
        (n) => new NotificationResponseDto(n)
      );
      const hasMore = page * size < total;

      return {
        grid_data: {
          has_more: hasMore,
          total_notifications: total,
          all_notifications: formattedNotifications,
        },
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error("Failed to fetch notifications");
    }
  }
}

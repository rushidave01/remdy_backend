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
      notificationType,
      userNotificationType,
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
        notification_type: notificationType,
        user_notification_type: userNotificationType,
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
  async getAllNotifications(options: { page: number; size: number }) {
    const { page, size } = options;
    const { limit, offset } = getPagination(page, size);

    try {
      const [notifications, total] =
        await this.getNotificationRepository().findAndCount({
          order: { created_at: "DESC" },
          skip: offset,
          take: limit,
        });

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

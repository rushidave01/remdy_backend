import { notification_type, user_notification_type } from "src/enums";

export class NotificationRequestDto {
  title!: string;
  description!: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  location_range?: string;
  notification_type!: notification_type;
  user_notification_type!: user_notification_type;
}

export class GetNotificationsRequestDto {
  userId!: number;
  page?: number;
  limit?: number;
}

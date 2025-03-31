import { user_notification_type } from "src/enums";

export class NotificationResponseDto {
  id!: number;
  title!: string;
  description!: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  notification_type!: string;
  user_notification_type!: user_notification_type;
  created_at!: Date;

  constructor(notification: any) {
    this.id = notification.id;
    this.title = notification.title;
    this.description = notification.description;
    this.latitude = notification.latitude;
    this.longitude = notification.longitude;
    this.location = notification.location;
    this.notification_type = notification.notification_type;
    this.user_notification_type = notification.user_notification_type;
    this.created_at = notification.created_at;
  }
}

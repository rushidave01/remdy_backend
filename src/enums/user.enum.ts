export enum UserRole {
    patient = 'PATIENT',
    doctor = 'DOCTOR',
    hospital = 'HOSPITAL',
    admin = 'ADMIN'
}

export enum OTP_status {
  pending = "PENDING",
  used = "USED",
  expired = "EXPIRED",
}

export enum has_family_doctor {
  yes = "YES",
  no = "NO",
}

export enum request_status {
  accepted = "ACCEPTED",
  rejected = "REJECTED",
  pending = "PENDING",
}

export enum doctor_type {
  family = "FAMILY_DOCTOR"
}

export enum user_wislist_status {
  removed= "REMOVED",
  added = "ADDED"
}

export enum logged_in_with {
  google = 'GOOGLE',
  apple = 'APPLE'
} 


export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
} 

export class GetHospitalsNearbyDto{
  id!: number;
  name !:string;
  address !: string;
  hospital_image !: string;
  reviews_count !: number;
  average_rating !: number;
  distance !: number;
  travel_time !: number;

  constructor(data:any|null) {
    this.id = data.hospital_id,
    this.name = data.hospital_hospital_name,
    this.address = data.hospital_address,
    this.hospital_image = data.hospital_hospital_img,
    this.reviews_count = data.reviewsCount,
    this.average_rating = data.averageRating,
    this.distance = data.distance,
    this.travel_time = data.travelTime
  }
}


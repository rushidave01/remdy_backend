import { PatientLocation, Reviews, User, Wishlist } from "../entities";
import { getDataSource } from "../config/database";
import { user_wislist_status } from "../enums";
import { UserRole } from "../enums";
import { bcryptHash } from '../utils';

export class UserService {
  
  getUserRepository() {
    return getDataSource().getRepository(User);
  }

  getReviewsRepository() {
    return getDataSource().getRepository(Reviews);
  }

  getWishlistRepository() {
    return getDataSource().getRepository(Wishlist);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.getUserRepository().findOne({ where: { user_email: email } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const userRepository = this.getUserRepository();
    const newUser = userRepository.create(userData);

    return userRepository.save(newUser);
  }

  async createAdmin(email: string, password: string){    
    const admin = new User();
    admin.user_email = email;
    admin.user_password = await bcryptHash(password);
    admin.user_role = UserRole.admin;
    return admin.save();

  }

  async findUserById(userId: number): Promise<User | null> {
    return this.getUserRepository().findOne({ where: { id: userId } });
  }

  async findWishlistByUser(
    userId: number,
    doctorId: number,
    type: user_wislist_status
  ): Promise<Wishlist | null> {
    return await this.getWishlistRepository().findOne({
      where: {
        user: { id: userId },
        doctor: { id: doctorId },
        wishlist_status: type,
      },
    });
  }

  async findWishlistByUserForHospital(
    userId: number,
    hospitalId: number,
    type: user_wislist_status
  ): Promise<Wishlist | null> {
    return await this.getWishlistRepository().findOne({
      where: {
        user: { id: userId },
        hospital_details: { id: hospitalId },
        wishlist_status: type,
      },
    });
  }

  //create or save wishlist for user
  async saveWishlistData(
    userWishlistData: Partial<Wishlist>
  ): Promise<Wishlist> {
    const wishlistRepository = this.getWishlistRepository();
    const wishlist = wishlistRepository.create(userWishlistData);
    return wishlistRepository.save(wishlist);
  }

  async findAllWishlist(
    userId: bigint,
    type: string
  ): Promise<Wishlist[] | null> {
    const qb = this.getWishlistRepository().createQueryBuilder("wishlist");
    if (type === "DOCTOR") {
      qb.leftJoinAndSelect("wishlist.doctor", "doctor")
        .leftJoinAndSelect("doctor.user", "user")
        .leftJoin("user.reviews", "reviews")
        .select([
          "wishlist.id",
          "wishlist.created_at",
          "doctor.id",
          "doctor.first_name",
          "doctor.last_name",
          "doctor.doctor_full_name",
          "doctor.is_doctor_available",
          "doctor.speciality",
          "user.profile_image_url",
        ])
        .addSelect(
          "ROUND(COALESCE(AVG(reviews.rating), 0), 1)",
          "doctor_average_rating"
        )
        .where("wishlist.user_id = :userId", { userId })
        .andWhere("wishlist.hospital_details_id IS NULL")
        .andWhere("wishlist.wishlist_status = :status", {
          status: user_wislist_status.added,
        })
        .groupBy("wishlist.id")
        .addGroupBy("doctor.id")
        .addGroupBy("user.id");

      const result = await qb.getRawMany();
      return result;
    } else if (type === "HOSPITAL") {
      qb.leftJoinAndSelect("wishlist.hospital_details", "hospital_details")
        .leftJoin("hospital_details.reviews", "reviews")
        .leftJoin(
          (qb) =>
            qb
              .from(PatientLocation, "pl")
              .select([
                "pl.latitude AS user_latitude",
                "pl.longitude AS user_longitude",
                "pl.userId AS location_user_id",
              ])
              .where("pl.userId = :userId", { userId })
              .orderBy("pl.created_at", "DESC")
              .limit(1),
          "user_location",
          "user_location.location_user_id = wishlist.user_id"
        )
        .select([
          "wishlist.id",
          "wishlist.created_at",
          "hospital_details.id",
          "hospital_details.address",
          "hospital_details.hospital_name",
          "hospital_details.hospital_img",
        ])
        .addSelect(
          "ROUND(COALESCE(AVG(reviews.rating), 0), 1)",
          "hospital_average_rating"
        )
        .addSelect("COUNT(reviews.id)", "total_reviews")
        .addSelect(
          `6371 * 2 * ASIN(
            SQRT(
              POWER(SIN((user_location.user_latitude - hospital_details.latitude) * PI() / 180 / 2), 2) +
              COS(user_location.user_latitude * PI() / 180) *
              COS(hospital_details.latitude * PI() / 180) *
              POWER(SIN((user_location.user_longitude - hospital_details.longitude) * PI() / 180 / 2), 2)
            )
          )`,
          "distance"
        )
        .where("wishlist.user_id = :userId", { userId })
        .andWhere("wishlist.doctor_id IS NULL") // Ensure doctor is null
        .andWhere("wishlist.wishlist_status = :status", {
          status: user_wislist_status.added,
        })
        .groupBy("wishlist.id")
        .addGroupBy("hospital_details.id")
        .addGroupBy("user_location.user_latitude")
        .addGroupBy("user_location.user_longitude");

      const result = await qb.getRawMany();
      return result;
    }
    return null;
  }

  async writeReviews(userReviewData: any): Promise<Reviews | null> {
    const { userId, hospitalId, doctorId, comment, rating, type } =
      userReviewData;
    const reviewRepository = this.getReviewsRepository();
    try {
      const review = reviewRepository.create({
        comment,
        rating,
        user: { id: userId },
        ...(type === "DOCTOR"
          ? { doctor_details: { id: doctorId } }
          : { hospital_details: { id: hospitalId } }),
      });
      return await reviewRepository.save(review);
    } catch (error) {
      console.error("Error creating review:", error);
      return null;
    }
  }
}


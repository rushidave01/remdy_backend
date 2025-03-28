import { Request, Response } from "express";
import { UserRole } from "../enums";
import {
  AuthService,
  UserService,
  JwtService,
  LoginHistoryService,
} from "../services";
import { isValidPassword } from "../utils/utils";

const authService = new AuthService();
const jwtService = new JwtService();
const loginHistoryService = new LoginHistoryService();
const userService = new UserService();

export class AuthController {

  async signInWithGoogle(req: Request, res: Response): Promise<any> {
    try {
      const { googleToken, latitude, longitude, imei_number } = req.body;

      // Step 1: Verify Google Token
      const googleUserData = await authService.verifyGoogleToken(googleToken);

      if (!googleUserData.success) {
        // return res
        //   .status(401)
        //   .json({ success: false, message: "Invalid Google token" });
      }

      // Step 2: Find or Create User in Database
      // let user = await userService.findUserByEmail(googleUserData.data?.email);
      let user = await userService.findUserByEmail('parth9540@gmail.com');

      if (!user) {
        //creating user if new
        user = await userService.createUser({
          user_email: googleUserData.data?.email,
          logged_in_with: "GOOGLE",
          user_name: googleUserData.data?.name,
          profile_image_url: googleUserData.data?.picture,
          user_role: UserRole.patient,
        });

        // create signuphistory here
      }

      // Step 3: Generate JWT Token
      const jwtToken = await jwtService.generateJWT(user);

      // Step 4: Log the Login Activity
      await loginHistoryService.createLoginHistory({
        user_id: user?.id,
        latitude,
        longitude,
        imei_number,
      });

      // Step 5: Send Response with JWT and User Data
      return res.status(200).json({
        message: "User authenticated successfully",
        token: jwtToken,
        user: {
          id: user.id,
          email: user.user_email,
          name: user.user_name,
          profile_picture: user.profile_image_url,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error while signing with google",
        status: false,
        error: error,
      });
    }
  }

  async loginWithEmail(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      let user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          message: "user with this email not found",
          success: false,
        });
      }

      if (user.user_role !== UserRole.admin){
        return res.status(401).json({
          message: "invalid request!",
          success: false,
        });
      }

      const hashedPassword = user?.user_password || "";
      const isValid = await isValidPassword(password, hashedPassword);
      if (!isValid) {
        return res.status(401).json({
          message: "Invalid password",
          success: false,
        });
      }
      const jwtToken = await jwtService.generateJWT(user);

      const data = {
        token: jwtToken,
        payload: {
          email,
          user_id: user.id,
          role: user.user_role
        }
      }

      return res.status(200).json({
        message: "Admin logged in successfully",
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error while login with email and password",
        status: false,
        error: error,
      });
    }
  }
}

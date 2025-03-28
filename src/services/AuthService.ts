// import { loginUserDTO, verifyOtpDTO } from "src/dtos/user/UserDTO";
// import { User, OTPAttempts, LoginHistories } from "../entities";
import axios from "axios";
import { GoogleTokenResult } from "../dtos";
import { UserService } from "../services"
  
// function generateRandomCode(): string {
//   // Generate a random number between 0 and 99999
//   const randomNumber = Math.floor(Math.random() * 100000);
//   // Pad the number with leading zeros if necessary to ensure it is 5 digits
//   const randomCode = randomNumber.toString().padStart(5, "0");
//   return randomCode;
// }

export class AuthService {
    private userService: UserService;

    constructor(){
        this.userService = new UserService();
    }

    async verifyGoogleToken(token: string):Promise<{success: boolean, message: string, data?: Record<any, any>}>{
        try {
            const googleToken = token;
            const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
            googleOauthURL.searchParams.set('id_token', googleToken);
            const { data } = await axios.get<GoogleTokenResult>(googleOauthURL.toString(),{
                responseType: 'json'
            });

            // const user = await this.userService.findUserByEmail(data?.email)
            // if(!user){
            //     // handel error -> user not found
            //     return { success: false, message: `user not found!`}
            // }
            return { success: true, message: `user validated successfully`, data}
         } catch (error) {
            console.log(error);
            return { success: false, message: `${error}`}
         }
    }
}


import { User } from "../../entities";


export class AdminCustomerResponseDTO {
    id: number;
    name: string | null;
    user_role_type: string | null;
    phone_number: string | null;
    email: string;
    provence: string | null; // work on this later
    is_verified: boolean | null;
    status: boolean;

    constructor(user: User){
        this.id = user.id;
        this.name = user.user_name ? user.user_name : null;
        this.user_role_type = user.user_role ? user.user_role : null;
        this.phone_number = user.user_mobile ? user.user_mobile.toString() : null;
        this.email = user.user_email;
        this.provence = null; // fix this
        this.is_verified = user.is_verified ? user.is_verified : null;
        this.status = user.active
    }
}
import { LoginHistories } from "../entities";
import { getDataSource } from "../config/database";

export class LoginHistoryService {
  getLoginHistoryRepository(){
    return getDataSource()
    .getRepository(LoginHistories);
  }
  
  async createLoginHistory(
    loginData: Partial<LoginHistories>
  ): Promise<LoginHistories> {
    
    const loginHistoryRepository = this.getLoginHistoryRepository();
    const loginHistory = loginHistoryRepository.create(loginData);
    
    return await loginHistoryRepository.save(loginHistory);
  }
}

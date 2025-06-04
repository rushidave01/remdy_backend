import { Like } from "typeorm";
import { City, Country, Gender, Province, State } from "../entities";

export class PublicService {
  /*
    async getRegion(): Promise<Region | any> {
        return await Region.find();
    }
    
    async getStatesByRegion(regionId:number): Promise<State | any> {
        return await State.find({where:{region:regionId}});
    }
    async getCities(): Promise<City | any> {
        return await City.find();
    }
    
    async getCitiesByStateId(stateId:number): Promise<City | any> {
        return await City.find({where:{state_id:stateId}});
    }
    */

  async getCountries(options: {
    countryId?: number;
    countryName?: string;
  }): Promise<Country[]> {
    const { countryId, countryName } = options;

    const condition: any = {};

    if (countryName) {
      condition.name = Like(`%${countryName}%`);
    }

    if (countryId) {
      condition.id = countryId;
    }

    return Country.find({
      where: {
        name: Like(`%${countryName}%`),
      },
    });
  }

  async getStates(options: { countryId?: number }): Promise<State[]> {
    const { countryId } = options;
    const condition: any = {};

    if (countryId) {
      condition.country = { id: countryId };
    }

    return State.find({
      where: condition,
    });
  }

  async getCityById(cityId: number): Promise<City> {
    const city = await City.findOne({
      where: { id: cityId },
    });

    if (!city) {
      throw new Error("City not found");
    }

    return city;
  }

  async getProvinceById(provinceId: number): Promise<Province> {
    const province = await Province.findOne({
      where: { id: provinceId },
    });

    if (!province) {
      throw new Error("Province not found");
    }

    return province;
  }

  async getGenderById(genderId: number): Promise<Gender> {
    const gender = await Gender.findOne({
      where: { id: genderId },
    });

    if (!gender) {
      throw new Error("Gender not found");
    }

    return gender;
  }
}

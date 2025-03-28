import { Country, State } from "../../entities";


export class CountryResponseDTO {
    country_id: number;
    country_name: string;

    constructor(country: Country){
        this.country_id = country.id;
        this.country_name = country.name;
    }
}

export class StateResponseDTO {
    state_id: number;
    state_name: string;

    constructor(country: State){
        this.state_id = country.id;
        this.state_name = country.name;
    }
}
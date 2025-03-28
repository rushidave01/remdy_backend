import { Request, Response } from 'express';
import { PublicService } from "../services";
import { CountryResponseDTO, StateResponseDTO } from '../dtos';
import { HttpStatusCode } from 'axios';

const publicService = new PublicService();

export class PublicController {
    /*
    async getRegion(req: Request, res: Response): Promise<any> {
        try{
            const region = await publicService.getRegion();
            
            if(region.length > 0){
                const responseData = region.map((regions: { id: bigint; name: string; status: number; }) => new regionResponseDTO(regions.id, regions.name, regions.status));
                return res.status(200).json({statue:true,message:"Region Fetch Successfully",data:responseData});
            }
            return res.status(400).json({statue:false,message:"No Region Exist",data:{}})
        }catch(error:any){
            res.status(500).json({ error: error.message });
        }
    }

    async getCities(req: Request, res: Response): Promise<any> {
        try{
            const stateId : number = parseInt(req.params.state);
            if(stateId){
            const cities = await publicService.getCitiesByStateId(stateId);
            if(cities.length > 0){
                const responseData = cities.map((city:{id: bigint; name:string; stateId:number; status:number;})=>new cityResponseDTO(city.id,city.name,city.stateId,city.status));
                return res.status(200).json({statue:true,message:"Cities Fetch By StateId Successfully",data:responseData});
            }
            return res.status(400).json({statue:false,message:"No Cities Exist",data:{}})
        }else{
            const cities = await publicService.getCities();
            if(cities.length > 0){
                const responseData = cities.map((city:{id: bigint; name:string; stateId:number; status:number;})=>new cityResponseDTO(city.id,city.name,city.stateId,city.status));
                return res.status(200).json({statue:true,message:"Cities Fetch Successfully",data:responseData});
            }
            return res.status(400).json({statue:false,message:"No Cities Exist",data:{}})
        }
        }catch(error:any){
            res.status(500).json({ error: error.message });
        }
    }

    async getStates(req: Request, res: Response): Promise<any> {
        try{
            const regionId : number = parseInt(req.params.region);
            if(regionId){
                const states = await publicService.getStatesByRegion(regionId);
            if(states.length > 0){
                const responseData = states.map((state: { id: bigint; name: string; region:number; status: number; }) => new stateResponseDTO(state.id, state.name, state.region, state.status));
                return res.status(200).json({statue:true,message:"States Fetch By Region Id Successfully",data:responseData});
            }
            return res.status(400).json({statue:false,message:"No State Exist",data:{}})
            }else{
            const states = await publicService.getStates();
            if(states.length > 0){
                const responseData = states.map((state: { id: bigint; name: string; region:number; status: number; }) => new stateResponseDTO(state.id, state.name, state.region, state.status));
                return res.status(200).json({statue:true,message:"States Fetch Successfully",data:responseData});
            }
            return res.status(400).json({statue:false,message:"No State Exist",data:{}})
        }
        }catch(error:any){
            res.status(500).json({ error: error.message });
        }
    }
    */

    async getCountries(req: Request, res: Response): Promise<any> {
        try{
            const { country_name: countryName } = req.query;

            if (!countryName){
                return res
                .status(HttpStatusCode.BadRequest)
                .json({
                    statue:true,
                    message:"Country_name is required",
                });
            }

            const countries = await publicService.getCountries({countryName: countryName as string});
            const responseData = countries.map((country) => new CountryResponseDTO(country));
            
            return res
                .status(200)
                .json({
                    statue:true,
                    message:"countries fetched Successfully",
                    data:responseData
                });
        }catch(error:any){
            res.status(500).json({ message: `something went wrong!` });
        }
    }

    async getStatesByCountryId(req: Request, res: Response): Promise <any> {
        try{
            const { country_id: countryId } = req.params;

            if (!countryId){
                return res
                .status(HttpStatusCode.BadRequest)
                .json({
                    statue:true,
                    message:"Country_id is required",
                });
            }

            const states = await publicService.getStates({countryId: parseInt(countryId)});
            const responseData = states.map((state) => new StateResponseDTO(state));
            
            return res
                .status(200)
                .json({
                    statue:true,
                    message:"states fetched Successfully",
                    data: responseData
                });
        }catch(error:any){
            res.status(500).json({ message: `something went wrong!` });
        }
    }
}
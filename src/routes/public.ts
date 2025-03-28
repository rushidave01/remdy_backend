import express from "express";
import { PublicController } from "../controllers/PublicController";

const publicRouter = express.Router();
const publicController = new PublicController();

// publicRouter.get('/regions', publicController.getRegion);
publicRouter.get("/countries", publicController.getCountries);
publicRouter.get("/states/:country_id", publicController.getStatesByCountryId);

export default publicRouter;

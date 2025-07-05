import { Router } from "express";
import { PromoBannerController } from "./promoBanner.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../User/user.contant";
import { updloadSingleImage } from "../../config/cloudinary/multer.config";
import { validateRequestedFileData } from "../../middleware/validateRequestedFileData";
import { PromoBannerValidation } from "./promoBanner.validation";


const router = Router();

router.post("/create-promo-banner",
    auth(UserRole.admin, UserRole.superAdmin),
     updloadSingleImage("promo-banner"),
     validateRequestedFileData(PromoBannerValidation.PromoBannerSchema),
     PromoBannerController.createPromoBannerIntoDB
    )

router.get('/get-all-promo-banner', PromoBannerController.getAllPromoBannerDB )


export const PromoBannerRoutes = router






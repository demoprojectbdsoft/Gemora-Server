import { Router } from "express";
import { validate } from "../../utils/validate";
import { createSlideSchema, updateSlideSchema } from "./slide.validator";
import * as slideController from "./slide.controller";

const router = Router();

router.get("/", slideController.getSlides);
router.post("/", validate(createSlideSchema), slideController.createSlide);
router.patch("/:id", validate(updateSlideSchema), slideController.updateSlide);
router.delete("/:id", slideController.deleteSlide);

export default router;
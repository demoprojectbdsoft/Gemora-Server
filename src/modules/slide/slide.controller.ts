import { catchAsync } from "../../utils/catchAsync";
import { apiResponse } from "../../utils/apiResponse";
import * as slideService from "./slide.service";

export const createSlide = catchAsync(async (req, res) => {
  const slide = await slideService.createSlide(req.body);
  apiResponse(res, 201, slide, "Slide created");
});

export const getSlides = catchAsync(async (req, res) => {
  const isActive =
    req.query.isActive === "true" ? true :
    req.query.isActive === "false" ? false :
    undefined;

  const slides = await slideService.getSlides({ isActive });
  apiResponse(res, 200, slides);
});

export const updateSlide = catchAsync(async (req, res) => {
  const slide = await slideService.updateSlide(req.params.id as string, req.body);
  apiResponse(res, 200, slide, "Slide updated");
});

export const deleteSlide = catchAsync(async (req, res) => {
  await slideService.deleteSlide(req.params.id as string);
  apiResponse(res, 200, null, "Slide deleted");
});
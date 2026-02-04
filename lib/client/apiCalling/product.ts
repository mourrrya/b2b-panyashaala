import {
  ErrorResponse,
  ProductWithVariantsImagesReviews,
  SuccessRes,
} from "@/types/api.payload.types";
import { axiosInstance } from "./axios-config";

export const productListFetcher = async (
  url: string,
): Promise<SuccessRes<ProductWithVariantsImagesReviews[]> | ErrorResponse> => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return error as ErrorResponse;
  }
};
export const productFetcher = async (
  url: string,
): Promise<SuccessRes<ProductWithVariantsImagesReviews> | ErrorResponse> => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return error as ErrorResponse;
  }
};

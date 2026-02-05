import { ErrorServerRes, SuccessRes } from "@/types/api.payload.types";
import { ProductWithVariantsImagesReviews } from "@/types/product";
import { axiosInstance } from "./axios-config";

export const productListFetcher = async (
  url: string,
): Promise<SuccessRes<ProductWithVariantsImagesReviews[]> | ErrorServerRes> => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return error as ErrorServerRes;
  }
};
export const productFetcher = async (
  url: string,
): Promise<SuccessRes<ProductWithVariantsImagesReviews> | ErrorServerRes> => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return error as ErrorServerRes;
  }
};

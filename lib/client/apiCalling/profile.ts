import { Customer } from "@/prisma/generated/prisma/browser";
import { SuccessRes } from "@/types/api.payload.types";
import { User } from "@supabase/supabase-js";
import { axiosInstance } from "./axios-config";

export const createUserProfile = async (
  url: string,
  { arg }: { arg: User },
): Promise<SuccessRes<Customer>> => {
  try {
    const res = await axiosInstance.post(url, arg);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProfile = async (
  url: string,
): Promise<SuccessRes<Customer>> => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

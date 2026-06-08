import { api } from "@/lib/axios";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export const registerUser = async (payload: RegisterPayload) => {
  const response = await api.post("/auth/register", payload);
  return response.data.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const response = await api.post("/auth/login", payload);
  return response.data.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

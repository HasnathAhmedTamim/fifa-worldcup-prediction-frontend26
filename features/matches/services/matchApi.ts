import { api } from "@/lib/axios";

export const getMatchesByDate = async (date: string) => {
  const response = await api.get(`/matches/by-date?date=${date}`);
  return response.data.data;
};

export const getAllMatches = async () => {
  const response = await api.get("/matches");
  return response.data.data;
};

export const getTodayMatches = async () => {
  const response = await api.get("/matches/today");
  return response.data.data;
};

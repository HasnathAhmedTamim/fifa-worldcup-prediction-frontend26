import { api } from "@/lib/axios";

export const getLeaderboard = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await api.get(`/leaderboard?page=${page}&limit=${limit}`);
  return response.data.data;
};

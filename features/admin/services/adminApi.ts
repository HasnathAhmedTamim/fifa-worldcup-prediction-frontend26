import { api } from "@/lib/axios";

type UpdateResultPayload = {
  actual_team_a_score: number;
  actual_team_b_score: number;
  actual_qualifier?: string;
};

type ConfirmTeamsPayload = {
  team_a: string;
  team_b: string;
};

type CreateMatchPayload = {
  match_no?: number;
  team_a?: string;
  team_b?: string;
  team_a_placeholder?: string;
  team_b_placeholder?: string;
  match_date: string;
  match_time: string;
  kickoff_at: string;
  stage: "group" | "knockout";
  round_name?: string;
  group_name?: string;
  venue?: string;
  status?: "pending" | "upcoming" | "live" | "completed" | "cancelled";
};

export const createMatch = async (payload: CreateMatchPayload) => {
  const response = await api.post("/admin/matches", payload);
  return response.data.data;
};

export const updateMatchResult = async ({
  matchId,
  payload,
}: {
  matchId: number;
  payload: UpdateResultPayload;
}) => {
  const response = await api.patch(`/admin/matches/${matchId}/result`, payload);
  return response.data.data;
};

export const confirmKnockoutTeams = async ({
  matchId,
  payload,
}: {
  matchId: number;
  payload: ConfirmTeamsPayload;
}) => {
  const response = await api.patch(
    `/admin/matches/${matchId}/confirm-teams`,
    payload,
  );

  return response.data.data;
};

export const getMatchPredictions = async ({
  matchId,
  page,
  limit,
}: {
  matchId: number;
  page: number;
  limit: number;
}) => {
  const response = await api.get(
    `/admin/matches/${matchId}/predictions?page=${page}&limit=${limit}`,
  );

  return response.data.data;
};

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data.data;
};
export const getAdminUsers = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return response.data.data;
};


type UpdateMatchStatusPayload = {
  status: "pending" | "upcoming" | "live" | "completed" | "cancelled";
};


export const updateMatchStatus = async ({
  matchId,
  payload,
}: {
  matchId: number;
  payload: UpdateMatchStatusPayload;
}) => {
  const response = await api.patch(`/admin/matches/${matchId}/status`, payload);
  return response.data.data;
};
import { api } from "@/lib/axios";

type SubmitPredictionPayload = {
  match_id: number;
  predicted_team_a_score: number;
  predicted_team_b_score: number;
  predicted_qualifier?: string;
};

export const submitPrediction = async (payload: SubmitPredictionPayload) => {
  const response = await api.post("/predictions", payload);
  return response.data.data;
};

export const getMyPredictions = async () => {
  const response = await api.get("/predictions/my");
  return response.data.data;
};

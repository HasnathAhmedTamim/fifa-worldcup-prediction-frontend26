"use client";

import { CalendarDays, MapPin, Shield, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PredictionForm } from "@/features/predictions/components/PredictionForm";
import { getStoredToken } from "@/lib/auth";

type Match = {
  id: number;
  match_no: number;
  team_a: string | null;
  team_b: string | null;
  team_a_placeholder: string | null;
  team_b_placeholder: string | null;
  match_date: string;
  match_time: string;
  stage: "group" | "knockout";
  round_name: string;
  group_name: string | null;
  venue: string;
  status: string;
};

type ExistingPrediction = {
  predicted_team_a_score: number;
  predicted_team_b_score: number;
  predicted_qualifier?: string | null;
};

type Props = {
  match: Match;
  existingPrediction?: ExistingPrediction | null;
};

const getDateOnly = (date: string) => date?.slice(0, 10);

export const MatchCard = ({ match, existingPrediction }: Props) => {
  const token = getStoredToken();

  const isTeamConfirmed = Boolean(match.team_a && match.team_b);
  const isPredictionOpen = match.status === "upcoming" && isTeamConfirmed;

  const teamA = match.team_a || match.team_a_placeholder || "TBD";
  const teamB = match.team_b || match.team_b_placeholder || "TBD";

  const getStatusVariant = () => {
    if (match.status === "completed") return "default";
    if (match.status === "cancelled") return "destructive";
    if (match.status === "upcoming") return "secondary";
    return "outline";
  };

  return (
    <Card className="modern-card overflow-hidden">
      <CardContent className="p-0">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-5 p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getStatusVariant()} className="capitalize">
                {match.status}
              </Badge>

              <Badge variant="outline" className="capitalize">
                {match.stage}
              </Badge>

              {match.group_name && (
                <Badge variant="secondary">{match.group_name}</Badge>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">
                Match {match.match_no} • {match.round_name}
              </p>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-3xl border bg-background/40 p-4">
                  <p className="text-xs text-muted-foreground">Team A</p>
                  <h3 className="mt-1 font-heading text-xl font-black md:text-2xl">
                    {teamA}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full border bg-secondary text-sm font-black">
                  VS
                </div>

                <div className="rounded-3xl border bg-background/40 p-4 text-right">
                  <p className="text-xs text-muted-foreground">Team B</p>
                  <h3 className="mt-1 font-heading text-xl font-black md:text-2xl">
                    {teamB}
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2 rounded-2xl border bg-background/40 p-3 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-emerald-400" />
                <span>
                  {getDateOnly(match.match_date)} at {match.match_time}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border bg-background/40 p-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>{match.venue}</span>
              </div>
            </div>

            {!isTeamConfirmed && (
              <div className="rounded-3xl border border-dashed bg-background/30 p-4 text-sm text-muted-foreground">
                Teams are not confirmed yet. Prediction is not open.
              </div>
            )}

            {!token && isPredictionOpen && (
              <div className="rounded-3xl border bg-secondary/40 p-4 text-sm font-medium text-muted-foreground">
                Please login to submit your prediction.
              </div>
            )}

            {token && !isPredictionOpen && (
              <div className="rounded-3xl border bg-background/30 p-4 text-sm font-medium text-muted-foreground">
                Prediction closed.
              </div>
            )}
          </div>

          <div className="border-t bg-background/25 p-5 md:p-6 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-card">
                {match.stage === "knockout" ? (
                  <Trophy className="h-5 w-5 text-amber-400" />
                ) : (
                  <Shield className="h-5 w-5 text-emerald-400" />
                )}
              </div>

              <div>
                <p className="font-heading font-bold">Prediction Panel</p>
                <p className="text-xs text-muted-foreground">
                  {existingPrediction
                    ? "Update before kickoff"
                    : "Submit before kickoff"}
                </p>
              </div>
            </div>

            {token && isPredictionOpen ? (
              <PredictionForm
                match={{
                  id: match.id,
                  team_a: match.team_a!,
                  team_b: match.team_b!,
                  stage: match.stage,
                }}
                existingPrediction={existingPrediction}
              />
            ) : (
              <div className="rounded-3xl border bg-card/60 p-5 text-sm text-muted-foreground">
                Prediction form is unavailable for this match.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateMatchResult } from "../services/adminApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
    matchId: number;
    stage: "group" | "knockout";
    teamA: string | null;
    teamB: string | null;
};

export const UpdateResultForm = ({ matchId, stage, teamA, teamB }: Props) => {
    const queryClient = useQueryClient();

    const [teamAScore, setTeamAScore] = useState("");
    const [teamBScore, setTeamBScore] = useState("");
    const [qualifier, setQualifier] = useState("");

    const mutation = useMutation({
        mutationFn: updateMatchResult,
        onSuccess: () => {
            toast.success("Result updated and points calculated");

            queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: ["admin-match-predictions"] });
            queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
            queryClient.invalidateQueries({ queryKey: ["my-predictions"] });
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            queryClient.invalidateQueries({ queryKey: ["matches-by-date"] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update result");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (teamAScore === "" || teamBScore === "") {
            toast.error("Both actual scores are required");
            return;
        }

        if (stage === "knockout" && !qualifier) {
            toast.error("Actual qualifier is required for knockout match");
            return;
        }

        mutation.mutate({
            matchId,
            payload: {
                actual_team_a_score: Number(teamAScore),
                actual_team_b_score: Number(teamBScore),
                actual_qualifier: qualifier || undefined,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
            <p className="font-medium">Update Actual Result</p>

            <div className="grid grid-cols-3 items-end gap-3">
                <div>
                    <label className="mb-1 block text-sm font-medium">{teamA}</label>
                    <Input
                        type="number"
                        min={0}
                        value={teamAScore}
                        onChange={(e) => setTeamAScore(e.target.value)}
                        placeholder="0"
                    />
                </div>

                <div className="pb-2 text-center text-xl font-bold">-</div>

                <div>
                    <label className="mb-1 block text-sm font-medium">{teamB}</label>
                    <Input
                        type="number"
                        min={0}
                        value={teamBScore}
                        onChange={(e) => setTeamBScore(e.target.value)}
                        placeholder="0"
                    />
                </div>
            </div>

            {stage === "knockout" && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">Actual qualified team</p>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant={qualifier === teamA ? "default" : "outline"}
                            onClick={() => teamA && setQualifier(teamA)}
                        >
                            {teamA}
                        </Button>

                        <Button
                            type="button"
                            variant={qualifier === teamB ? "default" : "outline"}
                            onClick={() => teamB && setQualifier(teamB)}
                        >
                            {teamB}
                        </Button>
                    </div>
                </div>
            )}

            <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Updating..." : "Update Result"}
            </Button>
        </form>
    );
};